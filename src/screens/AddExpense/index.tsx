import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import styles from './styles';
import CustomInput from '../../components/CustomInput';
import {COLORS} from '../../constants/commonStyles';
import Sapcer from '../../components/Spacer';
import CustomDropdown from '../../components/CustomDropDown';
import {ICONS} from '../../constants/icons';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import FilePickerSheet from '../../components/FilePickerSheet';
import RepeatTransactionSheet from '../../components/RepeatTranscationSheet';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import {currencies, monthData, STRINGS, weekData} from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import {repeatDataType, transactionType} from '../../defs/transaction';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {setLoading} from '../../redux/reducers/userSlice';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import {ExpenseScreenProps} from '../../defs/navigation';
import AddCategorySheet from '../../components/AddCategorySheet';
import {UserType} from '../../defs/user';
import {EmptyError} from '../../constants/errors';
import {UserFromJson} from '../../utils/userFuncs';
import {
  addNewTransaction,
  createTransaction,
  getAttachmentUrl,
  handleExpenseUpdate,
  handleIncomeUpdate,
  handleNewExpense,
  handleNewIncome,
  handleNotify,
  updateTransaction,
} from '../../utils/firebase';

function AddExpense({navigation, route}: Readonly<ExpenseScreenProps>) {
  const pageType = route.params.type;
  const isEdit = route.params.isEdit;
  let transaction: transactionType | undefined;
  if (isEdit) {
    transaction = route.params.transaction;
    console.log(transaction);
  }
  const month = new Date().getMonth();
  const backgroundColor =
    pageType === 'expense' ? COLORS.PRIMARY.RED : COLORS.PRIMARY.GREEN;

  useEffect(() => {
    navigation.setOptions({
      title: pageType[0].toUpperCase() + pageType.slice(1),
    });
  }, [pageType]);
  const conversion = useAppSelector(state => state.transaction.conversion);
  const expenseCat = useAppSelector(
    state => state.user.currentUser?.expenseCategory,
  );
  const incomeCat = useAppSelector(
    state => state.user.currentUser?.incomeCategory,
  );
  const dispatch = useAppDispatch();
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const currency = useAppSelector(state => state.user.currentUser?.currency);

  const filePickSheetRef = useRef<BottomSheetModal>(null);
  const repeatSheetRef = useRef<BottomSheetModal>(null);
  const addCategorySheetRef = useRef<BottomSheetModal>(null);

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
  const [amount, setAmount] = useState(
    transaction
      ? Number(
          (
            conversion.usd[(currency ?? 'USD').toLowerCase()] *
            transaction.amount
          ).toFixed(2),
        ).toString()
      : '',
  );
  const [category, setCategory] = useState(
    transaction ? transaction.category : '',
  );
  const [wallet, setWallet] = useState(transaction ? transaction.wallet : '');

  const getAttachmentAndType = useCallback(() => {
    let attachement = '';
    let attachementType: transactionType['attachementType'] = 'none';
    if (image !== '') {
      attachement = image!;
      attachementType = 'image';
    } else if (doc) {
      attachement = doc.uri;
      attachementType = 'doc';
    }
    return {attachement, attachementType};
  }, [image, doc]);

  async function handlePress() {
    setFormKey(true);
    if (amount === '' || category === '' || wallet === '') {
      return;
    }
    dispatch(setLoading(true));
    const {attachement, attachementType} = getAttachmentAndType();
    try {
      const id = uuid.v4().toString();
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
        category: category,
        conversion: conversion,
        currency: currency!,
        desc: desc,
        isEdit: isEdit,
        pageType: pageType,
        repeatData: repeatData!,
        transaction: transaction!,
        wallet: wallet,
        uid: uid!,
      });
      const curr = await firestore().collection('users').doc(uid).get();
      if (isEdit) {
        await updateTransaction({
          trans: trans,
          transId: transaction?.id!,
          uid: uid!,
        });
        if (pageType === 'expense') {
          await handleExpenseUpdate({
            curr: curr,
            amount: Number(amount),
            category: category,
            conversion: conversion,
            currency: currency!,
            month: month,
            transaction: transaction!,
            uid: uid!,
          });
          const totalSpent =
            UserFromJson(curr.data() as UserType)?.spend?.[month]?.[category] ??
            0 - transaction!.amount + Number(amount);
          await handleNotify({
            curr: curr,
            totalSpent: totalSpent,
            category: category,
            month: month,
            uid: uid!,
          });
        } else if (pageType === 'income') {
          await handleIncomeUpdate({
            curr: curr,
            amount: Number(amount),
            category: category,
            conversion: conversion,
            currency: currency!,
            month: month,
            transaction: transaction!,
            uid: uid!,
          });
        }
      } else {
        await addNewTransaction({id: id, trans: trans, uid: uid!});
        if (pageType === 'expense') {
          await handleNewExpense({
            curr: curr,
            amount: Number(amount),
            category: category,
            conversion: conversion,
            currency: currency!,
            month: month,
            uid: uid!,
          });
          const totalSpent =
            (UserFromJson(curr.data() as UserType)?.spend[month]?.[category] ??
              0) + Number(amount);
          await handleNotify({
            curr: curr,
            totalSpent: totalSpent,
            category: category,
            month: month,
            uid: uid!,
          });
        } else if (pageType === 'income') {
          await handleNewIncome({
            curr: curr,
            amount: Number(amount),
            category: category,
            conversion: conversion,
            currency: currency!,
            month: month,
            uid: uid!,
          });
        }
      }
      Toast.show({text1: pageType + ' Added Succesfully'});
      navigation.pop();
    } catch (e) {
      console.log(e);
    }
    dispatch(setLoading(false));
  }
  const [formKey, setFormKey] = useState(false);
  return (
    <View style={[styles.safeView, {backgroundColor: backgroundColor}]}>
      <SafeAreaView
        style={[styles.safeView, {backgroundColor: backgroundColor}]}>
        <View style={styles.mainView}>
          <Text style={styles.text1}>{STRINGS.HowMuch}</Text>
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
          <View style={{left: 20}}>
            <EmptyError
              errorText={STRINGS.PleaseFillAnAmount}
              value={amount}
              formKey={formKey}
              color={COLORS.RED[100]}
              size={18}
            />
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.detailsCtr}>
        <CustomDropdown
          data={(pageType === 'expense' ? expenseCat! : incomeCat!)?.map(
            item => {
              return {
                label:
                  item === 'add'
                    ? 'Add new Category'
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
        />
        <EmptyError
          errorText={STRINGS.PleaseSelectACategory}
          value={category}
          formKey={formKey}
        />
        <CustomInput
          placeholderText={STRINGS.Description}
          onChangeText={(str: string) => {
            setDesc(str);
          }}
          type="name"
          value={desc}
        />
        <Sapcer height={10} />
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
        <EmptyError
          errorText={STRINGS.PleaseSelectAWallet}
          value={wallet}
          formKey={formKey}
        />
        {image === '' && doc === undefined ? (
          <Pressable
            style={styles.attachementCtr}
            onPress={() => {
              filePickSheetRef.current?.present();
            }}>
            {ICONS.Attachment({
              height: 20,
              width: 20,
            })}
            <Text style={styles.attachementText}>{STRINGS.AddAttachement}</Text>
          </Pressable>
        ) : doc === undefined ? (
          <View>
            <Pressable
              onPress={() => {
                setImage('');
              }}
              style={[styles.closeIcon, {left: 90}]}>
              {ICONS.Close({height: 20, width: 20})}
            </Pressable>
            <Image
              source={{uri: image}}
              height={110}
              width={110}
              style={{borderRadius: 10}}
            />
          </View>
        ) : (
          <View>
            <Pressable
              onPress={() => {
                setDoc(undefined);
              }}
              style={[styles.closeIcon, {left: 100}]}>
              {ICONS.Close({height: 20, width: 20})}
            </Pressable>
            <Pressable
              style={[styles.sheetBtn, {paddingHorizontal: 10}]}
              onPress={() => {}}>
              {ICONS.Document({height: 30, width: 30})}
              <Text style={styles.sheetBtnText}>{doc.name}</Text>
            </Pressable>
          </View>
        )}
        <Sapcer height={20} />
        <View style={styles.flexRow}>
          <View>
            <Text style={styles.flexRowText1}>{STRINGS.Repeat}</Text>
            <Text style={styles.flexRowText2}>{STRINGS.RepeatTransaction}</Text>
          </View>
          <Switch
            trackColor={{false: COLORS.VIOLET[20], true: COLORS.VIOLET[100]}}
            ios_backgroundColor={COLORS.VIOLET[20]}
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
        <Sapcer height={20} />
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
                <Text style={styles.flexRowText2}>
                  {isEdit
                    ? (repeatData.date as Timestamp)?.seconds !== undefined
                      ? (repeatData.date as Timestamp)
                          .toDate()
                          .toLocaleDateString()
                      : (repeatData.date as Date)?.toLocaleDateString()
                    : (repeatData.date as Date)?.toLocaleDateString()}
                </Text>
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
        <Sapcer height={20} />
        <CustomButton title={STRINGS.Continue} onPress={handlePress} />
        <Sapcer height={20} />
      </View>
      <BottomSheetModalProvider>
        <FilePickerSheet
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
        />
      </BottomSheetModalProvider>
    </View>
  );
}

export default AddExpense;
