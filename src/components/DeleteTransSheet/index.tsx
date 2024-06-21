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
import style from './styles';
import {transactionType} from '../../defs/transaction';
import {UserType} from '../../defs/user';
import SheetBackdrop from '../SheetBackDrop';
import {UserFromJson} from '../../utils/userFuncs';
import {encrypt} from '../../utils/encryption';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNetInfo} from '@react-native-community/netinfo';
import {useObject, useRealm} from '@realm/react';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {UpdateMode} from 'realm';
import storage from '@react-native-firebase/storage';
function DeleteTransactionSheet({
  bottomSheetModalRef,
  id,
  url,
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
  url: string;
  type: transactionType['type'];
  amt: number;
  category: string;
}>) {
  // redux
  const conversion = useAppSelector(state => state.transaction.conversion);
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // constants
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['30%'], []);
  const month = new Date().getMonth();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const {isConnected} = useNetInfo();
  const realm = useRealm();
  const trans = useObject(OnlineTransactionModel, id);
  // functions
  const handleDelete = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      if (!isConnected) {
        realm.write(() => {
          realm.create(
            'OfflineTransaction',
            {...trans, operation: 'delete'},
            UpdateMode.Modified,
          );
        });
        bottomSheetModalRef.current?.dismiss();
        navigation.pop();
      } else {
        const userDoc = firestore().collection('users').doc(uid);
        bottomSheetModalRef.current?.dismiss();
        navigation.pop();
        await userDoc.collection('transactions').doc(id).delete();
        if (url !== '') {
          await storage().refFromURL(url).delete();
        }
        // setTimeout(() => {
        //   realm.write(() => {
        //     realm.delete(trans);
        //   });
        // }, 500);
      }
      Toast.show({
        text1: STRINGS.TransactionDeletedSuccesfully,
        type: 'custom',
      });
      dispatch(setLoading(false));
    } catch (e) {
      console.log(e);
      dispatch(setLoading(false));
    }
  }, [uid, id, isConnected]);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={SheetBackdrop}
        backgroundStyle={styles.sheetBack}
        handleIndicatorStyle={{backgroundColor: COLOR.VIOLET[40]}}>
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
