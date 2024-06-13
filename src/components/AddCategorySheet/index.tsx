import React, {useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import CustomButton from '../CustomButton';
import Sapcer from '../Spacer';
import firestore from '@react-native-firebase/firestore';
import {
  addExpenseCategory,
  addIncomeCategory,
  setLoading,
} from '../../redux/reducers/userSlice';
import {transactionType} from '../../defs/transaction';
import style from './styles';
import SheetBackdrop from '../SheetBackDrop';
import {encrypt} from '../../utils/encryption';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
import {COLORS} from '../../constants/commonStyles';

function AddCategorySheet({
  bottomSheetModalRef,
  type,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  type: transactionType['type'];
}>) {
  // redux
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const expenseCats = useAppSelector(
    state => state.user.currentUser?.expenseCategory,
  );
  const incomeCats = useAppSelector(
    state => state.user.currentUser?.incomeCategory,
  );
  // constants
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['25%'], []);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // state
  const [category, setCategory] = useState('');
  // functions
  const onPress = async () => {
    const userDoc = firestore().collection('users').doc(uid);
    if (category !== '') {
      dispatch(setLoading(true));
      try {
        if (type === 'expense') {
          dispatch(addExpenseCategory(category));
          await userDoc.update({
            expenseCategory: [...expenseCats!, category].map(item =>
              encrypt(item, uid!),
            ),
          });
        } else if (type === 'income') {
          dispatch(addIncomeCategory(category));
          await userDoc.update({
            incomeCategory: [...incomeCats!, category].map(item =>
              encrypt(item, uid!),
            ),
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(setLoading(false));
        bottomSheetModalRef.current?.dismiss();
      }
    }
  };

  return (
    <BottomSheetModal
      enablePanDownToClose
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.sheetBack}
      handleIndicatorStyle={{backgroundColor: COLOR.DARK[100]}}>
      <BottomSheetView style={styles.sheetView}>
        <BottomSheetTextInput
          style={styles.input}
          placeholder={STRINGS.CategoryName}
          keyboardType={'default'}
          value={category}
          onChangeText={(str: string) => {
            setCategory(str);
          }}
          placeholderTextColor={COLORS.DARK[25]}
          autoCapitalize={'words'}
          autoCorrect={false}
        />
        <Sapcer height={20} />
        <CustomButton title={STRINGS.Add} onPress={onPress} />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default AddCategorySheet;
