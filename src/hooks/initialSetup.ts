import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import firestore from '@react-native-firebase/firestore';
import { transactionType } from '../defs/transaction';
import { userLoggedIn } from '../redux/reducers/userSlice';
import { UserType } from '../defs/user';
import { UserFromJson } from '../utils/userFuncs';
import { TransFromJson } from '../utils/transFuncs';
import { useQuery, useRealm } from '@realm/react';
import { useNetInfo } from '@react-native-community/netinfo';
import { syncDb } from './syncDb';
import { OfflineTransactionModel } from '../DbModels/OfflineTransactionModel';
import { BudgetModel } from '../DbModels/BudgetModel';
import { UpdateMode } from 'realm';
import { CategoryModel } from '../DbModels/CategoryModel';
import { AmountModel } from '../DbModels/AmountModel';
import { NotificationModel } from '../DbModels/NotificationModel';
export function useInitialSetup() {
    const realm = useRealm();
    const { isConnected } = useNetInfo();
    const data = useQuery(OfflineTransactionModel);
    const budget = useQuery(BudgetModel);
    const category = useQuery(CategoryModel);
    const amounts = useQuery(AmountModel)
    const notfications = useQuery(NotificationModel)
    const user = useAppSelector(state => state.user.currentUser);
    useEffect(() => {
        if (user !== undefined) {
            syncDb({
                uid: user.uid,
                data: data,
                isConnected: isConnected!,
                realm: realm, budget: budget,
                incomeCategory: user.incomeCategory,
                expenseCategory: user.expenseCategory,
                category: category,
                amounts: amounts,
                notifications: notfications
            });
        }
    }, [isConnected]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('users')
            .doc(user!.uid)
            .onSnapshot(snapshot => {
                const user = UserFromJson(snapshot.data() as UserType);
                console.log(user);
                dispatch(userLoggedIn(user));
            });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log('uid', user?.uid);
        if (user) {
            const unsubscribe = firestore()
                .collection('users')
                .doc(user.uid)
                .collection('transactions')
                .orderBy('timeStamp', 'desc')
                .onSnapshot(async (snapshot) => {
                    const data: transactionType[] = snapshot.docs.map(
                        doc => (TransFromJson(doc.data(), user.uid)),
                    );

                    for (const item of data) {
                        if (item.deleted) {
                            firestore().collection('users').doc(user.uid).collection('transactions').doc(item.id).delete();
                            setTimeout(() => realm.write(() => {
                                const transaction = realm.objectForPrimaryKey('OnlineTransaction', item.id);
                                if (transaction !== undefined || transaction !== null) {
                                    realm.delete(transaction);
                                }
                            }), 1000);
                            break;
                        }
                        realm.write(() => {
                            // realm.delete(item)
                            realm.create('OnlineTransaction', { ...item, changed: false }, UpdateMode.All);
                        });
                    }
                });
            return () => unsubscribe();
        }
    }, []);

}
