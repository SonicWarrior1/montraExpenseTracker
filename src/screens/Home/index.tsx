import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import style from './styles';
import {useAppSelector} from '../../redux/store';
import {catIcons, ICONS} from '../../constants/icons';
import {currencies, NAVIGATION, STRINGS} from '../../constants/strings';
import {COLORS} from '../../constants/commonStyles';
import {HomeScreenProps} from '../../defs/navigation';
import {useAppTheme} from '../../hooks/themeHook';
import HomeHeader from '../../components/HomeHeader';
import Graph from './atoms/graph';
// Third Party Libraries
import {Timestamp} from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

function Home({navigation, route}: Readonly<HomeScreenProps>) {
  const [month, setMonth] = useState(new Date().getMonth());
  // redux
  const conversion = useAppSelector(state => state.transaction.conversion);
  const currency =
    useAppSelector(state => state.user.currentUser?.currency) ?? 'USD';
  const spends = useAppSelector(
    state => state.user.currentUser?.spend?.[month],
  );
  const incomes = useAppSelector(
    state => state.user.currentUser?.income?.[month],
  );
  const data = useAppSelector(state => state.transaction.transactions);
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  // constants
  const totalSpend = Object.values(spends ?? [])
    .reduce((a, b) => a + b, 0)
    .toFixed(1);
  const totalIncome = Object.values(incomes ?? [])
    .reduce((a, b) => a + b, 0)
    .toFixed(1);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const scheme = useColorScheme();

  return (
    <ScrollView
      style={{
        backgroundColor:
          (theme === 'device' ? scheme : theme) === 'light'
            ? COLORS.LIGHT[100]
            : COLORS.DARK[75],
      }}
      contentContainerStyle={[
        {
          backgroundColor:
            (theme === 'device' ? scheme : theme) === 'light'
              ? COLORS.LIGHT[100]
              : COLORS.DARK[75],
        },
      ]}>
      <LinearGradient
        colors={
          (theme === 'device' ? scheme : theme) === 'light'
            ? ['#FFF6E5', '#F8EDD830']
            : ['#F8EDD860', '#23222030']
        }
        style={styles.gradient}>
        <SafeAreaView style={styles.safeView}>
          <HomeHeader props={{navigation, route}} setMonth={setMonth} />
          <Text style={styles.actText}>Account Balance</Text>
          <Text style={styles.amt}>
            {currencies[currency ?? 'USD'].symbol}
            {isNaN(
              Number(
                (
                  conversion.usd?.[(currency ?? 'USD').toLowerCase()] * 9400
                ).toFixed(1),
              ),
            )
              ? 0
              : (conversion.usd?.[(currency ?? 'USD').toLowerCase()] * 9400)
                  .toFixed(1)
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
                <Text style={styles.text2} numberOfLines={1}>
                  {currencies[currency].symbol}
                  {isNaN(
                    Number(
                      (
                        conversion.usd?.[currency.toLowerCase()] *
                        Number(totalIncome)
                      ).toFixed(1),
                    ),
                  )
                    ? 0
                    : (
                        conversion.usd?.[currency.toLowerCase()] *
                        Number(totalIncome)
                      )
                        .toFixed(1)
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
                <Text style={styles.text2} numberOfLines={1}>
                  {currencies[currency].symbol}
                  {isNaN(
                    Number(
                      (
                        conversion.usd?.[currency.toLowerCase()] *
                        Number(totalSpend)
                      ).toFixed(1),
                    ),
                  )
                    ? 0
                    : (
                        conversion.usd?.[currency.toLowerCase()] *
                        Number(totalSpend)
                      )
                        .toFixed(1)
                        .toString()}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <View>
        <Text style={styles.graphTitle}>{STRINGS.SpendFrequency}</Text>
        <Graph data={data} month={month} />
        <View style={styles.flexRow}>
          <Text style={styles.text3}>{STRINGS.RecentTransaction}</Text>
          {Object.values(data)
            .filter(item => {
              return (
                Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                  .toDate()
                  ?.getMonth() === month
              );
            })
            .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
            .slice(0, 3).length !== 0 && (
            <Pressable
              style={styles.editBtn}
              onPress={() => {
                navigation.navigate(NAVIGATION.Transaction);
              }}>
              <Text style={styles.editBtnText}>{STRINGS.SeeAll}</Text>
            </Pressable>
          )}
        </View>

        <FlatList
          style={{paddingHorizontal: 20}}
          ListEmptyComponent={() => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.emptyText}> No Recent Transactions</Text>
            </View>
          )}
          data={Object.values(data)
            .filter(item => {
              return (
                Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                  .toDate()
                  ?.getMonth() === month
              );
            })
            .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
            .slice(0, 3)}
          scrollEnabled={false}
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
                          conversion.usd[currency.toLowerCase()] * item.amount
                        ).toFixed(1),
                      ),
                    },
                  });
                }}>
                <View
                  style={[
                    styles.icon,
                    {
                      backgroundColor:
                        item.type === 'transfer'
                          ? COLORS.BLUE[80]
                          : catIcons[item.category]?.color ?? COLORS.LIGHT[20],
                    },
                  ]}>
                  {item.type === 'transfer'
                    ? ICONS.Transfer({height: 30, width: 30})
                    : catIcons[item.category]?.icon({
                        height: 30,
                        width: 30,
                      }) ?? ICONS.Money({height: 30, width: 30})}
                </View>
                <View style={styles.catCtr}>
                  <Text style={styles.listtext1}>
                    {item.type === 'transfer'
                      ? item.from + ' - ' + item.to
                      : item.category[0].toLocaleUpperCase() +
                        item.category.slice(1)}
                  </Text>
                  <Text style={styles.listtext2} numberOfLines={1}>
                    {item.desc}
                  </Text>
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
                            : item.type === 'income'
                            ? COLORS.PRIMARY.GREEN
                            : COLORS.PRIMARY.BLUE,
                      },
                    ]}>
                    {item.type === 'expense'
                      ? '-'
                      : item.type === 'income'
                      ? '+'
                      : ''}{' '}
                    {currencies[currency].symbol}{' '}
                    {(
                      (conversion?.usd?.[currency.toLowerCase()] ?? 1) *
                      item.amount
                    ).toFixed(1)}
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
    </ScrollView>
  );
}

export default Home;
