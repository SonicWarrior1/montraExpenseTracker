import React, {useCallback, useRef, useState} from 'react';
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
import {
  expenseCat,
  incomeCat,
  monthData,
  weekData,
} from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import {repeatDataType, transactionType} from '../../defs/transaction';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {setLoading} from '../../redux/reducers/userSlice';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import {ExpenseScreenProps} from '../../defs/navigation';
import storage from '@react-native-firebase/storage';

function AddExpense({navigation, route}: ExpenseScreenProps) {
  const pageType = route.params.type;
  const isEdit = route.params.isEdit;
  let transaction: transactionType | undefined = undefined;
  if (isEdit) {
    transaction = route.params.transaction;
  }
  console.log(transaction?.freq);
  const backgroundColor =
    pageType === 'expense' ? COLORS.PRIMARY.RED : COLORS.PRIMARY.GREEN;
  navigation.setOptions({title: pageType[0].toUpperCase() + pageType.slice(1)});
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalRef2 = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const [image, setImage] = useState(
    transaction ? transaction.attachement : '',
  );
  const [doc, setDoc] = useState<{uri: string; name: string}>();
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
  const dispatch = useAppDispatch();
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  async function handlePress() {
    if (amount) {
      dispatch(setLoading(true));
      let attachement = '';
      if (image !== '') {
        attachement = image!;
      } else if (doc) {
        attachement = doc.uri;
      }
      try {
        const id = uuid.v4().toString();
        let url = '';

        if (attachement !== '') {
          if (
            !attachement?.startsWith('https://firebasestorage.googleapis.com')
          ) {
            await storage().ref(`users/${uid}/${id}`).putFile(attachement);
            url = await storage().ref(`users/${uid}/${id}`).getDownloadURL();
          } else {
            console.log('yo');
            url = attachement;
          }
        }
        const trans: transactionType = {
          amount: Number(amount),
          category: category,
          desc: desc,
          wallet: wallet,
          attachement: url,
          repeat: repeatData !== undefined,
          freq: repeatData ?? null,
          id: isEdit ? transaction!.id : id,
          timeStamp: isEdit ? transaction?.timeStamp! : Timestamp.now(),
          type: pageType,
        };
        console.log(transaction);
        if (isEdit) {
          await firestore()
            .collection('users')
            .doc(uid)
            .collection('transactions')
            .doc(transaction!.id)
            .update(trans);
        } else {
          await firestore()
            .collection('users')
            .doc(uid)
            .collection('transactions')
            .doc(id)
            .set(trans);
        }
        Toast.show({text1: pageType + ' Added Succesfully'});
        navigation.pop();
      } catch (e) {
        console.log(e);
      }
      dispatch(setLoading(false));
    }
  }
  return (
    <View style={[styles.safeView, {backgroundColor: backgroundColor}]}>
      <SafeAreaView
        style={[styles.safeView, {backgroundColor: backgroundColor}]}>
        <View style={styles.mainView}>
          <Text style={styles.text1}>How much?</Text>
          <View style={styles.moneyCtr}>
            <Text style={styles.text2}>$</Text>
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
        </View>
      </SafeAreaView>
      <View style={styles.detailsCtr}>
        <CustomDropdown
          data={pageType === 'expense' ? expenseCat : incomeCat}
          onChange={val => {
            setCategory(val.value);
          }}
          value={category}
          placeholder="Category"
        />
        <Sapcer height={10} />
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
        <Sapcer height={10} />
        {image === '' && doc === undefined ? (
          <Pressable
            style={styles.attachementCtr}
            onPress={handlePresentModalPress}>
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
            <Pressable style={styles.sheetBtn} onPress={() => {}}>
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
                bottomSheetModalRef2.current?.present({
                  isEdit: isEdit,
                  transaction: transaction,
                });
              } else {
                setRepeatData(undefined);
              }
            }}
            value={repeatData !== undefined}
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
                    ? (repeatData.date! as Timestamp)
                        .toDate()
                        .toLocaleDateString()
                    : repeatData.date?.toLocaleDateString()}
                </Text>
              </View>
            )}
            <Pressable
              style={styles.editBtn}
              onPress={() => {
                bottomSheetModalRef2.current?.present({
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
          bottomSheetModalRef={bottomSheetModalRef}
          setDoc={setDoc}
          setImage={setImage}
        />
        <RepeatTransactionSheet
          bottomSheetModalRef={bottomSheetModalRef2}
          setRepeatData={setRepeatData}
        />
      </BottomSheetModalProvider>
    </View>
  );
}

export default AddExpense;
