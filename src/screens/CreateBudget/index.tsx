import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
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
import {setLoading, addBudget} from '../../redux/reducers/userSlice';
import {CreateBudgetScreenProps} from '../../defs/navigation';
import {currencies, STRINGS} from '../../constants/strings';
import {encrypt} from '../../utils/encryption';
import {useAppTheme} from '../../hooks/themeHook';
import {EmptyError, EmptyZeroError} from '../../constants/errors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNetInfo} from '@react-native-community/netinfo';
import {useRealm} from '@realm/react';
import {UpdateMode} from 'realm';
import {Switch} from 'react-native-switch';
import CustomHeader from '../../components/CustomHeader';
import {formatWithCommas, getMyColor} from '../../utils/commonFuncs';
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
  // console.log('params', selectedCategory);
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
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
  const realm = useRealm();
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
  const dropdownData = useMemo(
    () =>
      expenseCat!
        .filter(cat =>
          isEdit ? true : !Object.keys(budgets ?? []).includes(cat),
        )
        .map(item => {
          return {
            label:
              item === 'add'
                ? 'ADD NEW CATEGORY'
                : item[0].toUpperCase() + item.slice(1),
            value: item,
          };
        }),
    [expenseCat, isEdit, budgets],
  );
  const handleCreate = useCallback(async () => {
    // console.log('helloo');
    setForm(true);
    if (
      amount.replace(/,/g, '') !== '' &&
      Number(amount.replace(/,/g, '')) > 0 &&
      category !== '' &&
      (alert === true ? sliderVal! > 0 : true)
    ) {
      try {
        dispatch(setLoading(true));
        if (!isConnected) {
          realm.write(() => {
            realm.create(
              'budget',
              {
                limit: (
                  Number(amount.replace(/,/g, '')) /
                  conversion.usd[currency!.toLowerCase()]
                ).toFixed(10),
                alert: alert,
                percentage: sliderVal,
                id: month + '_' + category,
                delete: false,
              },
              UpdateMode.Modified,
            );
          });
          dispatch(
            addBudget({
              month: month,
              cat: category,
              budget: {
                limit: (
                  Number(amount.replace(/,/g, '')) /
                  conversion.usd[currency!.toLowerCase()]
                ).toFixed(10),
                alert: alert,
                percentage: sliderVal,
              },
            }),
          );
        } else {
          await firestore()
            .collection('users')
            .doc(uid)
            .update({
              [`budget.${month}.${category}`]: {
                limit: encrypt(
                  String(
                    (
                      Number(amount.replace(/,/g, '')) /
                      conversion.usd[currency!.toLowerCase()]
                    ).toFixed(10),
                  ),
                  uid!,
                ),
                alert: alert,
                percentage: encrypt(String(sliderVal), uid!),
              },
            });
        }
        dispatch(setLoading(false));
        navigation.pop();
      } catch (e) {
        console.log(e);
        dispatch(setLoading(false));
      }
    }
  }, [
    amount,
    alert,
    sliderVal,
    category,
    month,
    currency,
    conversion,
    uid,
    isConnected,
  ]);
  const dropdownLeft = (visible?: boolean) => {
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
  };
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
  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (
        ((amount.replace(/,/g, '').trim() !== '' ||
          amount.replace(/,/g, '').trim() !== '0') &&
          amount.replace(/,/g, '').trim() === '.') ||
        Number(amount.replace(/,/g, '')) > 0 ||
        category !== ''
      ) {
        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
          [
            {
              text: 'No',
            },
            {text: 'Yes', onPress: () => [navigation.goBack()]},
          ],
        );
      } else {
        navigation.goBack();
      }
      return true;
    });
    return () => back.remove();
  });
  return (
    <>
      <KeyboardAwareScrollView
        style={{backgroundColor: COLOR.PRIMARY.VIOLET}}
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid

        // collapsable={false}
        // enableAutomaticScroll={Platform.OS==='ios'}
        // keyboardShouldPersistTaps="handled"
      >
        <View style={styles.safeView}>
          <SafeAreaView style={styles.safeView}>
            <CustomHeader
              backgroundColor={COLOR.VIOLET[100]}
              title="Create Budget"
              navigation={navigation}
              onPress={() => {
                if (
                  ((amount.replace(/,/g, '').trim() !== '' ||
                    amount.replace(/,/g, '').trim() !== '0') &&
                    amount.replace(/,/g, '').trim() === '.') ||
                  Number(amount.replace(/,/g, '')) > 0 ||
                  category !== ''
                ) {
                  Alert.alert(
                    'Discard changes?',
                    'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
                    [
                      {
                        text: 'No',
                      },
                      {text: 'Yes', onPress: () => [navigation.goBack()]},
                    ],
                  );
                } else {
                  navigation.goBack();
                }
              }}
            />
            <View style={styles.mainView}>
              <Text style={styles.text1}>{STRINGS.HowMuchDoSpent}</Text>
              <View style={styles.moneyCtr}>
                <Text style={styles.text2}>{currencies[currency!].symbol}</Text>
                <TextInput
                  style={styles.input}
                  maxLength={10}
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

                    if (
                      numericValue.length > 0 &&
                      numericValue[numericValue.length - 1] === '.'
                    ) {
                      // Allow only if it is not the only character
                      if (numericValue.length === 1) {
                        numericValue = numericValue.slice(0, -1);
                      } else if (
                        numericValue[numericValue.length - 2] === '.'
                      ) {
                        // Remove last character if there are two consecutive decimal points
                        numericValue = numericValue.slice(0, -1);
                      }
                    }

                    // Limit to 1 digit after decimal point
                    if (decimalCount === 1) {
                      const parts = numericValue.split('.');
                      if (parts[1].length > 1) {
                        numericValue = parts[0] + '.' + parts[1].slice(0, 1);
                      }
                    }

                    if (decimalCount === 1 && numericValue.length > 8) {
                      numericValue = numericValue.slice(0, 8);
                    } else if (decimalCount === 0 && numericValue.length > 7) {
                      numericValue = numericValue.slice(0, 7);
                    }

                    setAmount(formatWithCommas(numericValue));
                  }}
                  value={amount}
                  keyboardType="numeric"
                  onBlur={() => {
                    if (amount === '') {
                      setAmount('0');
                    }
                  }}
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
              data={dropdownData}
              onChange={val => {
                if (val.value === 'add') {
                  addCategorySheetRef.current?.present();
                } else {
                  setCategory(val.value);
                }
              }}
              value={category}
              placeholder={STRINGS.Category}
              leftIcon={dropdownLeft}
              catColors={catColors}
            />
            <EmptyError
              errorText={STRINGS.PleaseSelectACategory}
              value={category!}
              formKey={form}
            />
            <View style={styles.flexRow}>
              <View>
                <Text style={styles.flexRowText1}>{STRINGS.RecieveAlert}</Text>
                <Text style={styles.flexRowText2}>
                  {STRINGS.RecieveAlertWhen} {'\n'}
                  {STRINGS.SomePoint}
                </Text>
              </View>
              <Switch
                backgroundActive={COLORS.VIOLET[100]}
                backgroundInactive={COLORS.VIOLET[20]}
                activeText=""
                inActiveText=""
                barHeight={30}
                circleSize={24}
                switchBorderRadius={16}
                innerCircleStyle={{width: 24, height: 24}}
                switchLeftPx={5}
                switchRightPx={5}
                circleBorderWidth={0}
                onValueChange={val => {
                  setAlert(val);
                  setSliderVal(0);
                }}
                value={alert}
              />
            </View>
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
            {form && <Spacer height={20} />}
            <EmptyZeroError
              formKey={alert! && form}
              value={String(sliderVal)}
              errorText="Value cannot be zero. Please adjust the slider"
            />
            <Spacer height={10} />
            <CustomButton title={STRINGS.Continue} onPress={handleCreate} />
            <Spacer height={10} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {/* <BottomSheetModalProvider>
        <AddCategorySheet
          bottomSheetModalRef={addCategorySheetRef}
          type={'expense'}
          setMyCategory={setCategory}
        />
      </BottomSheetModalProvider> */}
    </>
  );
}

export default React.memo(CreateBudget);
