import React from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {deleteBudget, setLoading} from '../../redux/reducers/userSlice';
import {RootStackParamList} from '../../defs/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {STRINGS} from '../../constants/strings';
// Third Party Libraries
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import Toast from 'react-native-toast-message';
import firestore, {deleteField} from '@react-native-firebase/firestore';
import {useNetInfo} from '@react-native-community/netinfo';
import {useRealm} from '@realm/react';
import {UpdateMode} from 'realm';
import DeleteSheet from '../DeleteSheet';
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
  const dispatch = useAppDispatch();
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
    <DeleteSheet
      handleDelete={handleDelete}
      bottomSheetModalRef={bottomSheetModalRef}
      text1={STRINGS.Removebudget}
      text2={STRINGS.SureRemoveBudgetNo}
    />
  );
}

export default React.memo(DeleteBudgetSheet);
