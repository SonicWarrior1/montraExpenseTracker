import {repeatDataType, transactionType} from '../defs/transaction';
import {UserFromJson, UserToJson} from './userFuncs';
import {UserType} from '../defs/user';
import {decrypt, encrypt} from './encryption';
import {OnlineTransactionModel} from '../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../DbModels/OfflineTransactionModel';
import {RepeatDataModel} from '../DbModels/RepeatDataModel';
import {setExpense, setIncome, userLoggedIn} from '../redux/reducers/userSlice';
import {TransFromJson} from './transFuncs';
import {currencies, STRINGS} from '../constants/strings';
// Third Party Libraries
import storage from '@react-native-firebase/storage';
import notifee from '@notifee/react-native';
import Toast from 'react-native-toast-message';
import Realm, {UpdateMode} from 'realm';
import uuid from 'react-native-uuid';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
  Timestamp,
} from '@react-native-firebase/firestore';
import {Dispatch} from '@reduxjs/toolkit';

type transType = 'income' | 'transfer' | 'expense';
type AllTransType =
  | transactionType
  | OnlineTransactionModel
  | OfflineTransactionModel
  | undefined;

export function createTransaction({
  id,
  url,
  attachementType,
  amount,
  conversion,
  currency,
  category,
  desc,
  wallet,
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
  amount: string;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string;
  category: string;
  desc: string;
  wallet: string;
  repeatData: repeatDataType | RepeatDataModel;
  isEdit: boolean;
  transaction:
    | transactionType
    | OnlineTransactionModel
    | OfflineTransactionModel;
  pageType: transType;
  uid: string;
  from: string;
  to: string;
}) {
  return {
    amount: encrypt(
      String(
        (
          Number(amount) /
          (isEdit ? transaction.conversion : conversion).usd[
            currency.toLowerCase()
          ]
        ).toFixed(10),
      ),
      uid,
    ),
    category: encrypt(category, uid),
    desc: encrypt(desc, uid),
    wallet: encrypt(wallet, uid),
    attachement: encrypt(url, uid),
    repeat: repeatData !== undefined,
    freq: repeatData
      ? {
          freq: encrypt(repeatData.freq, uid),
          month: encrypt(String(repeatData.month), uid),
          day: encrypt(String(repeatData.day), uid),
          weekDay: encrypt(String(repeatData.weekDay), uid),
          end: encrypt(repeatData.end, uid),
          date: repeatData.date,
        }
      : null,
    id: isEdit ? transaction.id : id,
    timeStamp: isEdit ? transaction.timeStamp : Timestamp.now(),
    type: encrypt(pageType, uid),
    attachementType: encrypt(attachementType, uid),
    from: encrypt(from, uid),
    to: encrypt(to, uid),
    conversion: isEdit ? transaction.conversion : conversion,
  };
}
export async function updateTransaction({
  trans,
  uid,
  transId,
}: {
  trans: transactionType;
  uid: string;
  transId: string;
}) {
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
  uid: string;
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
  currency,
}: {
  curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  uid: string;
  month: number;
  category: string;
  transaction:
    | transactionType
    | OnlineTransactionModel
    | OfflineTransactionModel;
  amount: number;
  currency: string;
}) {
  const finalAmount: {[key: string]: string} = {};
  Object.keys(currencies).forEach(dbCurrency => {
    finalAmount[dbCurrency] = encrypt(
      Number(
        (
          (UserFromJson(curr.data() as UserType)?.income[month]?.[category]?.[
            dbCurrency
          ] ?? 0) -
          Number(transaction.amount) *
            transaction.conversion.usd[dbCurrency.toLowerCase()] +
          (Number(amount) /
            transaction.conversion.usd[currency.toLowerCase()]) *
            transaction.conversion.usd[dbCurrency.toLowerCase()]
        ).toFixed(2),
      ).toString(),
      uid,
    );
  });
  await firestore()
    .collection('users')
    .doc(uid)
    .update({
      [`income.${month}.${category}`]: finalAmount,
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
  uid: string;
  month: number;
  category: string;
  amount: number;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string;
}) {
  const finalAmount: {[key: string]: string} = {};
  Object.keys(currencies).forEach(dbCurrency => {
    finalAmount[dbCurrency] = encrypt(
      Number(
        (
          (UserFromJson(curr.data() as UserType)?.income[month]?.[category]?.[
            dbCurrency
          ] ?? 0) +
          Number(
            (
              (Number(amount) / conversion.usd[currency.toLowerCase()]) *
              conversion.usd[dbCurrency.toLowerCase()]
            ).toFixed(2),
          )
        ).toFixed(2),
      ).toString(),
      uid,
    );
  });
  await firestore()
    .collection('users')
    .doc(uid)
    .update({
      [`income.${month}.${category}`]: finalAmount,
    });
}

export async function handleExpenseUpdate({
  curr,
  uid,
  month,
  category,
  transaction,
  amount,
  currency,
}: {
  curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  uid: string;
  month: number;
  category: string;
  transaction:
    | transactionType
    | OnlineTransactionModel
    | OfflineTransactionModel;
  amount: number;
  currency: string;
}) {
  try {
    const finalAmount: {[key: string]: string} = {};
    Object.keys(currencies).forEach(dbCurrency => {
      finalAmount[dbCurrency] = encrypt(
        Number(
          (
            (UserFromJson(curr.data() as UserType)?.spend[month]?.[category]?.[
              dbCurrency
            ] ?? 0) -
            Number(transaction.amount) *
              transaction.conversion.usd[dbCurrency.toLowerCase()] +
            (Number(amount) /
              transaction.conversion.usd[currency.toLowerCase()]) *
              transaction.conversion.usd[dbCurrency.toLowerCase()]
          ).toFixed(2),
        ).toString(),
        uid,
      );
    });
    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        [`spend.${month}.${category}`]: finalAmount,
      });
    if (category !== 'transfer') {
      await handleOnlineNotify({
        category: category,
        month: month,
        uid: uid,
        totalSpent: Number(decrypt(finalAmount.USD, uid)),
        curr: curr,
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
  uid: string;
  month: number;
  category: string;
  amount: number;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string;
}) {
  try {
    const finalAmount: {[key: string]: string} = {};
    Object.keys(currencies).forEach(dbCurrency => {
      finalAmount[dbCurrency] = encrypt(
        Number(
          (
            (UserFromJson(curr.data() as UserType)?.spend[month]?.[category]?.[
              dbCurrency
            ] ?? 0) +
            Number(
              (
                (Number(amount) / conversion.usd[currency.toLowerCase()]) *
                conversion.usd[dbCurrency.toLowerCase()]
              ).toFixed(2),
            )
          ).toFixed(2),
        ).toString(),
        uid,
      );
    });
    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        [`spend.${month}.${category}`]: finalAmount,
      });
    if (category !== 'transfer') {
      await handleOnlineNotify({
        category: category,
        month: month,
        uid: uid,
        totalSpent: Number(decrypt(finalAmount.USD, uid)),
        curr: curr,
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
  uid: string;
  month: number;
  category: string;
}) {
  console.log('notifyyy');
  const totalBudget = UserFromJson(curr.data() as UserType)?.budget?.[month]?.[
    category
  ];
  if (totalBudget && totalBudget.alert) {
    if (
      totalSpent >= totalBudget.limit ||
      totalSpent >= totalBudget.limit * (totalBudget.percentage / 100)
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
            title: `Exceeded ${totalBudget.percentage}% of ${
              category[0].toUpperCase() + category.slice(1)
            } budget`,
            body: `You've exceeded ${totalBudget.percentage}% of your ${
              category[0].toUpperCase() + category.slice(1)
            } budget. Take action to stay on track.`,
            android: {
              channelId,
              pressAction: {
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
}

export async function singupUser({
  name,
  email,
  pass,
}: {
  name: string;
  email: string;
  pass: string;
}) {
  try {
    const creds = await auth().createUserWithEmailAndPassword(email, pass);
    if (creds) {
      const encrpytedUser = UserToJson({
        name: name,
        email: email,
        uid: creds.user.uid,
        isSocial: false,
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
    Toast.show({text1: FirebaseAuthErrorHandler(error.code), type: 'error'});
    return false;
  }
  return false;
}

export function FirebaseAuthErrorHandler(code: string) {
  if (code === 'auth/email-already-in-use') {
    return STRINGS.EmailAdressAlreadyUsed;
  }
  if (code === 'auth/invalid-credential') {
    return STRINGS.CredentialMalformed;
  }
  if (code === 'auth/network-request-failed') {
    return STRINGS.NetworkError;
  }
  if (code === 'auth/invalid-email') {
    return STRINGS.InvalidEmail;
  }
  if (code === 'auth/popup-closed-by-user') {
    return STRINGS.PopupClosedByUser;
  }
  if (code === 'auth/too-many-requests') {
    return STRINGS.ToManyRequestError;
  }
  return `${STRINGS.UnknownError}(${code})`;
}

export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12; // the hour '0' should be '12'
  return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
}

export const handleOnline = async ({
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
}: {
  id: string;
  attachement: string;
  attachementType: transactionType['attachementType'];
  uid: string;
  amount: string;
  pageType: transType;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string | undefined;
  category: string | undefined;
  desc: string;
  isEdit: boolean;
  repeatData: RepeatDataModel | repeatDataType | undefined;
  prevTransaction: AllTransType;
  wallet: string;
  from: string;
  to: string;
  month: number;
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
    if (pageType === 'expense') {
      await handleExpenseUpdate({
        curr: curr,
        amount: Number(amount.replace(/,/g, '')),
        category: category!,
        currency: currency!,
        month: month,
        transaction: prevTransaction! as transactionType,
        uid: uid,
      });
    } else if (pageType === 'income') {
      await handleIncomeUpdate({
        curr: curr,
        amount: Number(amount.replace(/,/g, '')),
        category: category!,
        currency: currency!,
        month: month,
        transaction: prevTransaction! as transactionType,
        uid: uid,
      });
    } else {
      await handleExpenseUpdate({
        curr: curr,
        amount: Number(amount.replace(/,/g, '')),
        category: 'transfer',
        currency: currency!,
        month: month,
        transaction: prevTransaction! as transactionType,
        uid: uid,
      });
    }
    await updateTransaction({
      trans: trans as transactionType,
      transId: prevTransaction?.id!,
      uid: uid,
    });
  } else {
    if (pageType === 'expense') {
      await handleNewExpense({
        curr: curr,
        amount: Number(amount.replace(/,/g, '')),
        category: category!,
        conversion: conversion,
        currency: currency!,
        month: month,
        uid: uid,
      });
    } else if (pageType === 'income') {
      await handleNewIncome({
        curr: curr,
        amount: Number(amount.replace(/,/g, '')),
        category: category!,
        conversion: conversion,
        currency: currency!,
        month: month,
        uid: uid,
      });
    } else {
      await handleNewExpense({
        curr: curr,
        amount: Number(amount.replace(/,/g, '')),
        category: 'transfer',
        conversion: conversion,
        currency: currency!,
        month: month,
        uid: uid,
      });
    }
    await addNewTransaction({
      id: id,
      trans: trans as transactionType,
      uid: uid,
    });
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
  isConnected: boolean | null;
  id: string;
  attachement: string;
  attachementType: transactionType['attachementType'];
  uid: string;
  amount: string;
  pageType: transType;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string | undefined;
  category: string | undefined;
  desc: string;
  isEdit: boolean;
  repeatData: RepeatDataModel | repeatDataType | undefined;
  prevTransaction: AllTransType;
  wallet: string;
  from: string;
  to: string;
  month: number;
  dispatch: Dispatch;
  user: UserType | undefined;
  realm: Realm;
  TransOnline: OnlineTransactionModel | null;
}) => {
  console.log('offline');
  try {
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
      handleOfflineIncome({
        amount: amount,
        category: category,
        conversion: conversion,
        currency: currency,
        dispatch: dispatch,
        isEdit: isEdit,
        month: month,
        pageType: pageType,
        prevTransaction: prevTransaction,
        realm: realm,
        user: user,
      });
    } else if (pageType === 'expense') {
      handleOfflineExpenseTransfer({
        amount: amount,
        category: category,
        conversion: conversion,
        currency: currency,
        dispatch: dispatch,
        isEdit: isEdit,
        month: month,
        pageType: pageType,
        prevTransaction: prevTransaction,
        realm: realm,
        user: user,
      });
    } else {
      handleOfflineExpenseTransfer({
        amount: amount,
        category: 'transfer',
        conversion: conversion,
        currency: currency,
        dispatch: dispatch,
        isEdit: isEdit,
        month: month,
        pageType: pageType,
        prevTransaction: prevTransaction,
        realm: realm,
        user: user,
      });
    }
    if (pageType === 'expense') {
      const totalBudget = user?.budget?.[month]?.[category!];
      if (isEdit) {
        const totalSpent =
          user?.spend[month][category!].USD! -
          prevTransaction!.amount +
          Number(amount.replace(/,/g, '')) /
            (prevTransaction!.conversion?.usd[
              currency?.toLowerCase() ?? 'usd'
            ] ?? 1);
        await handleOfflineNotification({
          category: category,
          dispatch: dispatch,
          realm: realm,
          totalBudget: totalBudget,
          totalSpent: totalSpent,
          user: user,
        });
      } else {
        const totalSpent =
          (user?.spend?.[month]?.[category!]?.USD ?? 0) +
          Number(amount.replace(/,/g, '')) /
            (conversion?.usd?.[currency?.toLowerCase() ?? 'usd'] ?? 1);
        await handleOfflineNotification({
          category: category,
          dispatch: dispatch,
          realm: realm,
          totalBudget: totalBudget,
          totalSpent: totalSpent,
          user: user,
        });
      }
    }
    if (trans.freq) {
      trans.freq.date = Timestamp.fromDate(trans.freq?.date as Date);
    }

    realm.write(() => {
      if (isEdit && TransOnline) {
        realm.create(
          'OnlineTransaction',
          {...trans, changed: true},
          UpdateMode.Modified,
        );
      }
      realm.create(
        'OfflineTransaction',
        {...trans, operation: isEdit ? 'update' : 'add'},
        UpdateMode.All,
      );
    });
  } catch (e) {
    console.log('eeeeeee', e);
  }
};
function handleOfflineExpenseTransfer({
  isEdit,
  dispatch,
  realm,
  month,
  category,
  user,
  prevTransaction,
  amount,
  conversion,
  currency,
  pageType,
}: {
  amount: string;
  pageType: transType;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string | undefined;
  category: string | undefined;
  isEdit: boolean;
  prevTransaction: AllTransType;
  month: number;
  dispatch: Dispatch;
  user: UserType | undefined;
  realm: Realm;
}) {
  if (isEdit) {
    const finalAmount: {[key: string]: string} = {};
    const encryptedAmount: {[key: string]: string} = {};
    Object.keys(currencies).forEach(dbCurrency => {
      const x = Number(
        (
          (user?.spend[month]?.[category!]?.[dbCurrency] ?? 0) -
          Number(prevTransaction!.amount) *
            prevTransaction!.conversion.usd[dbCurrency.toLowerCase()] +
          (Number(amount) /
            prevTransaction!.conversion.usd[currency!.toLowerCase()]) *
            prevTransaction!.conversion.usd[dbCurrency.toLowerCase()]
        ).toFixed(2),
      ).toString();
      finalAmount[dbCurrency] = x;
      encryptedAmount[dbCurrency] = encrypt(x, user?.uid!);
    });
    dispatch(
      setExpense({
        month: month,
        category: category,
        amount: finalAmount,
      }),
    );
    realm.write(() => {
      realm.create(
        'amount',
        {
          id: month + '_' + category + '_' + pageType,
          amount: encryptedAmount,
        },
        UpdateMode.All,
      );
      console.log('done');
    });
  } else {
    const finalAmount: {[key: string]: string} = {};
    const encryptedAmount: {[key: string]: string} = {};
    Object.keys(currencies).forEach(dbCurrency => {
      const x = Number(
        (
          (user?.spend[month]?.[category!]?.[dbCurrency] ?? 0) +
          Number(
            (
              (Number(amount) / conversion.usd[currency!.toLowerCase()]) *
              conversion.usd[dbCurrency.toLowerCase()]
            ).toFixed(2),
          )
        ).toFixed(2),
      ).toString();
      finalAmount[dbCurrency] = x;
      encryptedAmount[dbCurrency] = encrypt(x, user?.uid!);
    });
    console.log('DISPATCH');
    dispatch(
      setExpense({
        month: month,
        category: category,
        amount: finalAmount,
      }),
    );
    realm.write(() => {
      realm.create(
        'amount',
        {
          id: month + '_' + category + '_' + pageType,
          amount: encryptedAmount,
        },
        UpdateMode.All,
      );
      console.log('done');
    });
  }
}

function handleOfflineIncome({
  isEdit,
  dispatch,
  realm,
  month,
  category,
  user,
  prevTransaction,
  amount,
  conversion,
  currency,
  pageType,
}: {
  amount: string;
  pageType: transType;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string | undefined;
  category: string | undefined;
  isEdit: boolean;
  prevTransaction: AllTransType;
  month: number;
  dispatch: Dispatch;
  user: UserType | undefined;
  realm: Realm;
}) {
  if (isEdit) {
    const finalAmount: {[key: string]: string} = {};
    const encryptedAmount: {[key: string]: string} = {};
    Object.keys(currencies).forEach(dbCurrency => {
      const x = Number(
        (
          (user?.income[month]?.[category!]?.[dbCurrency] ?? 0) -
          Number(prevTransaction!.amount) *
            prevTransaction!.conversion.usd[dbCurrency.toLowerCase()] +
          (Number(amount) /
            prevTransaction!.conversion.usd[currency!.toLowerCase()]) *
            prevTransaction!.conversion.usd[dbCurrency.toLowerCase()]
        ).toFixed(2),
      ).toString();
      finalAmount[dbCurrency] = x;
      encryptedAmount[dbCurrency] = encrypt(x, user?.uid!);
    });
    dispatch(
      setIncome({
        month: month,
        category: category,
        amount: finalAmount,
      }),
    );
    realm.write(() => {
      realm.create(
        'amount',
        {
          id: month + '_' + category + '_' + pageType,
          amount: encryptedAmount,
        },
        UpdateMode.All,
      );
      console.log('done');
    });
  } else {
    const finalAmount: {[key: string]: string} = {};
    const encryptedAmount: {[key: string]: string} = {};
    Object.keys(currencies).forEach(dbCurrency => {
      const x = Number(
        (
          (user?.income[month]?.[category!]?.[dbCurrency] ?? 0) +
          Number(
            (
              (Number(amount) / conversion.usd[currency!.toLowerCase()]) *
              conversion.usd[dbCurrency.toLowerCase()]
            ).toFixed(2),
          )
        ).toFixed(2),
      ).toString();
      finalAmount[dbCurrency] = x;
      encryptedAmount[dbCurrency] = encrypt(x, user?.uid!);
    });
    dispatch(
      setIncome({
        month: month,
        category: category,
        amount: finalAmount,
      }),
    );
    realm.write(() => {
      realm.create(
        'amount',
        {
          id: month + '_' + category + '_' + pageType,
          amount: encryptedAmount,
        },
        UpdateMode.All,
      );
      console.log('done');
    });
  }
}
export async function handleOfflineNotification({
  totalBudget,
  totalSpent,
  realm,
  category,
  dispatch,
  user,
}: {
  totalBudget:
    | {
        alert: boolean;
        limit: number;
        percentage: number;
      }
    | undefined;
  totalSpent: number;
  realm: Realm;
  category: string | undefined;
  dispatch: Dispatch;
  user: UserType | undefined;
}) {
  console.log(totalBudget, totalSpent);
  if (totalBudget && totalBudget.alert) {
    if (
      totalSpent >= totalBudget.limit ||
      totalSpent >= totalBudget.limit * (totalBudget.percentage / 100)
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
            console.log({
              type: 'budget-limit',
              category: category!,
              id: notificationId,
              time: Timestamp.now(),
              read: false,
              percentage: totalBudget.percentage,
              deleted: false,
            });
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
            console.log({
              type: 'budget-percent',
              category: category!,
              id: notificationId,
              time: Timestamp.now(),
              read: false,
              percentage: totalBudget.percentage,
              deleted: false,
            });
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
            title: `Exceeded ${totalBudget.percentage}% of ${
              category![0].toUpperCase() + category!.slice(1)
            } budget`,
            body: `You've exceeded ${totalBudget.percentage}% of your ${
              category![0].toUpperCase() + category!.slice(1)
            } budget. Take action to stay on track.`,
            android: {
              channelId,
              pressAction: {
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
}
