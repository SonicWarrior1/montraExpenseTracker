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
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {COLORS} from '../../constants/commonStyles';
import {setLoading} from '../../redux/reducers/userSlice';
import Toast from 'react-native-toast-message';
import firestore, {deleteField} from '@react-native-firebase/firestore';
import {RootStackParamList} from '../../defs/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import SheetBackdrop from '../SheetBackDrop';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
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
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['30%'], []);
  const handleDelete = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      bottomSheetModalRef.current?.dismiss();
      navigation.pop();
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          [`budget.${category}`]: deleteField(),
        });
      Toast.show({text1: STRINGS.BudgetDeletedSuccesfully, type: 'custom'});
      dispatch(setLoading(false));
    } catch (e) {
      console.log(e);
      dispatch(setLoading(false));
    }
  }, [uid, category]);
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
