import React, {useRef, useState} from 'react';
import {SafeAreaView, Switch, Text, TextInput, View} from 'react-native';
import Sapcer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import styles from './styles';
import CustomDropdown from '../../components/CustomDropDown';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import AddCategorySheet from '../../components/AddCategorySheet';
import {COLORS} from '../../constants/commonStyles';
import {Slider} from '@miblanchard/react-native-slider';
import firestore from '@react-native-firebase/firestore';
import {setLoading} from '../../redux/reducers/userSlice';
import {CreateBudgetScreenProps} from '../../defs/navigation';
import {currencies} from '../../constants/strings';
function CreateBudget({navigation, route}: Readonly<CreateBudgetScreenProps>) {
  const month = new Date().getMonth();
  const isEdit = route.params.isEdit;
  let cat = undefined;
  let oldBudget = undefined;
  if (isEdit) {
    cat = route.params.category;
    oldBudget = useAppSelector(
      state => state.user.currentUser?.budget[month][cat!],
    );
  }

  const conversion = useAppSelector(state => state.transaction.conversion);
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const [amount, setAmount] = useState(
    isEdit
      ? (conversion['usd'][currency!.toLowerCase()!] * oldBudget?.limit!)
          .toFixed(2)
          .toString()
      : '',
  );
  const [category, setCategory] = useState(isEdit ? cat : '');
  const [alert, setAlert] = useState(isEdit ? oldBudget?.alert : false);
  const [sliderVal, setSliderVal] = useState(
    isEdit ? oldBudget?.percentage : 0,
  );
  const expenseCat = useAppSelector(
    state => state.user.currentUser?.expenseCategory,
  );
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const addCategorySheetRef = useRef<BottomSheetModal>(null);
  const dispatch = useAppDispatch();
  return (
    <View style={styles.safeView}>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.mainView}>
          <Text style={styles.text1}>How much do you want to spend?</Text>
          <View style={styles.moneyCtr}>
            <Text style={styles.text2}>{currencies[currency!].symbol}</Text>
            <TextInput
              style={styles.input}
              maxLength={8}
              onChangeText={(str: string) => {
                const numericValue = str.replace(/\D/g, '');
                setAmount(numericValue);
              }}
              value={amount}
              keyboardType="numeric"
            />
          </View>
          <Sapcer height={20} />
        </View>
      </SafeAreaView>
      <View style={styles.detailsCtr}>
        <CustomDropdown
          data={expenseCat!.map(item => {
            return {
              label:
                item === 'add'
                  ? 'Add new Category'
                  : item[0].toUpperCase() + item.slice(1),
              value: item,
            };
          })}
          onChange={val => {
            if (val.value === 'add') {
              addCategorySheetRef.current?.present();
              console.log('yo');
            } else {
              setCategory(val.value);
            }
          }}
          value={category}
          placeholder="Category"
        />
        <Sapcer height={30} />
        <View style={styles.flexRow}>
          <View>
            <Text style={styles.flexRowText1}>Receive Alert</Text>
            <Text style={styles.flexRowText2}>
              Receive alert when it reaches {'\n'}some point.
            </Text>
          </View>
          <Switch
            trackColor={{false: COLORS.VIOLET[20], true: COLORS.VIOLET[100]}}
            ios_backgroundColor={COLORS.VIOLET[20]}
            onValueChange={val => {
              setAlert(val);
              setSliderVal(0);
            }}
            value={alert}
          />
        </View>
        <Sapcer height={10} />
        {alert === true ? (
          <Slider
            maximumValue={100}
            minimumValue={0}
            trackStyle={{
              height: 10,
              borderRadius: 20,
            }}
            minimumTrackTintColor={COLORS.VIOLET[100]}
            maximumTrackTintColor={COLORS.LIGHT[20]}
            renderThumbComponent={() => (
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 24,
                  backgroundColor: COLORS.VIOLET[100],
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.LIGHT[100],
                    fontWeight: '500',
                  }}>
                  {sliderVal}%
                </Text>
              </View>
            )}
            value={sliderVal}
            onValueChange={val => {
              setSliderVal(Math.floor(val[0]));
            }}
          />
        ) : (
          <></>
        )}
        <Sapcer height={30} />
        <CustomButton
          title="Continue"
          onPress={async () => {
            if (amount !== '') {
              try {
                dispatch(setLoading(true));
                await firestore()
                  .collection('users')
                  .doc(uid)
                  .update({
                    [`budget.${month}.${category}`]: {
                      limit:
                        Number(amount) /
                        conversion['usd'][currency!.toLowerCase()!],
                      alert: alert,
                      percentage: sliderVal,
                    },
                  });
                dispatch(setLoading(false));
                navigation.pop();
              } catch (e) {
                console.log(e);
                dispatch(setLoading(false));
              }
            }
          }}
        />
        <Sapcer height={40} />
      </View>
      <BottomSheetModalProvider>
        <AddCategorySheet
          bottomSheetModalRef={addCategorySheetRef}
          type={'expense'}
        />
      </BottomSheetModalProvider>
    </View>
  );
}

export default CreateBudget;
