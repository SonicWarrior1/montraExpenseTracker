import React, {useState} from 'react';
import {
  SafeAreaView,
  SectionList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import style from './styles';
import {ICONS} from '../../constants/icons';
import {useAppSelector} from '../../redux/store';
import {transactionType} from '../../defs/transaction';
import {COLORS} from '../../constants/commonStyles';
import TransactionHeader from '../../components/TransactionHeader';
import {TransactionScreenProps} from '../../defs/navigation';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
import {Timestamp} from '@react-native-firebase/firestore';
import TransactionItem from './atoms/TransactionItem';
import TabBackdrop from '../../components/TabBackdrop';
import {useQuery} from '@realm/react';
import { OnlineTransactionModel } from '../../DbModels/OnlineTransactionModel';
function TransactionScreen({navigation}: Readonly<TransactionScreenProps>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const scheme = useColorScheme();
  // redux
  // const transaction = useAppSelector(state => state.transaction.transactions);
  const dbData = useQuery(OnlineTransactionModel);
  const transaction=Array(...dbData);
  const [offset, setOffset] = useState<number>(0);
  const limit = 10;
  const filters = useAppSelector(state => state.transaction.filters);
  // state
  const [month, setMonth] = useState(new Date().getMonth());
  // functions
  function filterDataByDate(
    data: OnlineTransactionModel[],
    offset: number,
  ) {
    const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000;
    const startOfYesterday = startOfToday - 24 * 60 * 60;
    const res = data
      .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
      .slice(0, offset + limit)
      .filter(
        item =>
          Timestamp.fromMillis(item.timeStamp.seconds * 1000)
            .toDate()
            .getMonth() === month,
      )
      .reduce((acc: {[key: string]: Array<OnlineTransactionModel>}, item) => {
        const itemTime = item.timeStamp.seconds;
        if (itemTime >= startOfToday) {
          if (acc.today) {
            acc.today.push(item);
          } else {
            acc.today = [item];
          }
        } else if (itemTime >= startOfYesterday) {
          if (acc.yesterday) {
            acc.yesterday.push(item);
          } else {
            acc.yesterday = [item];
          }
        } else if (
          acc[
            Timestamp.fromMillis(item.timeStamp.seconds * 1000)
              .toDate()
              .toLocaleDateString()
          ]
        ) {
          acc[
            Timestamp.fromMillis(item.timeStamp.seconds * 1000)
              .toDate()
              .toLocaleDateString()
          ].push(item);
        } else {
          acc[
            Timestamp.fromMillis(item.timeStamp.seconds * 1000)
              .toDate()
              .toLocaleDateString()
          ] = [item];
        }
        return acc;
      }, {});

    const result = [
      {
        title: 'today',
        data:
          res.today === undefined
            ? []
            : [...res.today].sort(
                (a, b) => b.timeStamp.seconds - a.timeStamp.seconds,
              ) ?? [],
      },
      {
        title: 'yesterday',
        data:
          res.yesterday === undefined
            ? []
            : [...res.yesterday].sort(
                (a, b) => b.timeStamp.seconds - a.timeStamp.seconds,
              ) ?? [],
      },
    ];
    delete res.today;
    delete res.yesterday;
    const x = Object.entries(res).reduce(
      (acc: Array<{title: string; data: Array<OnlineTransactionModel>}>, curr) => {
        acc.push({
          title: curr[0],
          data: [...curr[1]].sort(
            (a, b) => b.timeStamp.seconds - a.timeStamp.seconds,
          ),
        });
        return acc;
      },
      [],
    );
    // x.reverse();
    return [...result, ...x];
  }

  function applyFilters(offset: number) {
    const data = filterDataByDate(transaction, offset);
    const catFiltered =
      filters.cat.length === 0
        ? data
        : data.map(data => {
            return {
              title: data.title,
              data: data.data.filter(item =>
                filters.cat.length === 0
                  ? true
                  : filters.cat.includes(item.category),
              ),
            };
          });
    const x =
      filters.filter === 'none'
        ? catFiltered
        : catFiltered.map(data => {
            return {
              title: data.title,
              data: data.data.filter(item => item.type === filters.filter),
            };
          });
    if (filters.sort === 'oldest') {
      return x.slice().reverse();
    } else if (filters.sort === 'lowest') {
      return [
        {
          title: '',
          data: Object.values(transaction)
            .slice()
            .sort((a, b) => a.amount - b.amount),
        },
      ];
    } else if (filters.sort === 'highest') {
      return [
        {
          title: '',
          data: Object.values(transaction)
            .slice()
            .sort((a, b) => b.amount - a.amount),
        },
      ];
    } else {
      return x;
    }
  }
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const finaltheme = theme === 'device' ? scheme : theme;
  return (
    <>
      <SafeAreaView
        style={[
          styles.safeView,
          {
            backgroundColor:
              finaltheme === 'dark' ? COLORS.DARK[75] : COLOR.LIGHT[100],
          },
        ]}>
        <TransactionHeader month={month} setMonth={setMonth} />
        <View style={styles.mainView}>
          {applyFilters(offset).length === 2 &&
          applyFilters(offset)[0].data.length === 0 &&
          applyFilters(offset)[1].data.length === 0 ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.emptyText}>{STRINGS.NoTransactions}</Text>
            </View>
          ) : (
            <SectionList
              ListHeaderComponent={
                <TouchableOpacity
                  style={styles.financialBtn}
                  onPress={() => {
                    navigation.navigate(NAVIGATION.Story);
                  }}>
                  <Text style={styles.financialText}>
                    {STRINGS.SeeFinancialReport}
                  </Text>
                  {ICONS.ArrowRight({
                    height: 30,
                    width: 25,
                    color: COLOR.VIOLET[100],
                    borderColor: COLOR.VIOLET[100],
                  })}
                </TouchableOpacity>
              }
              onEndReached={() => {
                console.log('OFFset', offset);
                if (offset + limit < Object.values(transaction).length) {
                  setOffset(offset => offset + 10);
                }
              }}
              style={{width: '100%'}}
              sections={applyFilters(offset)}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <TransactionItem
                  item={item}
                  navigation={navigation}
                  scheme={scheme}
                  theme={theme}
                  dateShow={
                    filters.sort === 'highest' || filters.sort === 'lowest'
                  }
                />
              )}
              renderSectionHeader={({section: {title, data}}) =>
                data.length === 0 || title === '' ? (
                  <View />
                ) : (
                  <Text style={styles.sectionHeader}>
                    {title !== 'today' && title !== 'yesterday'
                      ? title
                      : title[0].toUpperCase() + title.slice(1)}
                  </Text>
                )
              }
            />
          )}
        </View>
      </SafeAreaView>
      <TabBackdrop />
    </>
  );
}

export default TransactionScreen;
