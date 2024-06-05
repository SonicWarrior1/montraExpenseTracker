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
import firestore, {
  FirebaseFirestoreTypes,
  Timestamp,
} from '@react-native-firebase/firestore';
import {currencies, monthData, weekData} from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import {repeatDataType, transactionType} from '../../defs/transaction';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {setLoading} from '../../redux/reducers/userSlice';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import {ExpenseScreenProps} from '../../defs/navigation';
import storage from '@react-native-firebase/storage';
import AddCategorySheet from '../../components/AddCategorySheet';
import {UserFromJson, UserType} from '../../defs/user';
import {EmptyError} from '../../constants/errors';

function AddExpense({navigation, route}: Readonly<ExpenseScreenProps>) {
  const pageType = route.params.type;
  const isEdit = route.params.isEdit;
  let transaction: transactionType | undefined;
  if (isEdit) {
    transaction = route.params.transaction;
    console.log(transaction?.freq);
  }
  const month = new Date().getMonth();
  const backgroundColor =
    pageType === 'expense' ? COLORS.PRIMARY.RED : COLORS.PRIMARY.GREEN;

  useEffect(() => {
    navigation.setOptions({
      title: pageType[0].toUpperCase() + pageType.slice(1),
    });
  }, []);

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
    transaction ? transaction.amount.toString() : '',
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

  async function getAttachmentUrl({
    attachement,
    id,
  }: {
    attachement: string;
    id: string;
  }) {
    let url = '';
    if (attachement !== '') {
      if (!attachement?.startsWith('https://firebasestorage.googleapis.com')) {
        await storage().ref(`users/${uid}/${id}`).putFile(attachement);
        url = await storage().ref(`users/${uid}/${id}`).getDownloadURL();
      } else {
        url = attachement;
      }
    }
    return url;
  }
  const conversion = useAppSelector(state => state.transaction.conversion);
  function createTransaction({
    id,
    url,
    attachementType,
  }: {
    id: string;
    url: string;
    attachementType: transactionType['attachementType'];
  }) {
    return {
      amount: Number(amount) / conversion['usd'][currency!.toLowerCase()],
      category: category,
      desc: desc,
      wallet: wallet,
      attachement: url,
      repeat: repeatData !== undefined,
      freq: repeatData ?? null,
      id: isEdit ? transaction!.id : id,
      timeStamp: isEdit ? transaction?.timeStamp! : Timestamp.now(),
      type: pageType,
      attachementType: attachementType,
    };
  }

  async function updateTransaction({trans}: {trans: transactionType}) {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('transactions')
      .doc(transaction!.id)
      .update(trans);
  }

  async function addNewTransaction({
    id,
    trans,
  }: {
    id: string;
    trans: transactionType;
  }) {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('transactions')
      .doc(id)
      .set(trans);
  }

  async function handleIncomeUpdate({
    curr,
  }: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  }) {
    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        [`income.${month}.${category}`]:
          ((UserFromJson(curr.data() as UserType).income[month][category] ??
            0) -
            transaction!.amount +
            Number(amount)) /
          conversion['usd'][currency!.toLowerCase()],
      });
  }
  async function handleNewIncome({
    curr,
  }: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  }) {
    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        [`income.${month}.${category}`]:
          ((UserFromJson(curr.data() as UserType)?.income[month]?.[category] ??
            0) +
            Number(amount)) /
          conversion['usd'][currency!.toLowerCase()],
      });
  }

  async function handleExpenseUpdate({
    curr,
  }: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  }) {
    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        [`spend.${month}.${category}`]:
          ((UserFromJson(curr.data() as UserType).spend[month][category] ?? 0) -
            transaction!.amount +
            Number(amount)) /
          conversion['usd'][currency!.toLowerCase()],
      });
  }

  async function handleNewExpense({
    curr,
  }: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  }) {
    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        [`spend.${month}.${category}`]:
          ((UserFromJson(curr.data() as UserType)?.spend[month]?.[category] ??
            0) +
            Number(amount)) /
          conversion['usd'][currency!.toLowerCase()],
      });
  }
  async function handleNotify({
    curr,
    totalSpent,
  }: {
    curr: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    totalSpent: number;
  }) {
    const totalBudget = UserFromJson(curr.data() as UserType)?.budget?.[
      month
    ]?.[category];
    if (
      totalBudget &&
      totalSpent >= totalBudget.limit * (totalBudget.percentage / 100)
    ) {
      console.log('notify');
      try {
        const notificationId = uuid.v4();
        await firestore()
          .collection('users')
          .doc(uid)
          .update({
            [`notification.${notificationId}`]: {
              type: 'budget',
              category: category,
              id: notificationId,
              time: Timestamp.now(),
              read: false,
            },
          });
      } catch (e) {
        console.log(e);
      }
    }
  }
  async function handlePress() {
    setFormKey(true);
    if (amount === '' || category === '' || wallet === '') {
      return;
    }
    dispatch(setLoading(true));
    const {attachement, attachementType} = getAttachmentAndType();
    try {
      const id = uuid.v4().toString();
      const url = await getAttachmentUrl({attachement, id});
      const trans = createTransaction({id, url, attachementType});
      const curr = await firestore().collection('users').doc(uid).get();
      if (isEdit) {
        await updateTransaction({trans});
        if (pageType === 'expense') {
          await handleExpenseUpdate({curr});
          const totalSpent =
            UserFromJson(curr.data() as UserType)?.spend?.[month]?.[category] ??
            0 - transaction!.amount + Number(amount);
          console.log(totalSpent);
          await handleNotify({curr, totalSpent});
        } else if (pageType === 'income') {
          await handleIncomeUpdate({curr});
        }
      } else {
        await addNewTransaction({id, trans});
        if (pageType === 'expense') {
          await handleNewExpense({curr});
          const totalSpent =
            (UserFromJson(curr.data() as UserType)?.spend[month]?.[category] ??
              0) + Number(amount);
          await handleNotify({curr, totalSpent});
        } else if (pageType === 'income') {
          await handleNewIncome({curr});
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
          <Text style={styles.text1}>How much?</Text>
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
              errorText="Please fill an amount"
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
              console.log('yo');
            } else {
              setCategory(val.value);
            }
          }}
          value={category}
          placeholder="Category"
        />
        <EmptyError
          errorText="Please select a category"
          value={category}
          formKey={formKey}
        />
        <CustomInput
          placeholderText="Description"
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
          placeholder="Wallet"
        />
        <EmptyError
          errorText="Please select a wallet"
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
            <Text style={styles.attachementText}>Add Attachement</Text>
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
            <Text style={styles.flexRowText1}>Repeat</Text>
            <Text style={styles.flexRowText2}>Repeat Transaction</Text>
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
              <Text style={styles.flexRowText1}>Frequency</Text>
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
                <Text style={styles.flexRowText1}>End After</Text>
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
        <CustomButton title="Continue" onPress={handlePress} />
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
