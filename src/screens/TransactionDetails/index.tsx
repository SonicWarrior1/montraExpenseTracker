import React, {useEffect, useRef} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import styles from './styles';
import {TransactionDetailScreenProps} from '../../defs/navigation';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import {
  currencies,
  monthData,
  NAVIGATION,
  STRINGS,
  weekData,
} from '../../constants/strings';
import Sapcer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import DeleteTransactionSheet from '../../components/DeleteTransSheet';
import {useAppSelector} from '../../redux/store';
import {Timestamp} from '@react-native-firebase/firestore';

function TransactionDetails({
  route,
  navigation,
}: Readonly<TransactionDetailScreenProps>) {
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const conversion = useAppSelector(state => state.transaction.conversion);
  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
  const trans = useAppSelector(
    state =>
      state.transaction.transactions[
        route.params.transaction.timeStamp.seconds
      ],
  );
  const headerRight = () => {
    return (
      <Pressable
        onPress={() => {
          bottomSheetModalRef.current?.present();
        }}
        style={{marginRight: 15}}>
        {ICONS.Trash({height: 25, width: 25, color: 'white'})}
      </Pressable>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    });
  }, []);
  return (
    trans && (
      <View style={{flex: 1}}>
        <SafeAreaView
          style={[
            styles.safeView,
            {
              backgroundColor:
                trans.type === 'expense'
                  ? COLORS.PRIMARY.RED
                  : trans.type === 'income'
                  ? COLORS.PRIMARY.GREEN
                  : COLORS.PRIMARY.BLUE,
            },
          ]}>
          <Sapcer height={Dimensions.get('screen').height * 0.075} />
          <Text style={styles.amt}>
            {currencies[currency!].symbol ?? '$'}{' '}
            {Number(
              (
                conversion.usd[(currency ?? 'USD').toLowerCase()] * trans.amount
              ).toFixed(2),
            )}
          </Text>
          <Text style={styles.desc}>{trans.desc ?? ''}</Text>
          <Text style={styles.time}>
            {
              weekData[
                Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
                  .toDate()
                  .getDay()
              ].label
            }{' '}
            {Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
              .toDate()
              .getDate()}{' '}
            {
              monthData[
                Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
                  .toDate()
                  .getMonth()
              ].label
            }{' '}
            {Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
              .toDate()
              .getFullYear()}{' '}
            {Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
              .toDate()
              .getHours()}
            :
            {Timestamp.fromMillis(trans.timeStamp.seconds * 1000)
              .toDate()
              .getMinutes()}
          </Text>
        </SafeAreaView>
        <View style={styles.bottomView}>
          <View style={styles.ctr}>
            <View style={styles.ctrColumn}>
              <Text style={styles.text1}>{STRINGS.Type}</Text>
              <Text style={styles.text2}>
                {trans.type[0].toLocaleUpperCase() + trans.type.slice(1)}
              </Text>
            </View>
            {trans.type === 'transfer' ? (
              <>
                <View style={styles.ctrColumn}>
                  <Text style={styles.text1}>From</Text>
                  <Text style={styles.text2}>
                    {(trans.from ?? '')[0].toLocaleUpperCase() +
                      (trans.from ?? '').slice(1)}
                  </Text>
                </View>
                <View style={styles.ctrColumn}>
                  <Text style={styles.text1}>To</Text>
                  <Text style={styles.text2}>
                    {trans.to[0].toLocaleUpperCase() + trans.to.slice(1)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.ctrColumn}>
                  <Text style={styles.text1}>{STRINGS.Category}</Text>
                  <Text style={styles.text2}>
                    {(trans.category ?? '')[0].toLocaleUpperCase() +
                      (trans.category ?? '').slice(1)}
                  </Text>
                </View>
                <View style={styles.ctrColumn}>
                  <Text style={styles.text1}>{STRINGS.Wallet}</Text>
                  <Text style={styles.text2}>
                    {trans.wallet === undefined || trans.wallet === ''
                      ? ''
                      : trans.wallet[0].toLocaleUpperCase() +
                        trans.wallet.slice(1)}
                  </Text>
                </View>
              </>
            )}
          </View>
          <View style={styles.descCtr}>
            <Text style={styles.descTitle}>{STRINGS.Description}</Text>
            <Text style={styles.descText}>{STRINGS.SampleDesc}</Text>
            {trans.attachementType !== 'none' && (
              <View>
                <Text style={styles.descTitle}>{STRINGS.Attachement}</Text>
                {trans.attachementType === 'image' ? (
                  <Image source={{uri: trans.attachement}} style={styles.img} />
                ) : (
                  <CustomButton
                    title={STRINGS.ViewDocument}
                    onPress={() => {
                      navigation.navigate(NAVIGATION.DocView, {
                        uri: trans.attachement!,
                      });
                    }}
                    backgroundColor={COLORS.VIOLET[20]}
                    textColor={COLORS.VIOLET[100]}
                  />
                )}
              </View>
            )}
          </View>
          <View style={styles.btnView}>
            <CustomButton
              title={STRINGS.Edit}
              onPress={() => {
                navigation.navigate(NAVIGATION.AddExpense, {
                  type: trans.type,
                  isEdit: true,
                  transaction: trans,
                });
              }}
            />
          </View>
        </View>
        <DeleteTransactionSheet
          bottomSheetModalRef={bottomSheetModalRef}
          id={trans.id}
          navigation={navigation}
          type={trans.type}
          category={trans.category}
          amt={trans.amount}
        />
      </View>
    )
  );
}

export default TransactionDetails;
