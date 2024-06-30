import firestore, { FirebaseFirestoreTypes, Timestamp } from '@react-native-firebase/firestore';
import { repeatDataType, transactionType } from '../defs/transaction';
import { UserFromJson, UserToJson } from './userFuncs';
import { UserType } from '../defs/user';
import storage from '@react-native-firebase/storage';
import notifee from '@notifee/react-native';
import uuid from 'react-native-uuid';
import { encrypt } from './encryption';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { OnlineTransactionModel } from '../DbModels/OnlineTransactionModel';
import { OfflineTransactionModel } from '../DbModels/OfflineTransactionModel';
import { RepeatDataModel } from '../DbModels/RepeatDataModel';
import { UpdateMode } from 'realm';
import { setExpense, setIncome, userLoggedIn } from '../redux/reducers/userSlice';
import { TransFromJson } from './transFuncs';
import Realm from '@realm/react';
export function createTransaction({
    id,
    url,
    attachementType,
    amount,
    conversion,
    currency,
    category,
    desc, wallet,
    repeatData,
    isEdit,
    transaction,
    pageType,
    uid,
    from,
    to,
}: {
    id: string;
    url: string;
    attachementType: transactionType['attachementType'];
    amount: string,
    conversion: {
        [key: string]: {
            [key: string]: number;
        };
    },
    currency: string,
    category: string,
    desc: string,
    wallet: string,
    repeatData: repeatDataType | RepeatDataModel,
    isEdit: boolean,
    transaction: transactionType | OnlineTransactionModel | OfflineTransactionModel,
    pageType: 'income' | 'expense' | 'transfer',
    uid: string,
    from: string,
    to: string
}) {
    // console.log("dsfdsfsdfdsc Amount:", Number(amount), conversion.usd[currency.toLowerCase()], (Number(amount) / conversion.usd[currency.toLowerCase()]).toFixed(10))
    return {
        amount: encrypt(String((Number(amount) / conversion.usd[currency.toLowerCase()]).toFixed(10)), uid),
        category: encrypt(category, uid),
        desc: encrypt(desc, uid),
        wallet: encrypt(wallet, uid),
        attachement: encrypt(url, uid),
        repeat: repeatData !== undefined,
        freq: repeatData ? {
            freq: encrypt(repeatData.freq, uid),
            month: encrypt(String(repeatData.month), uid),
            day: encrypt(String(repeatData.day), uid),
            weekDay: encrypt(String(repeatData.weekDay), uid),
            end: encrypt(repeatData.end, uid),
            date: repeatData.date,
        } : null,
        id: isEdit ? transaction.id : id,
        timeStamp: isEdit ? transaction.timeStamp : Timestamp.now(),
        type: encrypt(pageType, uid),
        attachementType: encrypt(attachementType, uid),
        from: encrypt(from, uid),
        to: encrypt(to, uid),
    };
}
export async function updateTransaction({ trans, uid, transId }: { trans: transactionType, uid: string, transId: string }) {
    await firestore()
        .collection('users')
        .doc(uid)
        .collection('transactions')
        .doc(transId)
        .update(trans);
}

export async function addNewTransaction({
    id,
    trans,
    uid,
}: {
    id: string;
    trans: transactionType;
    uid: string
}) {
    await firestore()
        .collection('users')
        .doc(uid)
        .collection('transactions')
        .doc(id)
        .set(trans);
}

export async function handleIncomeUpdate({
    curr,
    uid,
    month,
    category,
    transaction,
    amount,
    conversion,
    currency,
}: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    uid: string,
    month: number,
    category: string,
    transaction: transactionType,
    amount: number,
    conversion: {
        [key: string]: {
            [key: string]: number;
        };
    },
    currency: string
}) {
    const finalAmount = (
        (
            (
                UserFromJson(curr.data() as UserType)
            )?.income?.[month]?.[category] ?? 0
        ) -
        transaction.amount +
        Number(amount / conversion.usd[currency.toLowerCase()])
    );
    await firestore()
        .collection('users')
        .doc(uid)
        .update({
            [`income.${month}.${category}`]:
                encrypt(
                    String(
                        finalAmount
                    ),
                    uid),
        });
}
export async function handleNewIncome({
    curr,
    uid,
    month,
    category,
    amount,
    conversion,
    currency,
}: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    uid: string,
    month: number,
    category: string,
    amount: number,
    conversion: {
        [key: string]: {
            [key: string]: number;
        };
    },
    currency: string
}) {
    const finalAmount = (
        (
            (
                UserFromJson(curr.data() as UserType)
            )?.income[month]?.[category] ?? 0
        ) +
        (Number(amount) /
            conversion.usd[currency.toLowerCase()]
        )
    );
    await firestore()
        .collection('users')
        .doc(uid)
        .update({
            [`income.${month}.${category}`]:
                encrypt(
                    String(
                        finalAmount
                    ), uid),
        });
}

export async function handleExpenseUpdate({
    curr,
    uid,
    month,
    category,
    transaction,
    amount,
    conversion,
    currency,
}: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    uid: string,
    month: number,
    category: string,
    transaction: transactionType,
    amount: number,
    conversion: {
        [key: string]: {
            [key: string]: number;
        };
    },
    currency: string
}) {
    try {
        const finalAmount = (
            (
                (
                    UserFromJson(curr.data() as UserType)
                )?.spend?.[month]?.[category] ?? 0
            ) -
            transaction.amount +
            (Number(amount) / conversion.usd[currency.toLowerCase()])
        );
        await firestore()
            .collection('users')
            .doc(uid)
            .update({
                [`spend.${month}.${category}`]:
                    encrypt(
                        String(
                            finalAmount
                        ),
                        uid),
            });
        if (category !== 'transfer') {
            await handleOnlineNotify({
                category: category, month: month, uid: uid, totalSpent: finalAmount, curr: curr,
            });
        }
    } catch (e) {
        console.log('ERROR', e);
    }
}

export async function handleNewExpense({
    curr,
    uid,
    month,
    category,
    amount,
    conversion,
    currency,
}: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    uid: string,
    month: number,
    category: string,
    amount: number,
    conversion: {
        [key: string]: {
            [key: string]: number;
        };
    },
    currency: string
}) {
    try {
        const finalAmount = (
            (
                (
                    UserFromJson(curr.data() as UserType)
                )?.spend[month]?.[category] ?? 0
            ) +
            (Number(amount) /
                conversion.usd[currency.toLowerCase()]
            )
        );
        await firestore()
            .collection('users')
            .doc(uid)
            .update({
                [`spend.${month}.${category}`]:
                    encrypt(String(finalAmount), uid),
            });
        if (category !== 'transfer') {
            await handleOnlineNotify({
                category: category, month: month, uid: uid, totalSpent: finalAmount, curr: curr,
            });
        }
    } catch (e) {
        console.log(e);
    }
}
export async function getAttachmentUrl({
    attachement,
    id,
    uid,
}: {
    attachement: string;
    id: string;
    uid: string;
}) {
    let url = '';
    try {

        if (attachement !== '') {
            if (!attachement?.startsWith('https://firebasestorage.googleapis.com')) {
                await storage().ref(`users/${uid}/${id}`).putFile(attachement);
                url = await storage().ref(`users/${uid}/${id}`).getDownloadURL();
            } else {
                url = attachement;
            }
        }
    } catch (e) {
        console.log(e);
    }
    return url;
}
export async function handleOnlineNotify({
    curr,
    totalSpent,
    uid,
    month,
    category,
}: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    totalSpent: number;
    uid: string,
    month: number,
    category: string
}) {
    console.log('notifyyy');
    const totalBudget = (UserFromJson(curr.data() as UserType))?.budget?.[
        month
    ]?.[category];
    if (
        totalBudget &&
        ((totalSpent >= totalBudget.limit) || (totalSpent >= totalBudget.limit * (totalBudget.percentage / 100)))
    ) {
        try {
            const notificationId = uuid.v4();
            await notifee.requestPermission();
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });
            if (totalSpent >= totalBudget.limit) {
                await firestore()
                    .collection('users')
                    .doc(uid)
                    .update({
                        [`notification.${notificationId}`]: {
                            type: encrypt('budget-limit', uid),
                            category: encrypt(category, uid),
                            id: notificationId,
                            time: Timestamp.now(),
                            read: false,
                            percentage: totalBudget.percentage,
                        },
                    });
                await notifee.displayNotification({
                    title:
                        category[0].toUpperCase() +
                        category.slice(1) +
                        ' Budget Limit Exceeded',
                    body:
                        'Your ' +
                        category[0].toUpperCase() +
                        category.slice(1) +
                        ' budget has exceeded the limit',
                    android: {
                        channelId, pressAction: {
                            id: 'default',
                        },
                    },
                });
            } else if (totalSpent >= totalBudget.limit * (totalBudget.percentage / 100)) {
                await firestore()
                    .collection('users')
                    .doc(uid)
                    .update({
                        [`notification.${notificationId}`]: {
                            type: encrypt('budget-percent', uid),
                            category: encrypt(category, uid),
                            id: notificationId,
                            time: Timestamp.now(),
                            read: false,
                            percentage: totalBudget.percentage,
                        },
                    });
                await notifee.displayNotification({
                    title:
                        `Exceeded ${totalBudget.percentage}% of ${category[0].toUpperCase() +
                        category.slice(1)
                        } budget`,
                    body:
                        `You've exceeded ${totalBudget.percentage}% of your ${category[0].toUpperCase() +
                        category.slice(1)} budget. Take action to stay on track.`,
                    android: {
                        channelId, pressAction: {
                            id: 'default',
                        },
                    },
                });
            }

        } catch (e) {
            console.log(e);
        }
    }
}

export async function singupUser({ name, email, pass }: { name: string, email: string, pass: string }) {
    try {
        const creds = await auth().createUserWithEmailAndPassword(email, pass);
        if (creds) {
            const encrpytedUser = UserToJson({
                name: name,
                email: email,
                uid: creds.user.uid,
                pin: '',
            });
            // console.log(encrpytedUser)
            await firestore()
                .collection('users')
                .doc(creds.user.uid)
                .set(encrpytedUser);
            await creds.user.sendEmailVerification();
            return true;
        }
    } catch (e: any) {
        const error: FirebaseAuthTypes.NativeFirebaseAuthError = e;
        console.log(e);
        Toast.show({ text1: FirebaseAuthErrorHandler(error.code), type: 'error' });
        return false;
    }
    return false;
}

export function FirebaseAuthErrorHandler(code: string) {
    if (code === 'auth/email-already-in-use') {
        return 'The email address is already in use by another account.';
    } else if (code === 'auth/invalid-credential') {
        return 'The supplied auth credential is malformed or has expired.';
    } else if (code === 'auth/network-request-failed') {
        return 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.';
    }
    return 'An unknown error occurred. Please try again later.';
}

export function formatAMPM(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
    return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
}

type transType = 'income' | 'transfer' | 'expense';

export const handleOnline = async ({
    id,
    attachement,
    attachementType,
    uid,
    amount, pageType, conversion, currency, category, desc, isEdit, repeatData, prevTransaction, wallet, from, to, month,
}: {
    id: string;
    attachement: string;
    attachementType: 'none' | 'image' | 'doc';
    uid: string
    amount: string,
    pageType: transType,
    conversion: {
        [key: string]: {
            [key: string]: number;
        };
    },
    currency: string | undefined,
    category: string | undefined,
    desc: string,
    isEdit: boolean,
    repeatData: RepeatDataModel | repeatDataType | undefined,
    prevTransaction: transactionType | OnlineTransactionModel | OfflineTransactionModel | undefined,
    wallet: string,
    from: string,
    to: string,
    month: number
}) => {
    const url = await getAttachmentUrl({
        attachement: attachement,
        id: id,
        uid: uid,
    });
    const trans = createTransaction({
        id: id,
        url: url,
        attachementType: attachementType,
        amount: amount.replace(/,/g, ''),
        category: pageType === 'transfer' ? 'transfer' : category!,
        conversion: conversion,
        currency: currency!,
        desc: desc,
        isEdit: isEdit,
        pageType: pageType,
        repeatData: repeatData!,
        transaction: prevTransaction!,
        wallet: wallet,
        uid: uid,
        from: from,
        to: to,
    });
    const curr = await firestore().collection('users').doc(uid).get();
    if (isEdit) {
        if (pageType === 'expense' || pageType === 'transfer') {
            handleExpenseUpdate({
                curr: curr,
                amount: Number(amount.replace(/,/g, '')),
                category: pageType === 'transfer' ? 'transfer' : category!,
                conversion: conversion,
                currency: currency!,
                month: month,
                transaction: (prevTransaction! as transactionType),
                uid: uid,
            });
        } else if (pageType === 'income') {
            handleIncomeUpdate({
                curr: curr,
                amount: Number(amount.replace(/,/g, '')),
                category: category!,
                conversion: conversion,
                currency: currency!,
                month: month,
                transaction: (prevTransaction! as transactionType),
                uid: uid,
            });
        }
        await updateTransaction({
            trans: (trans as transactionType),
            transId: prevTransaction?.id!,
            uid: uid,
        });
    } else {
        if (pageType === 'expense' || pageType === 'transfer') {
            handleNewExpense({
                curr: curr,
                amount: Number(amount.replace(/,/g, '')),
                category: pageType === 'transfer' ? 'transfer' : category!,
                conversion: conversion,
                currency: currency!,
                month: month,
                uid: uid,
            });
        } else if (pageType === 'income') {
            handleNewIncome({
                curr: curr,
                amount: Number(amount.replace(/,/g, '')),
                category: category!,
                conversion: conversion,
                currency: currency!,
                month: month,
                uid: uid,
            });
        }
        await addNewTransaction({ id: id, trans: (trans as transactionType), uid: uid });
    }
};

export const handleOffline = async ({
    id,
    attachement,
    attachementType,
    uid,
    amount,
    pageType,
    conversion,
    currency,
    category,
    desc,
    isEdit,
    repeatData,
    prevTransaction,
    wallet,
    from,
    to,
    month,
    isConnected,
    dispatch,
    user,
    realm,
    TransOnline,
}: {
    isConnected: boolean | null,
    id: string;
    attachement: string;
    attachementType: 'none' | 'image' | 'doc';
    uid: string
    amount: string,
    pageType: 'income' | 'transfer' | 'expense',
    conversion: {
        [key: string]: {
            [key: string]: number;
        };
    },
    currency: string | undefined,
    category: string | undefined,
    desc: string,
    isEdit: boolean,
    repeatData: RepeatDataModel | repeatDataType | undefined,
    prevTransaction: transactionType | OnlineTransactionModel | OfflineTransactionModel | undefined,
    wallet: string,
    from: string,
    to: string,
    month: number,
    dispatch,
    user: UserType | undefined,
    realm: Realm,
    TransOnline: OnlineTransactionModel | null
}) => {
    console.log('offline');
    let trans = TransFromJson(
        createTransaction({
            id: id,
            url: attachement,
            attachementType: attachementType,
            amount: amount.replace(/,/g, ''),
            category: pageType === 'transfer' ? 'transfer' : category!,
            conversion: conversion,
            currency: currency!,
            desc: desc,
            isEdit: isEdit,
            pageType: pageType,
            repeatData: repeatData!,
            transaction: prevTransaction!,
            wallet: wallet,
            uid: uid,
            from: from,
            to: to,
        }),
        uid,
    );
    if (
        !isConnected &&
        (trans.freq?.date as Timestamp)?.seconds !== undefined
    ) {
        trans.freq!.date = Timestamp.fromMillis(
            (trans.freq?.date as Timestamp).seconds * 1000,
        ).toDate();
    }
    if (pageType === 'income') {
        if (isEdit) {
            dispatch(setIncome({
                month: month, category: category, amount: user?.income[month][category!]! -
                    prevTransaction?.amount! +
                    (Number(amount.replace(/,/g, '')) /
                        (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
            }));
            realm.write(() => {
                realm.create(
                    'amount',
                    {
                        id: month + '_' + category + '_' + pageType,
                        amount: user?.income[month][category!]! -
                            prevTransaction?.amount! +
                            (Number(amount.replace(/,/g, '')) /
                                (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
                    },
                    UpdateMode.All,
                );
                console.log('done');
            });
        } else {
            dispatch(setIncome({
                month: month, category: category, amount: (user?.income?.[month]?.[category!] ?? 0) +
                    (Number(amount.replace(/,/g, '')) /
                        (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
            }));
            realm.write(() => {
                realm.create(
                    'amount',
                    {
                        id: month + '_' + category + '_' + pageType,
                        amount: (user?.income?.[month]?.[category!] ?? 0) +
                            (Number(amount.replace(/,/g, '')) /
                                (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
                    },
                    UpdateMode.All,
                );
                console.log('done');
            });
        }
    } else if (pageType === 'expense') {
        if (isEdit) {
            dispatch(setExpense({
                month: month, category: category, amount: (user?.spend?.[month]?.[category!] ?? 0) -
                    prevTransaction?.amount! +
                    (Number(amount.replace(/,/g, '')) /
                        (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
            }));
            realm.write(() => {
                realm.create(
                    'amount',
                    {
                        id:
                            month +
                            '_' +
                            category +
                            '_' +
                            pageType,
                        amount: (user?.spend?.[month]?.[category!] ?? 0) -
                            prevTransaction?.amount! +
                            (Number(amount.replace(/,/g, '')) /
                                (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
                    },
                    UpdateMode.All,
                );
                console.log('done');
            });
        } else {
            dispatch(setExpense({
                month: month, category: category, amount: (user?.spend?.[month]?.[category!] ?? 0) +
                    (Number(amount.replace(/,/g, '')) /
                        (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
            }));
            realm.write(() => {
                realm.create(
                    'amount',
                    {
                        id:
                            month +
                            '_' +
                            category +
                            '_' +
                            pageType,
                        amount: (user?.spend?.[month]?.[category!] ?? 0) +
                            (Number(amount.replace(/,/g, '')) /
                                (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
                    },
                    UpdateMode.All,
                );
                console.log('done');
            });
        }
    } else {
        if (isEdit) {
            dispatch(setExpense({
                month: month, category: 'transfer', amount: (user?.spend?.[month]?.transfer ?? 0) -
                    prevTransaction?.amount! +
                    (Number(amount.replace(/,/g, '')) /
                        (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
            }));
            realm.write(() => {
                realm.create(
                    'amount',
                    {
                        id:
                            month +
                            '_' +
                            'transfer' +
                            '_' +
                            pageType,
                        amount: (user?.spend?.[month]?.transfer ?? 0) -
                            prevTransaction?.amount! +
                            (Number(amount.replace(/,/g, '')) /
                                (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
                    },
                    UpdateMode.All,
                );
                console.log('done');
            });
        } else {
            dispatch(setExpense({
                month: month, category: 'transfer', amount: (user?.spend?.[month]?.transfer ?? 0) +
                    (Number(amount.replace(/,/g, '')) /
                        (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
            }));
            realm.write(() => {
                realm.create(
                    'amount',
                    {
                        id:
                            month +
                            '_' +
                            'transfer' +
                            '_' +
                            pageType,
                        amount: (user?.spend?.[month]?.transfer ?? 0) +
                            (Number(amount.replace(/,/g, '')) /
                                (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)),
                    },
                    UpdateMode.All,
                );
                console.log('done');
            });
        }
    }
    if (pageType !== 'transfer') {
        const totalBudget = user?.budget?.[month]?.[category!];
        const totalSpent = isEdit
            ? user?.spend[month][category!]! -
            prevTransaction?.amount! +
            Number(amount.replace(/,/g, '')) /
            (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1)
            : (user?.spend?.[month]?.[category!] ?? 0) +
            Number(amount.replace(/,/g, '')) /
            (conversion?.usd[currency?.toLowerCase() ?? 'usd'] ?? 1);
        await handleOfflineNotification({ category: category, dispatch: dispatch, realm: realm, totalBudget: totalBudget, totalSpent: totalSpent, user: user });
    }
    if (trans.freq) {
        trans.freq.date = Timestamp.fromDate(trans.freq?.date as Date);
    }
    realm.write(() => {
        if (isEdit && TransOnline) {
            realm.create(
                'OnlineTransaction',
                { ...trans, changed: true },
                UpdateMode.Modified,
            );
        }
        realm.create(
            'OfflineTransaction',
            { ...trans, operation: isEdit ? 'update' : 'add' },
            UpdateMode.All,
        );
    });
};
export async function handleOfflineNotification({ totalBudget, totalSpent, realm, category, dispatch, user }:
    {
        totalBudget: {
            alert: boolean;
            limit: number;
            percentage: number;
        } | undefined,
        totalSpent: number,
        realm: Realm,
        category: string | undefined,
        dispatch,
        user: UserType | undefined
    }
) {
    if (
        totalBudget &&
        (totalSpent >= totalBudget.limit ||
            totalSpent >= totalBudget.limit * (totalBudget.percentage / 100))
    ) {
        try {
            const notificationId = uuid.v4();
            await notifee.requestPermission();
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });
            if (totalSpent >= totalBudget.limit) {
                realm.write(() => {
                    realm.create(
                        'notification',
                        {
                            type: 'budget-limit',
                            category: category!,
                            id: notificationId,
                            time: Timestamp.now(),
                            read: false,
                            percentage: totalBudget.percentage,
                            deleted: false,
                        },
                        UpdateMode.All,
                    );
                });
                dispatch(
                    userLoggedIn({
                        ...user,
                        notification: {
                            ...user!.notification,
                            [notificationId as string]: {
                                type: 'budget-limit',
                                category: category!,
                                id: notificationId,
                                time: Timestamp.now(),
                                read: false,
                                percentage: totalBudget.percentage,
                            },
                        },
                    }),
                );
                await notifee.displayNotification({
                    title:
                        category![0].toUpperCase() +
                        category!.slice(1) +
                        ' Budget Limit Exceeded',
                    body:
                        'Your ' +
                        category![0].toUpperCase() +
                        category!.slice(1) +
                        ' budget has exceeded the limit',
                    android: {
                        channelId,
                        pressAction: {
                            id: 'default',
                        },
                    },
                });
            } else if (
                totalSpent >=
                totalBudget.limit * (totalBudget.percentage / 100)
            ) {
                realm.write(() => {
                    realm.create(
                        'notification',
                        {
                            type: 'budget-percent',
                            category: category!,
                            id: notificationId,
                            time: Timestamp.now(),
                            read: false,
                            percentage: totalBudget.percentage,
                            deleted: false,
                        },
                        UpdateMode.All,
                    );
                });
                dispatch(
                    userLoggedIn({
                        ...user,
                        notification: {
                            ...user!.notification,
                            [notificationId as string]: {
                                type: 'budget-percent',
                                category: category!,
                                id: notificationId,
                                time: Timestamp.now(),
                                read: false,
                                percentage: totalBudget.percentage,
                            },
                        },
                    }),
                );
                await notifee.displayNotification({
                    title: `Exceeded ${totalBudget.percentage}% of ${category![0].toUpperCase() + category!.slice(1)
                        } budget`,
                    body: `You've exceeded ${totalBudget.percentage}% of your ${category![0].toUpperCase() + category!.slice(1)
                        } budget. Take action to stay on track.`,
                    android: {
                        channelId, pressAction: {
                            id: 'default',
                        },
                    },
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}
