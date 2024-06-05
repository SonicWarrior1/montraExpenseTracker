import React, {useState} from 'react';
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
import {LineChart} from 'react-native-gifted-charts';
import {Timestamp} from '@react-native-firebase/firestore';
import HomeHeader from '../../components/HomeHeader';

function Home({navigation, route}: Readonly<HomeScreenProps>) {
  const screenHeight = Dimensions.get('screen').height;
  const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000;
  const startOfWeek = Math.floor(
    (new Date().setHours(0, 0, 0, 0) - new Date().getDay() * 86400000) / 1000,
  );
  const startOfYear = Math.floor(
    new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0) / 1000,
  );
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
  const [graphDay, setGraphDay] = useState(0);
  const data = useAppSelector(state => state.transaction.transactions);
  const graphData = Object.values(data)
    .filter(item => {
      if (graphDay === 0) {
        return (
          item.timeStamp.seconds >= startOfToday && item.type === 'expense'
        );
      } else if (graphDay === 1) {
        return item.timeStamp.seconds >= startOfWeek && item.type === 'expense';
      } else if (graphDay === 2) {
        return (
          item.timeStamp.toDate().getMonth() === month &&
          item.type === 'expense'
        );
      } else {
        return item.timeStamp.seconds >= startOfYear && item.type === 'expense';
      }
    })
    .sort((a, b) => a.timeStamp.seconds - b.timeStamp.seconds)
    .map(item => {
      return {value: item.amount};
    });
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
        {graphData.length <= 1 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.DARK[25],
                textAlign: 'center',
              }}>
              Not enough data
            </Text>
          </View>
        ) : (
          <View style={{transform: [{translateX: -10}]}}>
            <LineChart
              height={150}
              data={graphData}
              areaChart
              adjustToWidth
              startFillColor1={COLORS.VIOLET[40]}
              isAnimated={true}
              initialSpacing={0}
              width={Dimensions.get('screen').width}
              hideDataPoints
              thickness={8}
              hideRules
              hideYAxisText
              hideAxesAndRules
              color={COLORS.VIOLET[100]}
              curveType={0}
              curved={true}
            />
          </View>
        )}
        <View style={styles.dayRow}>
          <Pressable
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  graphDay === 0 ? COLORS.YELLOW[20] : COLORS.LIGHT[100],
              },
            ]}
            onPress={() => {
              setGraphDay(0);
            }}>
            <Text
              style={[
                styles.filterBtnText,
                {
                  color: graphDay === 0 ? COLORS.YELLOW[100] : COLORS.DARK[25],
                  fontWeight: graphDay === 0 ? '700' : '500',
                },
              ]}>
              Today
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  graphDay === 1 ? COLORS.YELLOW[20] : COLORS.LIGHT[100],
              },
            ]}
            onPress={() => {
              setGraphDay(1);
            }}>
            <Text
              style={[
                styles.filterBtnText,
                {
                  color: graphDay === 1 ? COLORS.YELLOW[100] : COLORS.DARK[25],
                  fontWeight: graphDay === 1 ? '700' : '500',
                },
              ]}>
              Week
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  graphDay === 2 ? COLORS.YELLOW[20] : COLORS.LIGHT[100],
              },
            ]}
            onPress={() => {
              setGraphDay(2);
            }}>
            <Text
              style={[
                styles.filterBtnText,
                {
                  color: graphDay === 2 ? COLORS.YELLOW[100] : COLORS.DARK[25],
                  fontWeight: graphDay === 2 ? '700' : '500',
                },
              ]}>
              Month
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  graphDay === 3 ? COLORS.YELLOW[20] : COLORS.LIGHT[100],
              },
            ]}
            onPress={() => {
              setGraphDay(3);
            }}>
            <Text
              style={[
                styles.filterBtnText,
                {
                  color: graphDay === 3 ? COLORS.YELLOW[100] : COLORS.DARK[25],
                  fontWeight: graphDay === 3 ? '700' : '500',
                },
              ]}>
              Year
            </Text>
          </Pressable>
        </View>
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
            .filter(item => item.timeStamp.toDate().getMonth() === month)
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
