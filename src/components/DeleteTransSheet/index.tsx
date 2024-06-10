import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {useCallback, useMemo} from 'react';
import {Text, View} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import CustomButton from '../CustomButton';
import firestore from '@react-native-firebase/firestore';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Toast from 'react-native-toast-message';
import {RootStackParamList} from '../../defs/navigation';
import {setLoading} from '../../redux/reducers/userSlice';
import styles from './styles';
import {transactionType} from '../../defs/transaction';
import {UserType} from '../../defs/user';
import {StackNavigationProp} from '@react-navigation/stack';
import SheetBackdrop from '../SheetBackDrop';
import {UserFromJson} from '../../utils/userFuncs';
import {encrypt} from '../../utils/encryption';
import {STRINGS} from '../../constants/strings';
function DeleteTransactionSheet({
  bottomSheetModalRef,
  id,
  navigation,
  type,
  amt,
  category,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  id: string;
  navigation: StackNavigationProp<
    RootStackParamList,
    'TransactionDetail',
    undefined
  >;
  type: transactionType['type'];
  amt: number;
  category: string;
}>) {
  const conversion = useAppSelector(state => state.transaction.conversion);
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['25%'], []);
  const month = new Date().getMonth();
  const handleDelete = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const curr = await firestore().collection('users').doc(uid).get();
      if (type === 'expense') {
        await firestore()
          .collection('users')
          .doc(uid)
          .update({
            [`spend.${month}.${category}`]: encrypt(
              String(
                (
                  Number(
                    UserFromJson(curr.data() as UserType).spend[month][
                      category
                    ] ?? 0,
                  ) -
                  amt / conversion.usd[currency!.toLowerCase()]
                ).toFixed(1),
              ),
              uid!,
            ),
          });
      } else if (type === 'income') {
        await firestore()
          .collection('users')
          .doc(uid)
          .update({
            [`income.${month}.${category}`]: encrypt(
              String(
                (
                  Number(
                    UserFromJson(curr.data() as UserType).income[month][
                      category
                    ] ?? 0,
                  ) -
                  amt / conversion.usd[currency!.toLowerCase()]
                ).toFixed(1),
              ),
              uid!,
            ),
          });
      }
      await firestore()
        .collection('users')
        .doc(uid)
        .collection('transactions')
        .doc(id)
        .delete();
      Toast.show({text1: STRINGS.TransactionDeletedSuccesfully,type:'custom'});
      bottomSheetModalRef.current?.dismiss();
      navigation.pop();
      dispatch(setLoading(false));
    } catch (e) {
      console.log(e);
      dispatch(setLoading(false));
    }
  }, [uid, id]);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={SheetBackdrop}
        backgroundStyle={styles.sheetBack}>
        <BottomSheetView style={styles.sheetView}>
          <Text style={styles.text1}>{STRINGS.RemovethisTransaction}</Text>
          <Text style={styles.text2}>{STRINGS.sureRemoveTransaction}</Text>
          <View style={styles.BtnRow}>
            <View style={styles.flex}>
              <CustomButton
                title={STRINGS.No}
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                }}
                backgroundColor={COLORS.VIOLET[20]}
                textColor={COLORS.VIOLET[100]}
              />
            </View>
            <View style={styles.flex}>
              <CustomButton title={STRINGS.Yes} onPress={handleDelete} />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export default DeleteTransactionSheet;
