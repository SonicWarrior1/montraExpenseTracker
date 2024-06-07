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
  weekData,
} from '../../constants/strings';
import Sapcer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import DeleteTransactionSheet from '../../components/DeleteTransSheet';
import {useAppSelector} from '../../redux/store';

function TransactionDetails({
  route,
  navigation,
}: Readonly<TransactionDetailScreenProps>) {
  const currency = useAppSelector(state => state.user.currentUser?.currency);
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
                  : COLORS.PRIMARY.GREEN,
            },
          ]}>
          <Sapcer height={Dimensions.get('screen').height * 0.075} />
          <Text style={styles.amt}>
            {currencies[currency!].symbol ?? '$'} {trans.amount}
          </Text>
          <Text style={styles.desc}>{trans.desc ?? ''}</Text>
          <Text style={styles.time}>
            {weekData[trans.timeStamp.toDate().getDay()].label}{' '}
            {trans.timeStamp.toDate().getDate()}{' '}
            {monthData[trans.timeStamp.toDate().getMonth()].label}{' '}
            {trans.timeStamp.toDate().getFullYear()}{' '}
            {trans.timeStamp.toDate().getHours()}:
            {trans.timeStamp.toDate().getMinutes()}
          </Text>
        </SafeAreaView>
        <View style={styles.bottomView}>
          <View style={styles.ctr}>
            <View style={styles.ctrColumn}>
              <Text style={styles.text1}>Type</Text>
              <Text style={styles.text2}>
                {trans.type[0].toLocaleUpperCase() + trans.type.slice(1)}
              </Text>
            </View>
            <View style={styles.ctrColumn}>
              <Text style={styles.text1}>Category</Text>
              <Text style={styles.text2}>
                {(trans.category ?? '')[0].toLocaleUpperCase() +
                  (trans.category ?? '').slice(1)}
              </Text>
            </View>
            <View style={styles.ctrColumn}>
              <Text style={styles.text1}>Wallet</Text>
              <Text style={styles.text2}>
                {trans.wallet === undefined || trans.wallet === ''
                  ? ''
                  : trans.wallet[0].toLocaleUpperCase() + trans.wallet.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.descCtr}>
            <Text style={styles.descTitle}>Description</Text>
            <Text style={styles.descText}>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
              Exercitation veniam consequat sunt nostrud amet.
            </Text>
            {trans.attachementType !== 'none' && (
              <View>
                <Text style={styles.descTitle}>Attachement</Text>
                {trans.attachementType === 'image' ? (
                  <Image
                    source={{uri: trans.attachement}}
                    style={{width: '100%', height: 150, borderRadius: 8}}
                  />
                ) : (
                  <CustomButton
                    title="View Document"
                    onPress={() => {
                      navigation.navigate('DocView', {uri: trans.attachement!});
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
              title="Edit"
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
