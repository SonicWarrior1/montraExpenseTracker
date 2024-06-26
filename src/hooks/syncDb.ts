import { OfflineTransactionModel } from '../DbModels/OfflineTransactionModel';
import firestore, { deleteField, Timestamp } from '@react-native-firebase/firestore';
import storage, { firebase } from '@react-native-firebase/storage';
import { encrypt } from '../utils/encryption';
import Realm, { Results } from 'realm';
import { BudgetModel } from '../DbModels/BudgetModel';
import { CategoryModel } from '../DbModels/CategoryModel';
import { AmountModel } from '../DbModels/AmountModel';
import { NotificationModel } from '../DbModels/NotificationModel';
export const syncDb = async ({
    uid, data, isConnected, realm, budget, incomeCategory, expenseCategory, category,
    amounts, notifications
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
            if (amounts.length > 0) {
                console.log("Amount Syncing")
                for (const item of amounts) {
                    const month = item.id.split('_')[0]
                    const category = item.id.split('_')[1]
                    const type = item.id.split('_')[2];
                    console.log(item)
                    if (type === 'income') {
                        batch.update(firestore().collection('users').doc(uid), {
                            [`income.${month}.${category}`]: encrypt(String(item.amount), uid)
                        })
                    } else {
                        batch.update(firestore().collection('users').doc(uid), {
                            [`spend.${month}.${category}`]: encrypt(String(item.amount), uid)
                        })
                    }
                }
                realm.write(() => {
                    realm.delete(amounts);
                });
            }
            // if (budget.length > 0) {
            //     console.log("Budget Syncing")
            //     for (const item of budget) {
            //         const month = item.id.split('_')[0];
            //         const category = item.id.split('_')[1];
            //         if (item.delete) {
            //             batch.update(firestore().collection('users').doc(uid), {
            //                 [`budget.${month}.${category}`]: deleteField(),
            //             });
            //         } else {
            //             batch.update(firestore().collection('users').doc(uid), {
            //                 [`budget.${month}.${category}`]: {
            //                     limit: encrypt(
            //                         String(item.limit),
            //                         uid,
            //                     ),
            //                     alert: item.alert,
            //                     percentage: encrypt(String(item.percentage), uid),
            //                 },
            //             });
            //         }
            //     }
            //     realm.write(() => {
            //         realm.delete(budget);
            //     });
            // }
            // if (category.length > 0) {
            //     console.log("Category Syncing")
            //     batch.update(firestore().collection('users').doc(uid), {
            //         expenseCategory: expenseCategory.concat(category.filter((cat) => cat.type === 'expense').reduce((acc: string[], item) => {
            //             acc.push(item.name);
            //             return acc;
            //         }, [])).map(
            //             item => encrypt(item, uid),
            //         ), incomeCategory: incomeCategory.concat(category.filter((cat) => cat.type === 'income').reduce((acc: string[], item) => {
            //             acc.push(item.name);
            //             return acc;
            //         }, [])).map(
            //             item => encrypt(item, uid),
            //         ),
            //     });
            //     realm.write(() => {
            //         realm.delete(category);
            //     });
            // }
            // if (notifications.length > 0) {
            //     console.log("Notification Syncing")
            //     for (const item of notifications) {
            //         console.log("chlaa")
            //         batch.update(firestore().collection('users').doc('uid'), {
            //             [`notification.${item.id}`]: {
            //                 type: encrypt(item.type, uid),
            //                 category: encrypt(item.category, uid),
            //                 id: item.id,
            //                 time: item.time,
            //                 read: item.read,
            //                 percentage: item.percentage,
            //             },

            //         })
            //     }
            //     realm.write(() => {
            //         realm.delete(notifications)
            //     })
            // }
            if (data.length > 0) {
                console.log("Transanction Syncing")
                for (const item of data) {
                    let url = '';
                    if (item.operation === 'add' || item.operation === 'update') {
                        if (item.attachementType !== 'none') {
                            if (item.attachement !== '') {
                                if (!item.attachement?.startsWith('https://firebasestorage.googleapis.com')) {
                                    console.log(item.attachement);
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
                    } else if (item.operation === 'delete') {
                        batch.delete(firestore().collection('users').doc(uid).collection('transactions').doc(item.id));
                        if (item.attachementType !== 'none') {
                            await storage().ref(`users/${uid}/${item.id}`).delete();
                        }
                    }
                }
                realm.write(() => {
                    realm.delete(data);
                });
            }

            await batch.commit();
            console.log('DB SYNC Done');
        } catch (e) {
            console.log('SYNC ERROR', e);
        }
    }

};
