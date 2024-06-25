import React, {useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import CustomButton from '../CustomButton';
import Spacer from '../Spacer';
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
import Toast from 'react-native-toast-message';
import {useNetInfo} from '@react-native-community/netinfo';
import {useRealm} from '@realm/react';

function AddCategorySheet({
  bottomSheetModalRef,
  type,
  setMyCategory,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  type: transactionType['type'];
  setMyCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
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
  const {isConnected} = useNetInfo();
  const realm = useRealm();
  // state
  const [category, setCategory] = useState('');
  // functions
  const onPress = async () => {
    const userDoc = firestore().collection('users').doc(uid);
    if (category !== '') {
      dispatch(setLoading(true));
      if (
        type === 'expense'
          ? expenseCats?.includes(category.toLowerCase())
          : incomeCats?.includes(category.toLowerCase())
      ) {
        Toast.show({
          text1: `${category} is already added`,
          type: 'error',
          position: 'top',
        });
        dispatch(setLoading(false));
        return;
      }
      try {
        if (!isConnected) {
          if (type === 'expense') {
            dispatch(addExpenseCategory(category.toLowerCase()));
            realm.write(() => {
              realm.create('category', {
                name: category.toLowerCase(),
                type: 'expense',
              });
            });
          } else if (type === 'income') {
            dispatch(addIncomeCategory(category.toLowerCase()));
            realm.write(() => {
              realm.create('category', {
                name: category.toLowerCase(),
                type: 'income',
              });
            });
          }
        } else {
          if (type === 'expense') {
            dispatch(addExpenseCategory(category.toLowerCase()));
            await userDoc.update({
              expenseCategory: [...expenseCats!, category.toLowerCase()].map(
                item => encrypt(item, uid!),
              ),
            });
          } else if (type === 'income') {
            dispatch(addIncomeCategory(category.toLowerCase()));
            await userDoc.update({
              incomeCategory: [...incomeCats!, category.toLowerCase()].map(
                item => encrypt(item, uid!),
              ),
            });
          }
        }
        setMyCategory(category.toLocaleLowerCase().trim());
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
      handleIndicatorStyle={{backgroundColor: COLOR.VIOLET[40]}}>
      <BottomSheetView style={styles.sheetView}>
        <BottomSheetTextInput
          style={styles.input}
          placeholder={STRINGS.CategoryName}
          keyboardType={'default'}
          // value={category}
          onChangeText={(str: string) => {
            setCategory(str.trim());
          }}
          placeholderTextColor={COLORS.DARK[25]}
          autoCapitalize={'words'}
          autoCorrect={false}
          maxLength={20}
        />
        <Spacer height={20} />
        <CustomButton title={STRINGS.Add} onPress={onPress} />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default AddCategorySheet;
