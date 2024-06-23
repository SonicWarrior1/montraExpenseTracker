import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import style from './styles';

import CustomInput from '../../components/CustomInput';
import {COLORS} from '../../constants/commonStyles';
import Spacer from '../../components/Spacer';
import CustomDropdown from '../../components/CustomDropDown';
import {ICONS} from '../../constants/icons';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import FilePickerSheet from '../../components/FilePickerSheet';
import RepeatTransactionSheet from '../../components/RepeatTranscationSheet';
import {Timestamp} from '@react-native-firebase/firestore';
import {
  currencies,
  monthData,
  STRINGS,
  weekData,
} from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import {repeatDataType, transactionType} from '../../defs/transaction';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {setLoading, userLoggedIn} from '../../redux/reducers/userSlice';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import {ExpenseScreenProps} from '../../defs/navigation';
import AddCategorySheet from '../../components/AddCategorySheet';

import {
  CompundEmptyError,
  EmptyError,
  EmptyZeroError,
} from '../../constants/errors';
import AttachementContainer from './atoms/attachementContainer';
import {
  addNewTransaction,
  createTransaction,
  getAttachmentUrl,
  updateTransaction,
} from '../../utils/firebase';
import {useAppTheme} from '../../hooks/themeHook';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Switch} from 'react-native-switch';
import {useNetInfo} from '@react-native-community/netinfo';
import {useObject, useRealm} from '@realm/react';
import {TransFromJson} from '../../utils/transFuncs';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {UpdateMode} from 'realm';

function AddExpense({navigation, route}: Readonly<ExpenseScreenProps>) {
  // constants
  const {isConnected} = useNetInfo();
  const realm = useRealm();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const pageType = route.params.type;
  const isEdit = route.params.isEdit;
  let transaction: transactionType | undefined;
  if (isEdit) {
    transaction = route.params.transaction;
    // console.log(transaction);
  }
  const TransOnline = useObject(OnlineTransactionModel, transaction?.id ?? '');
  const month = new Date().getMonth();
  const getBackgroundColor = useMemo(() => {
    if (pageType === 'expense') {
      return COLORS.PRIMARY.RED;
    } else if (pageType === 'transfer') {
      return COLORS.PRIMARY.BLUE;
    } else {
      return COLORS.PRIMARY.GREEN;
    }
  }, [pageType]);
  const backgroundColor = getBackgroundColor;
  const dispatch = useAppDispatch();
  useEffect(() => {
    navigation.setOptions({
      title: pageType[0].toUpperCase() + pageType.slice(1),
      headerBackground: () => (
        <View
          style={{
            backgroundColor: getBackgroundColor,
            width: '100%',
            height: '100%',
          }}
        />
      ),
    });
  }, [pageType]);
  // redux use
  const conversion = useAppSelector(state => state.transaction.conversion);
  const expenseCat = useAppSelector(
    state => state.user.currentUser?.expenseCategory,
  );
  const incomeCat = useAppSelector(
    state => state.user.currentUser?.incomeCategory,
  );
  const user = useAppSelector(state => state.user.currentUser);
  const uid = useAppSelector(state => state.user.currentUser!.uid);
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  // state
  const [image, setImage] = useState(
    transaction && transaction.attachementType === 'image'
      ? transaction.attachement
      : '',
  );
  const [doc, setDoc] = useState<{uri: string; name: string} | undefined>(
    transaction && transaction.attachementType === 'doc'
      ? {uri: transaction.attachement!, name: 'Document'}
      : undefined,
  );
  const [repeatData, setRepeatData] = useState<repeatDataType | undefined>(
    transaction ? transaction.freq! : undefined,
  );
  const [desc, setDesc] = useState(transaction ? transaction.desc : '');
  const [zindex, setZindex] = useState(1);
  const [amount, setAmount] = useState(
    transaction
      ? Number(
          (
            conversion.usd[(currency ?? 'USD').toLowerCase()] *
            transaction.amount
          ).toFixed(1),
        ).toString()
      : '0',
  );
  const [category, setCategory] = useState<string | undefined>(
    transaction ? transaction.category : '',
  );
  const [wallet, setWallet] = useState(transaction ? transaction.wallet : '');
  const [from, setFrom] = useState(transaction ? transaction.from : '');
  const [to, setTo] = useState(transaction ? transaction.to : '');
  const [formKey, setFormKey] = useState(false);
  const [catColors, setCatColors] = useState<{[key: string]: string}>();
  // refs
  const filePickSheetRef = useRef<BottomSheetModal>(null);
  const repeatSheetRef = useRef<BottomSheetModal>(null);
  const addCategorySheetRef = useRef<BottomSheetModal>(null);

  // functions
  const getAttachmentAndType = useCallback(() => {
    let attachement = '';
    let attachementType: transactionType['attachementType'] = 'none';
    if (image !== '') {
      console.log('IMAGE', image);
      attachement = image!;
      attachementType = 'image';
    } else if (doc) {
      attachement = doc.uri;
      attachementType = 'doc';
    }
    return {attachement, attachementType};
  }, [image, doc]);

  const handlePress = async () => {
    setFormKey(true);
    if (
      pageType === 'transfer' &&
      (amount === '' || Number(amount) <= 0 || from === '' || to === '')
    ) {
      return;
    }
    if (
      pageType !== 'transfer' &&
      (amount === '' || Number(amount) <= 0 || category === '' || wallet === '')
    ) {
      return;
    }
    dispatch(setLoading(true));
    const {attachement, attachementType} = getAttachmentAndType();
    try {
      const id = uuid.v4().toString();
      if (!isConnected) {
        console.log('offline');
        let trans = TransFromJson(
          createTransaction({
            id: id,
            url: attachement,
            attachementType: attachementType,
            amount: amount,
            category: pageType === 'transfer' ? 'transfer' : category!,
            conversion: conversion,
            currency: currency!,
            desc: desc,
            isEdit: isEdit,
            pageType: pageType,
            repeatData: repeatData!,
            transaction: transaction!,
            wallet: wallet,
            uid: uid!,
            from: from,
            to: to,
          }),
          uid!,
        );
        console.log('trans', trans.freq);
        if (!isConnected && trans.freq?.date?.seconds !== undefined) {
          trans.freq.date = Timestamp.fromMillis(
            trans.freq?.date.seconds * 1000,
          ).toDate();
        }
        console.log(trans.freq);
        if (pageType === 'income') {
          dispatch(
            userLoggedIn({
              ...user,
              income: {
                ...user?.income,
                [month]: {
                  ...(user?.income?.[month] ?? {}),
                  [category!]: isEdit
                    ? user?.income[month][category!]! -
                      transaction?.amount! +
                      Number(amount)
                    : (user?.income?.[month]?.[category!] ?? 0) +
                      Number(amount),
                },
              },
            }),
          );
        } else {
          dispatch(
            userLoggedIn({
              ...user,
              spend: {
                ...user?.spend,
                [month]: {
                  ...(user?.spend?.[month] ?? {}),
                  [category!]: isEdit
                    ? user?.spend[month][category!]! -
                      transaction?.amount! +
                      Number(amount)
                    : (user?.spend?.[month]?.[category!] ?? 0) + Number(amount),
                },
              },
            }),
          );
        }
        if (trans.freq) {
          trans.freq.date = Timestamp.fromDate(trans.freq?.date as Date);
        }
        realm.write(() => {
          if (isEdit && TransOnline) {
            realm.create(
              'OnlineTransaction',
              {...trans, changed: true},
              UpdateMode.Modified,
            );
          }
          realm.create(
            'OfflineTransaction',
            {...trans, operation: isEdit ? 'update' : 'add'},
            UpdateMode.All,
          );
        });
      } else {
        const url = await getAttachmentUrl({
          attachement: attachement,
          id: id,
          uid: uid!,
        });
        const trans = createTransaction({
          id: id,
          url: url,
          attachementType: attachementType,
          amount: amount,
          category: pageType === 'transfer' ? 'transfer' : category!,
          conversion: conversion,
          currency: currency!,
          desc: desc,
          isEdit: isEdit,
          pageType: pageType,
          repeatData: repeatData!,
          transaction: transaction!,
          wallet: wallet,
          uid: uid!,
          from: from,
          to: to,
        });
        if (isEdit) {
          await updateTransaction({
            trans: trans,
            transId: transaction?.id!,
            uid: uid,
          });
        } else {
          await addNewTransaction({id: id, trans: trans, uid: uid});
        }
      }
      Toast.show({
        text1: `Transaction has been ${
          isEdit ? 'Updated' : 'Added'
        } Successfully`,
        type: 'custom',
      });
      navigation.pop();
      dispatch(setLoading(false));
    } catch (e) {
      dispatch(setLoading(false));
    }
  };
  const getDate = useCallback(() => {
    if (repeatData) {
      if (isEdit) {
        if ((repeatData.date as Timestamp)?.seconds !== undefined) {
          return (
            Timestamp.fromMillis((repeatData.date as Timestamp)?.seconds * 1000)
              ?.toDate()
              ?.getDate() +
            ' ' +
            monthData[
              Timestamp.fromMillis(
                (repeatData.date as Timestamp)?.seconds * 1000,
              )
                ?.toDate()
                ?.getMonth()
            ].label +
            ' ' +
            Timestamp.fromMillis((repeatData.date as Timestamp)?.seconds * 1000)
              ?.toDate()
              ?.getFullYear()
          );
        } else {
          return (
            (repeatData.date as Date)?.getDate() +
            ' ' +
            monthData[(repeatData.date as Date)?.getMonth()].label +
            ' ' +
            (repeatData.date as Date)?.getFullYear()
          );
        }
      } else {
        return (
          (repeatData.date as Date)?.getDate() +
          ' ' +
          monthData[(repeatData.date as Date)?.getMonth()].label +
          ' ' +
          (repeatData.date as Date)?.getFullYear()
        );
      }
    }
  }, [isEdit, repeatData]);
  const getMyColor = useCallback(() => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
  }, []);
  useEffect(() => {
    setCatColors(
      Object.values(pageType === 'expense' ? expenseCat! : incomeCat!).reduce(
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
  }, [pageType, expenseCat, incomeCat]);
  return (
    <>
      <KeyboardAwareScrollView
        style={[{backgroundColor: backgroundColor}]}
        contentContainerStyle={[
          {backgroundColor: backgroundColor, flexGrow: 1},
        ]}
        enableOnAndroid={true}>
        <SafeAreaView
          style={[
            styles.safeView,
            {
              backgroundColor: backgroundColor,
            },
          ]}>
          <View
            style={[
              styles.mainView,
              {
                height:
                  pageType === 'transfer'
                    ? Dimensions.get('screen').height / 2.4
                    : Dimensions.get('screen').height / 4,
              },
            ]}>
            <Text style={styles.text1}>{STRINGS.HowMuch}</Text>
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
            <View style={styles.amtError}>
              <EmptyZeroError
                errorText={STRINGS.PleaseFillAnAmount}
                value={amount}
                formKey={formKey}
                color={COLORS.LIGHT[100]}
                size={18}
              />
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.detailsCtr}>
          {pageType !== 'transfer' && (
            <CustomDropdown
              data={(pageType === 'expense' ? expenseCat! : incomeCat!)?.map(
                item => {
                  return {
                    label:
                      item === 'add'
                        ? 'ADD NEW CATEGORY'
                        : item[0].toUpperCase() + item.slice(1),
                    value: item,
                  };
                },
              )}
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
          )}
          {pageType === 'transfer' && (
            <View style={styles.transferRow}>
              <View style={styles.flex}>
                <CustomInput
                  placeholderText={'From'}
                  onChangeText={(str: string) => {
                    setFrom(str);
                  }}
                  type="name"
                  value={from}
                  inputColor={COLOR.DARK[100]}
                />
              </View>
              <View style={[styles.transferIcon, {zIndex: zindex}]}>
                {ICONS.Transfer2({height: 25, width: 25})}
              </View>
              <View style={styles.flex}>
                <CustomInput
                  placeholderText={'To'}
                  onChangeText={(str: string) => {
                    setTo(str);
                  }}
                  type="name"
                  value={to}
                  inputColor={COLOR.DARK[100]}
                />
              </View>
            </View>
          )}
          {pageType === 'transfer' && (
            <CompundEmptyError
              errorText="Please fill both the fields."
              value1={to}
              value2={from}
              formKey={formKey}
            />
          )}
          {pageType !== 'transfer' && (
            <EmptyError
              errorText={STRINGS.PleaseSelectACategory}
              value={category!}
              formKey={formKey}
            />
          )}
          <CustomInput
            placeholderText={STRINGS.Description}
            onChangeText={(str: string) => {
              setDesc(str);
            }}
            type="sentence"
            value={desc}
            inputColor={COLOR.DARK[100]}
          />
          <Spacer height={24} />
          {pageType !== 'transfer' && (
            <CustomDropdown
              data={[
                {label: 'Paypal', value: 'paypal'},
                {label: 'Chase', value: 'chase'},
              ]}
              onChange={val => {
                setWallet(val.value);
              }}
              value={wallet}
              placeholder={STRINGS.Wallet}
            />
          )}
          {pageType !== 'transfer' && (
            <EmptyError
              errorText={STRINGS.PleaseSelectAWallet}
              value={wallet}
              formKey={formKey}
            />
          )}
          <AttachementContainer
            doc={doc}
            filePickSheetRef={filePickSheetRef}
            image={image!}
            setDoc={setDoc}
            setImage={setImage}
            setZindex={setZindex}
            zindex={zindex}
          />
          <Spacer height={20} />
          {pageType !== 'transfer' && (
            <View style={styles.flexRow}>
              <View>
                <Text style={styles.flexRowText1}>{STRINGS.Repeat}</Text>
                <Text style={styles.flexRowText2}>
                  {repeatData
                    ? 'Repeat transaction, set your own time'
                    : STRINGS.RepeatTransaction}
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
                  if (val) {
                    repeatSheetRef.current?.present({
                      isEdit: isEdit,
                      transaction: transaction,
                    });
                  } else {
                    setRepeatData(undefined);
                  }
                }}
                value={repeatData !== undefined && repeatData !== null}
              />
            </View>
          )}
          {pageType !== 'transfer' && <Spacer height={20} />}
          {repeatData && (
            <View style={styles.flexRow}>
              <View>
                <Text style={styles.flexRowText1}>{STRINGS.Frequency}</Text>
                <Text style={styles.flexRowText2}>
                  {repeatData.freq[0].toUpperCase() + repeatData.freq.slice(1)}
                  {repeatData.freq !== 'daily' && ' - '}
                  {repeatData.freq === 'yearly' &&
                    monthData[repeatData.month! - 1].label}{' '}
                  {(repeatData.freq === 'yearly' ||
                    repeatData.freq === 'monthly') &&
                    repeatData.day}
                  {repeatData.freq === 'weekly' &&
                    weekData[repeatData.weekDay].label}
                </Text>
              </View>
              {repeatData.end === 'date' && (
                <View>
                  <Text style={styles.flexRowText1}>{STRINGS.EndAfter}</Text>
                  <Text style={styles.flexRowText2}>{getDate()}</Text>
                </View>
              )}
              <Pressable
                style={styles.editBtn}
                onPress={() => {
                  repeatSheetRef.current?.present({
                    isEdit: isEdit,
                    transaction: transaction,
                  });
                }}>
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </View>
          )}
          <Spacer height={20} />
          <CustomButton title={STRINGS.Continue} onPress={handlePress} />
          <Spacer height={20} />
        </View>
      </KeyboardAwareScrollView>
      <BottomSheetModalProvider>
        <FilePickerSheet
          onDismiss={() => {
            setZindex(1);
          }}
          bottomSheetModalRef={filePickSheetRef}
          setDoc={setDoc}
          setImage={setImage}
        />
        <RepeatTransactionSheet
          bottomSheetModalRef={repeatSheetRef}
          setRepeatData={setRepeatData}
        />
        <AddCategorySheet
          bottomSheetModalRef={addCategorySheetRef}
          type={pageType}
          setMyCategory={setCategory}
        />
      </BottomSheetModalProvider>
    </>
  );
}

export default AddExpense;
