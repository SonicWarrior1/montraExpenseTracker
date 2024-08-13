import React, {useState} from 'react';
import {
  Dimensions,
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
import {ICONS} from '../../constants/icons';
import {currencies, NAVIGATION, STRINGS} from '../../constants/strings';
import {COLORS} from '../../constants/commonStyles';
import {HomeScreenProps} from '../../defs/navigation';
import {useAppTheme} from '../../hooks/themeHook';
import HomeHeader from '../../components/HomeHeader';
import Graph from './atoms/graph';
// Third Party Libraries
import {Timestamp} from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import TabBackdrop from '../../components/TabBackdrop';
import {useQuery} from '@realm/react';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../DbModels/OfflineTransactionModel';
import {formatWithCommas} from '../../utils/commonFuncs';
import TransactionItem from '../../components/TransactionListItem/TransactionItem';
import {isTablet} from 'react-native-device-info';

function Home({navigation, route}: Readonly<HomeScreenProps>) {
  // state
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [expenseTip, setExpenseTip] = useState<boolean>(false);
  const [incomeTip, setIncomeTip] = useState<boolean>(false);
  // redux
  const conversion = useAppSelector(state => state.user.conversion);
  const currency =
    useAppSelector(state => state.user.currentUser?.currency) ?? 'USD';
  const spends = useAppSelector(
    state => state.user.currentUser?.spend?.[month],
  );
  const incomes = useAppSelector(
    state => state.user.currentUser?.income?.[month],
  );
  const onlineData = useQuery(OnlineTransactionModel);
  const offlineData = useQuery(OfflineTransactionModel);
  const data = [
    ...onlineData.filter(item => item.changed !== true),
    ...offlineData.filter(item => item.operation !== 'delete'),
  ];
  const listData = data
    .slice()
    .filter(item => {
      return (
        Timestamp.fromMillis(item.timeStamp.seconds * 1000)
          .toDate()
          ?.getMonth() === new Date().getMonth()
      );
    })
    .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
    .slice(0, 3);

  const theme = useAppSelector(state => state.user.currentUser?.theme);
  // constants
  const totalSpend = Object.values(spends ?? []).reduce((a, b) => {
    return a + (b?.[currency?.toUpperCase() ?? 'USD'] ?? 0);
  }, 0);
  const totalIncome = Object.values(incomes ?? []).reduce((a, b) => {
    return a + (b[currency?.toUpperCase() ?? 'USD'] ?? 0);
  }, 0);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const scheme = useColorScheme();
  const finalTheme = theme === 'device' ? scheme : theme;

  return (
    <>
      <ScrollView
        style={{
          backgroundColor:
            finalTheme === 'light' ? COLORS.LIGHT[100] : COLORS.DARK[75],
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            backgroundColor:
              finalTheme === 'light' ? COLORS.LIGHT[100] : COLORS.DARK[75],
          },
        ]}>
        <LinearGradient
          colors={
            finalTheme === 'light'
              ? ['#FFF6E5', '#F8EDD830']
              : ['#F8EDD860', '#23222030']
          }
          style={styles.gradient}>
          <SafeAreaView style={styles.safeView}>
            <HomeHeader
              props={{navigation, route}}
              setMonth={setMonth}
              month={month}
            />
            <Text style={styles.actText}>{STRINGS.AccountBalance}</Text>
            <Text style={styles.amt}>
              {currencies[currency ?? 'USD'].symbol}
              {isNaN(
                Number(
                  (
                    conversion.usd?.[(currency ?? 'USD').toLowerCase()] * 9400
                  ).toFixed(2),
                ),
              )
                ? 0
                : formatWithCommas(
                    (conversion.usd?.[(currency ?? 'USD').toLowerCase()] * 9400)
                      .toFixed(2)
                      .toString(),
                  )}
            </Text>
            <View style={styles.transRow}>
              <Pressable
                style={[styles.moneyCtr, {backgroundColor: COLORS.GREEN[100]}]}
                onLongPress={() => {
                  setIncomeTip(true);
                }}
                onPressOut={() => {
                  setIncomeTip(false);
                }}>
                {incomeTip && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tipText}>
                      {currencies[currency].symbol}
                      {isNaN(Number(Number(totalIncome).toFixed(2)))
                        ? 0
                        : formatWithCommas(totalIncome.toFixed(2).toString())}
                    </Text>
                  </View>
                )}
                <View style={styles.iconCtr}>
                  {ICONS.Income({
                    height: 25,
                    width: 25,
                    color: COLORS.GREEN[100],
                  })}
                </View>
                <View>
                  <Text style={styles.text1}>{STRINGS.Income}</Text>
                  <Text
                    style={[
                      styles.text2,
                      {
                        maxWidth:
                          Dimensions.get('screen').width /
                          (isTablet() ? 3 : 4),
                      },
                    ]}
                    numberOfLines={1}>
                    {currencies[currency].symbol}
                    {isNaN(Number(Number(totalIncome).toFixed(2)))
                      ? 0
                      : formatWithCommas(totalIncome.toFixed(2).toString())}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onLongPress={() => {
                  setExpenseTip(true);
                }}
                onPressOut={() => {
                  setExpenseTip(false);
                }}
                style={[styles.moneyCtr, {backgroundColor: COLORS.RED[100]}]}>
                {expenseTip && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tipText}>
                      {currencies[currency].symbol}
                      {isNaN(Number(Number(totalSpend).toFixed(2)))
                        ? 0
                        : formatWithCommas(totalSpend.toFixed(2).toString())}
                    </Text>
                  </View>
                )}
                <View style={styles.iconCtr}>
                  {ICONS.Expense({
                    height: 25,
                    width: 25,
                    color: COLORS.RED[100],
                  })}
                </View>
                <View>
                  <Text style={styles.text1}>{STRINGS.Expense}</Text>
                  <Text
                    style={[
                      styles.text2,
                      {
                        maxWidth:
                          Dimensions.get('screen').width /
                          (isTablet() ? 3 : 4),
                      },
                    ]}
                    numberOfLines={1}>
                    {currencies[currency].symbol}
                    {isNaN(Number(Number(totalSpend).toFixed(2)))
                      ? 0
                      : formatWithCommas(totalSpend.toFixed(2).toString())}
                  </Text>
                </View>
              </Pressable>
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
                    ?.getMonth() === new Date().getMonth()
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
            style={styles.paddingHorizontal}
            ListEmptyComponent={ListEmptyComponent}
            data={listData}
            scrollEnabled={false}
            renderItem={({item}) => (
              <TransactionItem
                key={item.id}
                item={item}
                navigation={navigation}
                scheme={scheme}
                theme={theme}
              />
            )}
          />
        </View>
      </ScrollView>
      <TabBackdrop />
    </>
  );
}

export default React.memo(Home);

function ListEmptyComponent() {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{STRINGS.NoRecentTransactions}</Text>
    </View>
  );
}
