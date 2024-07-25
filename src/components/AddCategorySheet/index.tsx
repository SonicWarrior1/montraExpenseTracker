import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Keyboard, Text, View} from 'react-native';
import style from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
// import CustomButton from '../CustomButton'
import {
  addExpenseCategory,
  addIncomeCategory,
  setLoading,
} from '../../redux/reducers/userSlice';
import {transactionType} from '../../defs/transaction';
import SheetBackdrop from '../SheetBackDrop';
import {encrypt} from '../../utils/encryption';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
import {COLORS} from '../../constants/commonStyles';
import {EmptyError} from '../../constants/errors';
// Third Party Libraries
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import {useNetInfo} from '@react-native-community/netinfo';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
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
  const [category, setCategory] = useState<string>('');
  const [formKey, setFormKey] = useState<boolean>(false);
  // functions
  const handleOffline = useCallback(async () => {
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
  }, [category, type]);

  const handleOnline = useCallback(async () => {
    const userDoc = firestore().collection('users').doc(uid);
    if (type === 'expense') {
      dispatch(addExpenseCategory(category.toLowerCase()));
      await userDoc.update({
        expenseCategory: [...expenseCats!, category.toLowerCase()].map(item =>
          encrypt(item, uid!),
        ),
      });
    } else if (type === 'income') {
      dispatch(addIncomeCategory(category.toLowerCase()));
      await userDoc.update({
        incomeCategory: [...incomeCats!, category.toLowerCase()].map(item =>
          encrypt(item, uid!),
        ),
      });
    }
  }, [category, expenseCats, incomeCats, type, uid]);

  const onPress = useCallback(async () => {
    setFormKey(true);
    if (category !== '') {
      dispatch(setLoading(true));
      if (
        type === 'expense'
          ? expenseCats?.includes(category.trim().toLowerCase())
          : incomeCats?.includes(category.trim().toLowerCase())
      ) {
        Toast.show({
          text1: `${category}` + STRINGS.AlreadyAdded,
          type: 'error',
          position: 'top',
        });
        dispatch(setLoading(false));
        return;
      }
      try {
        if (!isConnected) {
          await handleOffline();
        } else {
          await handleOnline();
        }
        setMyCategory(category.toLocaleLowerCase().trim());
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(setLoading(false));
        bottomSheetModalRef.current?.dismiss();
      }
    }
  }, [
    category,
    type,
    expenseCats,
    incomeCats,
    isConnected,
    setMyCategory,
    handleOffline,
    handleOnline,
  ]);

  useEffect(() => {
    const keyboard = Keyboard.addListener('keyboardDidHide', () => {
      bottomSheetModalRef.current?.snapToIndex(0);
    });
    return () => keyboard.remove();
  }, []);

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
        <EmptyError
          errorText={STRINGS.CategoryCannotBeEmpty}
          formKey={formKey}
          value={category.trim()}
        />
        <View style={styles.btnCtr}>
          <TouchableOpacity onPress={onPress} style={styles.btn}>
            <Text style={styles.btnText}>{STRINGS.Add}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default React.memo(AddCategorySheet);
