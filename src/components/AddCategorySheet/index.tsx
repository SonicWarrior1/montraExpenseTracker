import React, {useCallback, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';
import Sapcer from '../Spacer';
import firestore from '@react-native-firebase/firestore';
import {
  addExpenseCategory,
  addIncomeCategory,
  setLoading,
} from '../../redux/reducers/userSlice';
import {transactionType} from '../../defs/transaction';
import styles from './styles';
import SheetBackdrop from '../SheetBackDrop';
import {encrypt} from '../../utils/encryption';
import {STRINGS} from '../../constants/strings';

function AddCategorySheet({
  bottomSheetModalRef,
  type,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  type: transactionType['type'];
}>) {
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const expenseCats = useAppSelector(
    state => state.user.currentUser?.expenseCategory,
  );
  const incomeCats = useAppSelector(
    state => state.user.currentUser?.incomeCategory,
  );
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['25%'], []);
  const [cat, setCat] = useState('');
  const onPress = useCallback(async () => {
    if (cat !== '') {
      dispatch(setLoading(true));
      if (type === 'expense') {
        await dispatch(addExpenseCategory(cat));
        await firestore()
          .collection('users')
          .doc(uid)
          .update({
            expenseCategory: [...expenseCats!, cat].map(item =>
              encrypt(item, uid!),
            ),
          });
      } else if (type === 'income') {
        await dispatch(addIncomeCategory(cat));
        await firestore()
          .collection('users')
          .doc(uid)
          .update({
            incomeCategory: [...incomeCats!, cat].map(item =>
              encrypt(item, uid!),
            ),
          });
      }
      dispatch(setLoading(false));
      bottomSheetModalRef.current?.dismiss();
    }
  }, [uid]);
  return (
    <BottomSheetModal
      enablePanDownToClose
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.sheetBack}>
      <BottomSheetView style={styles.sheetView}>
        <CustomInput
          placeholderText={STRINGS.CategoryName}
          onChangeText={(str: string) => {
            setCat(str);
          }}
          type="name"
          value={cat}
        />
        <Sapcer height={20} />
        <CustomButton title={STRINGS.Add} onPress={onPress} />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default AddCategorySheet;
