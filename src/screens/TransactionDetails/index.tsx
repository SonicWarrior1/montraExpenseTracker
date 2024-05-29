import React from 'react';
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
import {monthData, NAVIGATION, weekData} from '../../constants/strings';
import Sapcer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';

function TransactionDetails({route, navigation}: TransactionDetailScreenProps) {
  const trans = route.params.transaction;
  console.log();
  navigation.setOptions({
    headerRight: props => {
      return (
        <Pressable onPress={() => {}}>
          {ICONS.Trash({height: 20, width: 20})}
        </Pressable>
      );
    },
  });
  return (
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
        <Text style={styles.amt}>${trans.amount}</Text>
        <Text style={styles.desc}>{trans.desc}</Text>
        <Text style={styles.time}>
          {weekData[trans.timeStamp.toDate().getDay()].label}{' '}
          {trans.timeStamp.toDate().getDate()}{' '}
          {monthData[trans.timeStamp.toDate().getMonth()].label}{' '}
          {trans.timeStamp.toDate().getFullYear()}{' '}
          {trans.timeStamp.toDate().getHours()}:
          {trans.timeStamp.toDate().getMinutes()}
        </Text>
      </SafeAreaView>
      <View
        style={{
          flex: 2,
          backgroundColor: 'white',
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            columnGap: 50,
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.LIGHT[20],
            transform: [{translateY: -40}],
          }}>
          <View style={{alignItems: 'center', rowGap: 8}}>
            <Text style={styles.text1}>Type</Text>
            <Text style={styles.text2}>
              {trans.type[0].toLocaleUpperCase() + trans.type.slice(1)}
            </Text>
          </View>
          <View style={{alignItems: 'center', rowGap: 8}}>
            <Text style={styles.text1}>Category</Text>
            <Text style={styles.text2}>
              {trans.category[0].toLocaleUpperCase() + trans.category.slice(1)}
            </Text>
          </View>
          <View style={{alignItems: 'center', rowGap: 8}}>
            <Text style={styles.text1}>Wallet</Text>
            <Text style={styles.text2}>
              {trans.wallet[0].toLocaleUpperCase() + trans.wallet.slice(1)}
            </Text>
          </View>
        </View>
        <View style={{flex: 1, transform: [{translateY: -20}]}}>
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.descText}>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt nostrud amet.
          </Text>
          <Text style={styles.descTitle}>Attachement</Text>
          <Image
            source={{uri: trans.attachement}}
            style={{width: '100%', height: 150, borderRadius: 8}}
          />
        </View>
        <View style={{transform: [{translateY: -40}]}}>
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
    </View>
  );
}


export default TransactionDetails;
