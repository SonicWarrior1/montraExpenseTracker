import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
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
import { encrypt } from '../utils/encryption';
import { UpdateMode } from 'realm';
import { CategoryModel } from '../DbModels/CategoryModel';
import { handleNotify } from '../utils/firebase';
export function useInitialSetup() {
    const realm = useRealm();
    const { isConnected } = useNetInfo();
    const data = useQuery(OfflineTransactionModel);
    const budget = useQuery(BudgetModel);
    const category = useQuery(CategoryModel);
    const user = useAppSelector(state => state.user.currentUser);
    const conversion = useAppSelector(state => state.transaction.conversion);
    useEffect(() => {
        if (user !== undefined) {
            syncDb({ uid: user.uid, conversion: conversion, currency: user.currency, data: data, isConnected: isConnected!, realm: realm, budget: budget, incomeCategory: user.incomeCategory, expenseCategory: user.expenseCategory, category: category });
        }
    }, [isConnected]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('users')
            .doc(user!.uid)
            .onSnapshot(snapshot => {
                const user = UserFromJson(snapshot.data() as UserType);
                // console.log(user);
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
                    // console.log('DATATATATA', data);
                    let expense: { [key: string]: { [key: string]: number } } = {};
                    let income: { [key: string]: { [key: string]: number } } = {};
                    for (const item of data) {
                        // console.log('sdhbfsjdbfsjdfnksjdfnkdjsbkf', item);
                        if (item.deleted) {
                            firestore().collection('users').doc(user.uid).collection('transactions').doc(item.id).delete();
                            setTimeout(() => realm.write(() => {
                                const transaction = realm.objectForPrimaryKey('OnlineTransaction', item.id);
                                // console.log('transaction', transaction);
                                if (transaction !== undefined || transaction !== null) {
                                    realm.delete(transaction);
                                }
                            }), 800);
                            break;
                        }
                        const month = Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate().getMonth();
                        // console.log('====================================');
                        // console.log(item.amount, item.id);
                        // console.log('====================================');
                        if (item.type === 'income') {
                            if (income?.[month] !== undefined) {
                                income[month][item.category] = (income?.[month]?.[item.category] ?? 0) + item.amount;
                            } else {
                                income[month] = {};
                                income[month][item.category] = 0;
                                income[month][item.category] = (income?.[month]?.[item.category] ?? 0) + item.amount;
                            }
                        } else {
                            if (expense?.[month] !== undefined) {
                                expense[month][item.category] = (expense?.[month]?.[item.category] ?? 0) + item.amount;
                            } else {
                                expense[month] = {};
                                expense[month][item.category] = 0;
                                expense[month][item.category] = (expense?.[month]?.[item.category] ?? 0) + item.amount;
                            }
                        }
                        realm.write(() => {
                            // realm.delete(item)
                            realm.create('OnlineTransaction', { ...item, changed: false }, UpdateMode.All);
                        });
                    }

                    for (const month in income) {
                        for (const category in income[month]) {
                            income[month][category] = encrypt(String(income[month][category]), user.uid);
                        }
                    }
                    for (const month in expense) {
                        for (const category in expense[month]) {
                            expense[month][category] = encrypt(String(expense[month][category]), user.uid);
                        }
                    }
                    await firestore()
                        .collection('users')
                        .doc(user.uid).update({
                            income: income,
                            spend: expense,
                        });
                });
            return () => unsubscribe();
        }
    }, []);

}
