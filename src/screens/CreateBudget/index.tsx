import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView, Switch, Text, TextInput, View} from 'react-native';
import Spacer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import style from './styles';
import CustomDropdown from '../../components/CustomDropDown';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import AddCategorySheet from '../../components/AddCategorySheet';
import {COLORS} from '../../constants/commonStyles';
import {Slider} from '@miblanchard/react-native-slider';
import firestore from '@react-native-firebase/firestore';
import {setLoading} from '../../redux/reducers/userSlice';
import {CreateBudgetScreenProps} from '../../defs/navigation';
import {currencies, STRINGS} from '../../constants/strings';
import {encrypt} from '../../utils/encryption';
import {useAppTheme} from '../../hooks/themeHook';
import {EmptyError, EmptyZeroError} from '../../constants/errors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
function CreateBudget({navigation, route}: Readonly<CreateBudgetScreenProps>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const month = new Date().getMonth();
  const isEdit = route.params.isEdit;
  let selectedCategory;
  let oldBudget;
  const x =
    useAppSelector(state => state.user.currentUser?.budget[month]) ?? {};
  if (isEdit) {
    selectedCategory = route.params.category;
    oldBudget = selectedCategory
      ? x?.[selectedCategory] ?? undefined
      : undefined;
  }
  const dispatch = useAppDispatch();
  // redux
  const conversion = useAppSelector(state => state.transaction.conversion);
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const budgets = useAppSelector(
    state => state.user.currentUser?.budget[month],
  );
  const expenseCat = useAppSelector(
    state => state.user.currentUser?.expenseCategory,
  );
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // state
  const [amount, setAmount] = useState(
    isEdit
      ? (conversion.usd[currency!.toLowerCase()] * oldBudget?.limit!)
          .toFixed(1)
          .toString()
      : '0',
  );
  const [category, setCategory] = useState(isEdit ? selectedCategory : '');
  const [alert, setAlert] = useState(isEdit ? oldBudget?.alert : false);
  const [sliderVal, setSliderVal] = useState(
    isEdit ? oldBudget?.percentage : 0,
  );
  const [catColors, setCatColors] = useState<{[key: string]: string}>();
  const [form, setForm] = useState(false);

  // ref
  const addCategorySheetRef = useRef<BottomSheetModal>(null);
  //functions
  const getMyColor = useCallback(() => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
  }, []);
  useEffect(() => {
    setCatColors(
      Object.values(expenseCat!).reduce(
        (acc: {[key: string]: string}, item) => {
          acc[item] = getMyColor();
          return acc;
        },
        {},
      ),
    );
    return () => {
      setCatColors(undefined);
    };
  }, [expenseCat]);
  return (
    <KeyboardAwareScrollView
      style={{backgroundColor: COLOR.PRIMARY.VIOLET}}
      contentContainerStyle={{flexGrow: 1}}
      enableOnAndroid>
      <View style={styles.safeView}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.mainView}>
            <Text style={styles.text1}>{STRINGS.HowMuchDoSpent}</Text>
            <View style={styles.moneyCtr}>
              <Text style={styles.text2}>{currencies[currency!].symbol}</Text>
              <TextInput
                style={styles.input}
                maxLength={6}
                onPress={() => {
                  if (amount === '0') {
                    setAmount('');
                  }
                }}
                onChangeText={(str: string) => {
                  let numericValue = str.replace(/[^0-9.]+/g, '');
                  const decimalCount = numericValue.split('.').length - 1;
                  if (decimalCount > 1) {
                    const parts = numericValue.split('.');
                    numericValue = parts[0] + '.' + parts.slice(1).join('');
                  }
                  setAmount(numericValue);
                }}
                value={amount}
                keyboardType="numeric"
              />
            </View>
            <View style={{left: 20}}>
              <EmptyZeroError
                errorText={STRINGS.PleaseFillAnAmount}
                value={amount}
                formKey={form}
                color={COLORS.RED[100]}
                size={18}
              />
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.detailsCtr}>
          <CustomDropdown
            data={expenseCat!
              .filter(cat => !Object.keys(budgets??[]).includes(cat))
              .map(item => {
                return {
                  label:
                    item === 'add'
                      ? 'ADD NEW CATEGORY'
                      : item[0].toUpperCase() + item.slice(1),
                  value: item,
                };
              })}
            onChange={val => {
              if (val.value === 'add') {
                addCategorySheetRef.current?.present();
              } else {
                setCategory(val.value);
              }
            }}
            value={category}
            placeholder={STRINGS.Category}
            leftIcon={visible => {
              return !visible && category !== '' ? (
                <View
                  style={{
                    height: 15,
                    width: 15,
                    backgroundColor: catColors?.[category ?? ''] ?? 'green',
                    borderRadius: 20,
                    marginRight: 8,
                  }}
                />
              ) : undefined;
            }}
            catColors={catColors}
          />
          <EmptyError
            errorText={STRINGS.PleaseSelectACategory}
            value={category!}
            formKey={form}
          />
          <Spacer height={20} />
          <View style={styles.flexRow}>
            <View>
              <Text style={styles.flexRowText1}>{STRINGS.RecieveAlert}</Text>
              <Text style={styles.flexRowText2}>
                {STRINGS.RecieveAlertWhen} {'\n'}
                {STRINGS.SomePoint}
              </Text>
            </View>
            <Switch
              trackColor={{
                false: COLORS.VIOLET[20],
                true: COLORS.VIOLET[100],
              }}
              ios_backgroundColor={COLORS.VIOLET[20]}
              onValueChange={val => {
                setAlert(val);
                setSliderVal(0);
              }}
              value={alert}
            />
          </View>
          <Spacer height={10} />
          {alert === true ? (
            <Slider
              maximumValue={100}
              minimumValue={0}
              trackStyle={styles.sliderTrack}
              minimumTrackTintColor={COLORS.VIOLET[100]}
              maximumTrackTintColor={COLOR.LIGHT[40]}
              renderThumbComponent={() => (
                <View style={styles.thumb}>
                  <Text style={styles.thumbText}>{sliderVal}%</Text>
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
          <Spacer height={30} />
          <CustomButton
            title={STRINGS.Continue}
            onPress={async () => {
              setForm(true);
              if (amount !== '' && Number(amount) > 0 && category !== '') {
                try {
                  dispatch(setLoading(true));
                  await firestore()
                    .collection('users')
                    .doc(uid)
                    .update({
                      [`budget.${month}.${category}`]: {
                        limit: encrypt(
                          String(
                            (
                              Number(amount) /
                              conversion.usd[currency!.toLowerCase()]
                            ).toFixed(1),
                          ),
                          uid!,
                        ),
                        alert: alert,
                        percentage: encrypt(String(sliderVal), uid!),
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
          <Spacer height={20} />
        </View>
        <BottomSheetModalProvider>
          <AddCategorySheet
            bottomSheetModalRef={addCategorySheetRef}
            type={'expense'}
            setMyCategory={setCategory}
          />
        </BottomSheetModalProvider>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default CreateBudget;
