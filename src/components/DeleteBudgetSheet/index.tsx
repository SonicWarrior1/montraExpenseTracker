import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo} from 'react';
import {Text, View} from 'react-native';
import CustomButton from '../CustomButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import style from './styles';
import {COLORS} from '../../constants/commonStyles';
import {setLoading} from '../../redux/reducers/userSlice';
import {RootStackParamList} from '../../defs/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import SheetBackdrop from '../SheetBackDrop';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import Toast from 'react-native-toast-message';
import firestore, {deleteField} from '@react-native-firebase/firestore';
function DeleteBudgetSheet({
  bottomSheetModalRef,
  navigation,
  category,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  navigation: StackNavigationProp<
    RootStackParamList,
    'DetailBudget',
    undefined
  >;
  category: string;
}>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['34%'], []);
  const month=new Date().getMonth()
  // redux
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // functions
  const handleDelete = async () => {
    try {
      dispatch(setLoading(true));
      bottomSheetModalRef.current?.dismiss();
      navigation.pop();
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          [`budget.${month}.${category}`]: deleteField(),
        });
      Toast.show({text1: STRINGS.BudgetDeletedSuccesfully, type: 'custom'});
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
        handleIndicatorStyle={{backgroundColor: COLOR.DARK[100]}}>
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

export default DeleteBudgetSheet;
