import React from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {useAppSelector} from '../../redux/store';
import LinearGradient from 'react-native-linear-gradient';
import {catIcons, ICONS} from '../../constants/icons';
import {currencies, NAVIGATION} from '../../constants/strings';
import styles from './styles';
import {COLORS} from '../../constants/commonStyles';
import {HomeScreenProps} from '../../defs/navigation';
import {Timestamp} from '@react-native-firebase/firestore';
import HomeHeader from '../../components/HomeHeader';
import Graph from './atoms/graph';

function Home({navigation, route}: Readonly<HomeScreenProps>) {
  
  const screenHeight = Dimensions.get('screen').height;
  const conversion = useAppSelector(state => state.transaction.conversion);
  const currency =
    useAppSelector(state => state.user.currentUser?.currency) ?? 'USD';
  const month = new Date().getMonth();
  const spends = useAppSelector(
    state => state.user.currentUser?.spend?.[month],
  );
  const totalSpend = Object.values(spends ?? [])
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
  const incomes = useAppSelector(
    state => state.user.currentUser?.income?.[month],
  );
  const totalIncome = Object.values(incomes ?? [])
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
  const data = useAppSelector(state => state.transaction.transactions);

  return (
    <View style={styles.mainView}>
      <LinearGradient colors={['#FFF6E5', '#F8EDD830']} style={styles.gradient}>
        <SafeAreaView style={styles.safeView}>
          <HomeHeader navigation={navigation} route={route} />
          <Text style={styles.actText}>Account Balance</Text>
          <Text style={styles.amt}>
            {currencies[currency ?? 'USD'].symbol}
            {(conversion['usd']?.[(currency ?? 'USD').toLowerCase()] * 9400)
              .toFixed(2)
              .toString()}
          </Text>
          <View style={styles.transRow}>
            <View
              style={[styles.moneyCtr, {backgroundColor: COLORS.GREEN[100]}]}>
              <View style={styles.iconCtr}>
                {ICONS.Income({
                  height: 25,
                  width: 25,
                  color: COLORS.GREEN[100],
                })}
              </View>
              <View>
                <Text style={styles.text1}>Income</Text>
                <Text style={styles.text2}>
                  {currencies[currency].symbol}
                  {(
                    conversion['usd']?.[currency.toLowerCase()] *
                    Number(totalIncome)
                  )
                    .toFixed(2)
                    .toString()}
                </Text>
              </View>
            </View>
            <View style={[styles.moneyCtr, {backgroundColor: COLORS.RED[100]}]}>
              <View style={styles.iconCtr}>
                {ICONS.Expense({
                  height: 25,
                  width: 25,
                  color: COLORS.RED[100],
                })}
              </View>
              <View>
                <Text style={styles.text1}>Expense</Text>
                <Text style={styles.text2}>
                  {currencies[currency].symbol}
                  {(
                    conversion['usd']?.[currency.toLowerCase()] *
                    Number(totalSpend)
                  )
                    .toFixed(2)
                    .toString()}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <View style={{flex: screenHeight / 490}}>
        <Text style={styles.graphTitle}>Spend Frequency</Text>
        <Graph data={data} month={month} />
        <View style={styles.flexRow}>
          <Text style={styles.text3}>Recent Transaction</Text>
          <Pressable
            style={styles.editBtn}
            onPress={() => {
              navigation.navigate(NAVIGATION.Transaction);
            }}>
            <Text style={styles.editBtnText}>See all</Text>
          </Pressable>
        </View>

        <FlatList
          style={{paddingHorizontal: 20}}
          data={Object.values(data)
            .filter(item => {
              return (
                Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                  .toDate()
                  ?.getMonth() === month
              );
            })
            .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
            .slice(0, 2)}
          renderItem={({item}) => {
            return (
              <Pressable
                style={styles.listItemCtr}
                onPress={() => {
                  navigation.push('TransactionDetail', {
                    transaction: {
                      ...item,
                      amount: Number(
                        (
                          conversion['usd'][currency.toLowerCase()] *
                          item.amount
                        ).toFixed(2),
                      ),
                    },
                  });
                }}>
                <View
                  style={[
                    styles.icon,
                    {
                      backgroundColor:
                        catIcons[item.category]?.color ?? COLORS.LIGHT[20],
                    },
                  ]}>
                  {catIcons[item.category]?.icon({height: 30, width: 30}) ??
                    ICONS.Money({height: 30, width: 30})}
                </View>
                <View style={styles.catCtr}>
                  <Text style={styles.listtext1}>
                    {item.category[0].toLocaleUpperCase() +
                      item.category.slice(1)}
                  </Text>
                  <Text style={styles.listtext2}>{item.desc}</Text>
                </View>
                <View style={styles.column}>
                  <Text
                    style={[
                      styles.listtext1,
                      {
                        fontWeight: '600',
                        color:
                          item.type === 'expense'
                            ? COLORS.PRIMARY.RED
                            : COLORS.PRIMARY.GREEN,
                      },
                    ]}>
                    {item.type === 'expense' ? '-' : '+'}{' '}
                    {currencies[currency].symbol}{' '}
                    {(
                      conversion['usd'][currency.toLowerCase()] * item.amount
                    ).toFixed(2)}
                  </Text>
                  <Text style={styles.listtext2}>
                    {Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                      .toDate()
                      .getHours()}
                    :
                    {Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                      .toDate()
                      .getMinutes() < 10
                      ? '0' +
                        Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                          .toDate()
                          .getMinutes()
                      : Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                          .toDate()
                          .getMinutes()}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
}

export default Home;
