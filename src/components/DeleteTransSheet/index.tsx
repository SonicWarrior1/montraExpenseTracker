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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../defs/navigation';
import {setLoading} from '../../redux/reducers/userSlice';
import styles from './styles';
import {transactionType} from '../../defs/transaction';
import {UserFromJson, UserType} from '../../defs/user';
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
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'TransactionDetail',
    undefined
  >;
  type: transactionType['type'];
  amt: number;
  category: string;
}>) {
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['25%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
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
                    if (type === 'expense') {
                      const curr = await firestore()
                        .collection('users')
                        .doc(uid)
                        .get();
                      await firestore()
                        .collection('users')
                        .doc(uid)
                        .update({
                          [`spend.${category}`]:
                            (UserFromJson(curr.data() as UserType).spend[
                              category
                            ] ?? 0) - amt,
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
