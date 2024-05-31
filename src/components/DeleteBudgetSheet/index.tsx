import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import CustomButton from '../CustomButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import styles from './styles';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {COLORS} from '../../constants/commonStyles';
import {setLoading} from '../../redux/reducers/userSlice';
import Toast from 'react-native-toast-message';
import firestore, {deleteField} from '@react-native-firebase/firestore';
import {RootStackParamList} from '../../defs/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
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
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['30%'], []);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}>
        <BottomSheetView style={styles.sheetView}>
          <Text style={styles.text1}>Remove this budget?</Text>
          <Text style={styles.text2}>
            Are you sure do you wanna remove this budget?
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
                    bottomSheetModalRef.current?.dismiss();
                    navigation.pop();
                    await firestore()
                      .collection('users')
                      .doc(uid)
                      .update({
                        [`budget.${category}`]: deleteField(),
                      });
                    Toast.show({text1: 'Budget Deleted Succesfully'});
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

export default DeleteBudgetSheet;
