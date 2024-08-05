import React from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {RootStackParamList} from '../../defs/navigation';
import {
  setExpense,
  setIncome,
  setLoading,
} from '../../redux/reducers/userSlice';
import {transactionType} from '../../defs/transaction';
import {currencies, STRINGS} from '../../constants/strings';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../DbModels/OfflineTransactionModel';
// Third Party Libraries
import Toast from 'react-native-toast-message';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import {useObject, useRealm} from '@realm/react';
import {useNetInfo} from '@react-native-community/netinfo';
import {UpdateMode} from 'realm';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import DeleteSheet from '../DeleteSheet';
import {TimestampModel} from '../../DbModels/TimestampModel';
import {handleExpenseUpdate, handleIncomeUpdate} from '../../utils/firebase';
import {encrypt} from '../../utils/encryption';

function DeleteTransactionSheet({
  bottomSheetModalRef,
  id,
  // url,
  navigation,
  type,
  amt,
  category,
  timeStamp,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  id: string;
  navigation: StackNavigationProp<
    RootStackParamList,
    'TransactionDetail',
    undefined
  >;
  url: string;
  type: transactionType['type'];
  amt: number;
  category: string;
  timeStamp: Timestamp | TimestampModel;
}>) {
  // redux
  const user = useAppSelector(state => state.user.currentUser);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // constants
  const dispatch = useAppDispatch();
  const month = Timestamp.fromMillis(timeStamp.seconds * 1000)
    .toDate()
    .getMonth();
  const {isConnected} = useNetInfo();
  const realm = useRealm();
  const online = useObject(OnlineTransactionModel, id);
  const offline = useObject(OfflineTransactionModel, id);
  const trans = offline ?? online;
  // functions
  const handleOffline = async () => {
    realm.write(() => {
      realm.create(
        'OfflineTransaction',
        {...trans, operation: 'delete'},
        UpdateMode.Modified,
      );
      if (online) {
        realm.create(
          'OnlineTransaction',
          {...trans, changed: true},
          UpdateMode.Modified,
        );
      }
    });
    if (type === 'income') {
      const finalAmount: {[key: string]: string} = {};
      const encryptedAmount: {[key: string]: string} = {};
      Object.keys(currencies).forEach(dbCurrency => {
        const x = Number(
          (
            (user?.income[month]?.[category]?.[dbCurrency] ?? 0) -
            Number(amt) * trans!.conversion.usd[dbCurrency.toLowerCase()]
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
            id: month + '_' + category + '_' + type,
            amount: encryptedAmount,
          },
          UpdateMode.All,
        );
        console.log('done');
      });
    } else if (type === 'expense') {
      const finalAmount: {[key: string]: string} = {};
      const encryptedAmount: {[key: string]: string} = {};
      Object.keys(currencies).forEach(dbCurrency => {
        console.log(
          (user?.spend[month]?.[category]?.[dbCurrency] ?? 0) -
            Number(
              (
                Number(amt) * trans!.conversion.usd[dbCurrency.toLowerCase()]
              ).toFixed(2),
            ),
        );
        const x = Number(
          (
            (user?.spend[month]?.[category]?.[dbCurrency] ?? 0) -
            Number(
              (
                Number(amt) * trans!.conversion.usd[dbCurrency.toLowerCase()]
              ).toFixed(2),
            )
          ).toFixed(2),
        ).toString();
        finalAmount[dbCurrency] = x;
        encryptedAmount[dbCurrency] = encrypt(x, user?.uid!);
      });
      console.log('sdfjkbndjskgbnfdjksnfjk', finalAmount);
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
            id: month + '_' + category + '_' + type,
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
            (user?.spend[month]?.transfer?.[dbCurrency] ?? 0) -
            Number(amt) * trans!.conversion.usd[dbCurrency.toLowerCase()]
          ).toFixed(2),
        ).toString();
        finalAmount[dbCurrency] = x;
        encryptedAmount[dbCurrency] = encrypt(x, user?.uid!);
      });
      dispatch(
        setExpense({
          month: month,
          category: 'transfer',
          amount: finalAmount,
        }),
      );
      realm.write(() => {
        realm.create(
          'amount',
          {
            id: month + '_' + 'transfer' + '_' + type,
            amount: encryptedAmount,
          },
          UpdateMode.All,
        );
        console.log('done');
      });
    }
    bottomSheetModalRef.current?.dismiss();
    navigation.pop();
  };
  const handleOnline = async () => {
    const userDoc = firestore().collection('users').doc(uid);
    const curr = await userDoc.get();
    if (type === 'expense' || type === 'transfer') {
      await handleExpenseUpdate({
        curr,
        uid: uid!,
        amount: 0,
        category,
        currency: user?.currency!,
        month,
        transaction: trans!,
      });
    } else {
      await handleIncomeUpdate({
        curr,
        uid: uid!,
        amount: 0,
        category,
        currency: user?.currency!,
        month,
        transaction: trans!,
      });
    }
    bottomSheetModalRef.current?.dismiss();
    navigation.pop();
    await userDoc.collection('transactions').doc(id).update({deleted: true});
  };
  const handleDelete = async () => {
    try {
      dispatch(setLoading(true));
      if (!isConnected) {
        await handleOffline();
      } else {
        await handleOnline();
      }
      Toast.show({
        text1: STRINGS.TransactionDeletedSuccesfully,
        type: 'custom',
        swipeable: false,
      });
      dispatch(setLoading(false));
    } catch (e) {
      console.log(e);
      dispatch(setLoading(false));
    }
  };
  return (
    <DeleteSheet
      handleDelete={handleDelete}
      bottomSheetModalRef={bottomSheetModalRef}
      text1={STRINGS.RemovethisTransaction}
      text2={STRINGS.sureRemoveTransaction}
    />
  );
}
export default React.memo(DeleteTransactionSheet);
