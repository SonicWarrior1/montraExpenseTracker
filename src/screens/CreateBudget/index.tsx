import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
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
import {AmountInputSetter, getMyColor} from '../../utils/commonFuncs';
import Toast from 'react-native-toast-message';
import {
  handleOfflineNotification,
  handleOnlineNotify,
} from '../../utils/firebase';
import CategoryDropdownIcon from '../../components/CategoryColorIcon';
import {RFValue} from 'react-native-responsive-fontsize';
function CreateBudget({navigation, route}: Readonly<CreateBudgetScreenProps>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const month = new Date().getMonth();
  const isEdit = route.params.isEdit;
  let selectedCategory;
  let oldBudget:
    | {
        alert: boolean;
        limit: number;
        percentage: number;
        conversion: {
          [key: string]: {
            [key: string]: number;
          };
        };
      }
    | undefined;
  const x =
    useAppSelector(state => state.user.currentUser?.budget[month]) ?? {};
  if (isEdit) {
    selectedCategory = route.params.category;
    oldBudget = selectedCategory
      ? x?.[selectedCategory] ?? undefined
      : undefined;
  }
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  // redux
  const conversion = useAppSelector(state => state.user.conversion);
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const budgets = useAppSelector(
    state => state.user.currentUser?.budget[month],
  );
  const expenseCat = useAppSelector(
    state => state.user.currentUser?.expenseCategory,
  );
  const user = useAppSelector(state => state.user.currentUser);
  const realm = useRealm();
  // state
  const [amount, setAmount] = useState<string>(
    isEdit
      ? Number(
          (
            (oldBudget?.conversion?.usd?.[currency?.toLowerCase() ?? 'usd'] ??
              1) * Number(oldBudget?.limit!)
          ).toFixed(2),
        ).toString()
      : '0',
  );
  const [category, setCategory] = useState<string | undefined>(
    isEdit ? selectedCategory : '',
  );
  const [alert, setAlert] = useState<boolean | undefined>(
    isEdit ? oldBudget?.alert : false,
  );
  const [sliderVal, setSliderVal] = useState<number | undefined>(
    isEdit ? oldBudget?.percentage : 0,
  );
  const [catColors, setCatColors] = useState<{[key: string]: string}>();
  const [form, setForm] = useState<boolean>(false);

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
                limit: Number(
                  (
                    Number(amount.replace(/,/g, '')) /
                    (isEdit ? oldBudget!.conversion : conversion).usd[
                      currency!.toLowerCase()
                    ]
                  ).toFixed(10),
                ),
                alert: alert,
                percentage: sliderVal,
                id: month + '_' + category,
                delete: false,
                conversion: isEdit ? oldBudget!.conversion : conversion,
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
                  (isEdit ? oldBudget!.conversion : conversion).usd[
                    currency!.toLowerCase()
                  ]
                ).toFixed(10),
                alert: alert,
                percentage: sliderVal,
                conversion: isEdit ? oldBudget!.conversion : conversion,
              },
            }),
          );
          // const totalSpent = user?.spend?.[month]?.[category!].USD ?? 0;
          // handleOfflineNotification({
          //   category: category!,
          //   dispatch: dispatch,
          //   realm: realm,
          //   totalBudget: {
          //     limit: Number(amount.replace(/,/g, '')),
          //     alert: alert!,
          //     percentage: sliderVal!,
          //   },
          //   totalSpent: totalSpent,
          //   user: user,
          // });
        } else {
          await firestore()
            .collection('users')
            .doc(user!.uid)
            .update({
              [`budget.${month}.${category}`]: {
                limit: encrypt(
                  String(
                    (
                      Number(amount.replace(/,/g, '')) /
                      (isEdit ? oldBudget!.conversion : conversion).usd[
                        currency!.toLowerCase()
                      ]
                    ).toFixed(10),
                  ),
                  user!.uid,
                ),
                alert: alert,
                percentage: encrypt(String(sliderVal), user!.uid),
                conversion: isEdit ? oldBudget!.conversion : conversion,
              },
            });
          const curr = await firestore()
            .collection('users')
            .doc(user!.uid)
            .get();
          const totalSpent = user?.spend?.[month]?.[category!]?.USD ?? 0;
          await handleOnlineNotify({
            category: category!,
            month: month,
            totalSpent: totalSpent,
            uid: user!.uid,
            curr: curr,
          });
        }
        Toast.show({
          text1: isEdit
            ? STRINGS.BudgetUpdatedSuccesfully
            : STRINGS.BudgetCreatedSuccesfully,
          type: 'custom',
        });
        dispatch(setLoading(false));
        navigation.pop();
      } catch (e) {
        console.log(e);
        dispatch(setLoading(false));
      }
    }
  }, [
    amount,
    category,
    alert,
    sliderVal,
    dispatch,
    isConnected,
    isEdit,
    navigation,
    realm,
    month,
    conversion,
    currency,
    user,
    oldBudget,
  ]);
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
  const backAction = () => {
    if (
      ((amount.replace(/,/g, '').trim() !== '' ||
        amount.replace(/,/g, '').trim() !== '0') &&
        amount.replace(/,/g, '').trim() === '.') ||
      Number(amount.replace(/,/g, '')) > 0 ||
      category !== ''
    ) {
      Alert.alert(STRINGS.DiscardChanges, STRINGS.UnsavedChanges, [
        {
          text: 'No',
        },
        {text: 'Yes', onPress: () => [navigation.goBack()]},
      ]);
    } else {
      navigation.goBack();
    }
    return true;
  };
  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => back.remove();
  });
  return (
    <KeyboardAwareScrollView
      // extraHeight={150}
      style={{backgroundColor: COLOR.VIOLET[100]}}
      contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.safeView}>
        <SafeAreaView style={styles.safeView}>
          <CustomHeader
            backgroundColor={COLOR.VIOLET[100]}
            title={STRINGS.CreateBudget}
            navigation={navigation}
            onPress={backAction}
          />
          <View style={styles.mainView}>
            <Text style={styles.text1}>{STRINGS.HowMuchDoSpent}</Text>
            <View style={styles.moneyCtr}>
              <Text style={styles.text2}>{currencies[currency!].symbol}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    fontSize: RFValue(64 - (amount.length > 7 ? 15 : 0)),
                  },
                ]}
                maxLength={10}
                numberOfLines={1}
                onPress={() => {
                  if (amount === '0') {
                    setAmount('');
                  }
                }}
                onChangeText={(str: string) =>
                  AmountInputSetter(str, setAmount)
                }
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
            leftIcon={CategoryDropdownIcon(category!, catColors!)}
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
            errorText={STRINGS.SliderError}
          />
          <Spacer height={10} />
          <CustomButton title={STRINGS.Continue} onPress={handleCreate} />
          <Spacer height={10} />
        </View>
      </View>
      <BottomSheetModalProvider>
        <AddCategorySheet
          bottomSheetModalRef={addCategorySheetRef}
          type={'expense'}
          setMyCategory={setCategory}
        />
      </BottomSheetModalProvider>
    </KeyboardAwareScrollView>
  );
}

export default React.memo(CreateBudget);
