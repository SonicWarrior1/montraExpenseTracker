import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {useMemo} from 'react';
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
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={SheetBackdrop}
        backgroundStyle={{borderTopLeftRadius: 32, borderTopRightRadius: 32}}>
        <BottomSheetView style={styles.sheetView}>
          <Text style={styles.text1}>Remove this Transaction?</Text>
          <Text style={styles.text2}>
            Are you sure do you wanna remove this transaction?
          </Text>
          <View style={styles.BtnRow}>
            <View style={{flex: 1}}>
              <CustomButton
                title="No"
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                }}
                backgroundColor={COLORS.VIOLET[20]}
                textColor={COLORS.VIOLET[100]}
              />
            </View>
            <View style={{flex: 1}}>
              <CustomButton
                title="Yes"
                onPress={async () => {
                  try {
                    dispatch(setLoading(true));
                    const curr = await firestore()
                      .collection('users')
                      .doc(uid)
                      .get();
                    if (type === 'expense') {
                      await firestore()
                        .collection('users')
                        .doc(uid)
                        .update({
                          [`spend.${month}.${category}`]: encrypt(
                            String(
                              (
                                Number(
                                  UserFromJson(curr.data() as UserType).spend[
                                    month
                                  ][category] ?? 0,
                                ) -
                                amt / conversion['usd'][currency!.toLowerCase()]
                              ).toFixed(2),
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
                                  UserFromJson(curr.data() as UserType).income[
                                    month
                                  ][category] ?? 0,
                                ) -
                                amt / conversion['usd'][currency!.toLowerCase()]
                              ).toFixed(2),
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
                    Toast.show({text1: 'Transaction Deleted Succesfully'});
                    bottomSheetModalRef.current?.dismiss();
                    navigation.pop();
                    dispatch(setLoading(false));
                  } catch (e) {
                    console.log(e);
                    dispatch(setLoading(false));
                  }
                }}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export default DeleteTransactionSheet;
