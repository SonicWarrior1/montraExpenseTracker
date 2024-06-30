import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import CustomButton from '../CustomButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import style from './styles';
import {COLORS} from '../../constants/commonStyles';
import {deleteBudget, setLoading} from '../../redux/reducers/userSlice';
import {RootStackParamList} from '../../defs/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import SheetBackdrop from '../SheetBackDrop';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import Toast from 'react-native-toast-message';
import firestore, {deleteField} from '@react-native-firebase/firestore';
import {useNetInfo} from '@react-native-community/netinfo';
import {useRealm} from '@realm/react';
import {UpdateMode} from 'realm';
function DeleteBudgetSheet({
  bottomSheetModalRef,
  navigation,
  category,
  budget,
  month,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  navigation: StackNavigationProp<
    RootStackParamList,
    'DetailBudget',
    undefined
  >;
  category: string;
  budget: {
    alert: boolean;
    limit: number;
    percentage: number;
  };
  month: number;
}>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['30%'], []);
  const {isConnected} = useNetInfo();
  const realm = useRealm();
  // redux
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // functions
  const handleDelete = async () => {
    try {
      dispatch(setLoading(true));
      bottomSheetModalRef.current?.dismiss();
      navigation.pop();
      if (!isConnected) {
        dispatch(deleteBudget({month: month, cat: category}));
        realm.write(() => {
          realm.create(
            'budget',
            {
              ...budget,
              delete: true,
              id: month + '_' + category,
            },
            UpdateMode.Modified,
          );
        });
      } else {
        await firestore()
          .collection('users')
          .doc(uid)
          .update({
            [`budget.${month}.${category}`]: deleteField(),
          });
      }
      Toast.show({
        text1: STRINGS.BudgetDeletedSuccesfully,
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
          <Text style={styles.text1}>{STRINGS.Removebudget}</Text>
          <Text style={styles.text2}>{STRINGS.SureRemoveBudgetNo}</Text>
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

export default React.memo(DeleteBudgetSheet);
