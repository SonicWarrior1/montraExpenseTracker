import React from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {RootStackParamList} from '../../defs/navigation';
import {
  setExpense,
  setIncome,
  setLoading,
} from '../../redux/reducers/userSlice';
import {transactionType} from '../../defs/transaction';
import {STRINGS} from '../../constants/strings';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../DbModels/OfflineTransactionModel';
import {encrypt} from '../../utils/encryption';
import {UserFromJson} from '../../utils/userFuncs';
// Third Party Libraries
import Toast from 'react-native-toast-message';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import {useObject, useRealm} from '@realm/react';
import {useNetInfo} from '@react-native-community/netinfo';
import {UpdateMode} from 'realm';
import storage from '@react-native-firebase/storage';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import DeleteSheet from '../DeleteSheet';
import {TimestampModel} from '../../DbModels/TimestampModel';

function DeleteTransactionSheet({
  bottomSheetModalRef,
  id,
  url,
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
      dispatch(
        setIncome({
          month: month,
          category: category,
          amount: user?.income[month][category]! - Number(amt),
        }),
      );
      realm.write(() => {
        realm.create(
          'amount',
          {
            id: month + '_' + category + '_' + type,
            amount: user?.income[month][category]! - Number(amt),
          },
          UpdateMode.All,
        );
        console.log('done');
      });
    } else if (type === 'expense') {
      dispatch(
        setExpense({
          month: month,
          category: category,
          amount: user?.spend[month][category]! - Number(amt),
        }),
      );
      realm.write(() => {
        realm.create(
          'amount',
          {
            id: month + '_' + category + '_' + type,
            amount: user?.spend[month][category]! - Number(amt),
          },
          UpdateMode.All,
        );
        console.log('done');
      });
    } else {
      dispatch(
        setExpense({
          month: month,
          category: 'transfer',
          amount: user?.spend[month].transfer! - Number(amt),
        }),
      );
      realm.write(() => {
        realm.create(
          'amount',
          {
            id: month + '_' + 'transfer' + '_' + type,
            amount: user?.spend[month].transfer! - Number(amt),
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
    const data = await firestore().collection('users').doc(uid).get();
    if (type === 'expense' || type === 'transfer') {
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          [`spend.${month}.${type === 'transfer' ? 'transfer' : category}`]:
            encrypt(
              String(
                (UserFromJson(data.data()!)?.spend?.[month]?.[
                  type === 'transfer' ? 'transfer' : category
                ] ?? 0) - amt,
              ),
              uid!,
            ),
        });
    } else {
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          [`income.${month}.${category}`]: encrypt(
            String(
              (UserFromJson(data.data()!)?.income?.[month]?.[category] ?? 0) -
                amt,
            ),
            uid!,
          ),
        });
    }
    bottomSheetModalRef.current?.dismiss();
    navigation.pop();
    await userDoc.collection('transactions').doc(id).update({deleted: true});
    if (url !== '') {
      await storage().refFromURL(url).delete();
    }
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
