import { OfflineTransactionModel } from '../DbModels/OfflineTransactionModel';
import firestore, { deleteField, FirebaseFirestoreTypes, Timestamp } from '@react-native-firebase/firestore';
import storage, { firebase } from '@react-native-firebase/storage';
import { encrypt } from '../utils/encryption';
import Realm, { Results } from 'realm';
import { BudgetModel } from '../DbModels/BudgetModel';
import { CategoryModel } from '../DbModels/CategoryModel';
import { AmountModel } from '../DbModels/AmountModel';
import { NotificationModel } from '../DbModels/NotificationModel';
export const syncDb = async ({
    uid, data, isConnected, realm, budget, incomeCategory, expenseCategory, category,
    amounts, notifications,
}: {
    uid: string,
    data: Results<OfflineTransactionModel>,
    isConnected: boolean,
    realm: Realm
    budget: Results<BudgetModel>
    incomeCategory: string[],
    expenseCategory: string[],
    category: Results<CategoryModel>,
    amounts: Results<AmountModel>
    notifications: Results<NotificationModel>
}) => {
    console.log(uid);
    console.log('sync');
    if ((data.length > 0 || budget.length > 0 || category.length > 0 || amounts.length > 0 || notifications.length > 0) && isConnected) {
        try {
            const batch = firestore().batch();
            syncAmounts(amounts, batch, uid, realm)
            syncBudgets(budget, batch, uid, realm)
            syncCategory(category, batch, uid, realm, expenseCategory, incomeCategory)
            syncNotifications(notifications, batch, uid, realm)
            if (data.length > 0) {
                await syncTransaction(data, batch, uid, realm)
            }
            await batch.commit();
            console.log('DB SYNC Done');
        } catch (e) {
            console.log('SYNC ERROR', e);
        }
    }
};

const syncAmounts = (amounts: Results<AmountModel>, batch: FirebaseFirestoreTypes.WriteBatch, uid: string, realm: Realm) => {
    if (amounts.length > 0) {
        console.log('Amount Syncing');
        for (const item of amounts) {
            const month = item.id.split('_')[0];
            const category = item.id.split('_')[1];
            const type = item.id.split('_')[2];
            console.log(item);
            if (type === 'income') {
                batch.update(firestore().collection('users').doc(uid), {
                    [`income.${month}.${category}`]: encrypt(String(item.amount), uid),
                });
            } else {
                batch.update(firestore().collection('users').doc(uid), {
                    [`spend.${month}.${category}`]: encrypt(String(item.amount), uid),
                });
            }
        }
        realm.write(() => {
            realm.delete(amounts);
        });
    }
}
const syncBudgets = (budget: Results<BudgetModel>, batch: FirebaseFirestoreTypes.WriteBatch, uid: string, realm: Realm) => {
    if (budget.length > 0) {
        console.log('Budget Syncing');
        for (const item of budget) {
            const month = item.id.split('_')[0];
            const category = item.id.split('_')[1];
            if (item.delete) {
                batch.update(firestore().collection('users').doc(uid), {
                    [`budget.${month}.${category}`]: deleteField(),
                });
            } else {
                batch.update(firestore().collection('users').doc(uid), {
                    [`budget.${month}.${category}`]: {
                        limit: encrypt(
                            String(item.limit),
                            uid,
                        ),
                        alert: item.alert,
                        percentage: encrypt(String(item.percentage), uid),
                    },
                });
            }
        }
        realm.write(() => {
            realm.delete(budget);
        });
    }
}
const syncCategory = (category: Results<CategoryModel>, batch: FirebaseFirestoreTypes.WriteBatch, uid: string, realm: Realm, expenseCategory: string[], incomeCategory: string[]) => {
    if (category.length > 0) {
        console.log('Category Syncing');
        batch.update(firestore().collection('users').doc(uid), {
            expenseCategory: expenseCategory.concat(category.filter((cat) => cat.type === 'expense' && !expenseCategory.includes(cat.name)).reduce((acc: string[], item) => {
                acc.push(item.name);
                return acc;
            }, [])).map(
                item => encrypt(item, uid),
            ), incomeCategory: incomeCategory.concat(category.filter((cat) => cat.type === 'income' && !incomeCategory.includes(cat.name)).reduce((acc: string[], item) => {
                acc.push(item.name);
                return acc;
            }, [])).map(
                item => encrypt(item, uid),
            ),
        });
        realm.write(() => {
            realm.delete(category);
        });
    }
}
const syncNotifications = (notifications: Results<NotificationModel>, batch: FirebaseFirestoreTypes.WriteBatch, uid: string, realm: Realm) => {
    if (notifications.length > 0) {
        console.log('Notification Syncing');
        for (const item of notifications) {
            if (item.deleted) {
                batch.update(firestore().collection('users').doc(uid), { [`notification.${item.id}`]: deleteField() });
            } else {
                batch.update(firestore().collection('users').doc(uid), {
                    [`notification.${item.id}`]: {
                        type: encrypt(item.type, uid),
                        category: encrypt(item.category, uid),
                        id: item.id,
                        time: item.time,
                        read: item.read,
                        percentage: item.percentage,
                    },

                });
            }
        }
        realm.write(() => {
            realm.delete(notifications);
        });
    }
}
const syncTransaction = async (data: Results<OfflineTransactionModel>, batch: FirebaseFirestoreTypes.WriteBatch, uid: string, realm: Realm) => {

    console.log('Transanction Syncing');
    for (const item of data) {
        let url = '';
        if (item.operation === 'add' || item.operation === 'update') {
            await tranAddEdit(item, batch, url, uid)
        } else if (item.operation === 'delete') {
            try {
                batch.delete(firestore().collection('users').doc(uid).collection('transactions').doc(item.id));
                if (item.attachementType !== 'none') {
                    await storage().ref(`users/${uid}/${item.id}`).delete();
                }
            } catch (e) {
                console.log('inner', e);
            }
        }
    }
    realm.write(() => {
        realm.delete(data);
    });

}

const tranAddEdit = async (item: OfflineTransactionModel, batch: FirebaseFirestoreTypes.WriteBatch, url: string, uid: string) => {
    if (item.attachementType !== 'none') {
        if (item.attachement !== '') {
            if (!item.attachement?.startsWith('https://firebasestorage.googleapis.com')) {
                await storage().ref(`users/${uid}/${item.id}`).putString(item.attachement!, firebase.storage.StringFormat.BASE64);
                url = await storage().ref(`users/${uid}/${item.id}`).getDownloadURL();
            } else {
                url = item.attachement;
            }
        }
    }
    batch.set(firestore().collection('users').doc(uid).collection('transactions').doc(item.id), {
        amount: encrypt(String((Number(item.amount))), uid),
        category: encrypt(item.category, uid),
        desc: encrypt(item.desc, uid),
        wallet: encrypt(item.wallet, uid),
        attachement: encrypt(url, uid),
        repeat: item.freq !== undefined,
        freq: item.freq ? {
            freq: encrypt(item.freq.freq, uid),
            month: encrypt(String(item.freq.month), uid),
            day: encrypt(String(item.freq.day), uid),
            weekDay: encrypt(String(item.freq.weekDay), uid),
            end: encrypt(item.freq.end, uid),
            date: item.freq.date,
        } : null,
        id: item.id,
        timeStamp: Timestamp.now(),
        type: encrypt(item.type, uid),
        attachementType: encrypt(item.attachementType, uid),
        from: encrypt(item.from, uid),
        to: encrypt(item.to, uid),
    });
}