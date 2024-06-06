import React, {useState} from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {catIcons, ICONS} from '../../constants/icons';
import {Timestamp} from '@react-native-firebase/firestore';
import {useAppSelector} from '../../redux/store';
import {transactionType} from '../../defs/transaction';
import {COLORS} from '../../constants/commonStyles';
import {ScrollView} from 'react-native-gesture-handler';
import TransactionHeader from '../../components/TransactionHeader';
import {TransactionScreenProps} from '../../defs/navigation';
import {currencies, NAVIGATION} from '../../constants/strings';
function TransactionScreen({navigation}: Readonly<TransactionScreenProps>) {
  const [month, setMonth] = useState(new Date().getMonth());
  const user = useAppSelector(state => state.user.currentUser);
  const conversion = useAppSelector(state => state.transaction.conversion);
  const transaction = useAppSelector(state => state.transaction.transactions);
  function filterDataByDate(data: {[key: string]: transactionType}) {
    const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000;
    const startOfYesterday = startOfToday - 24 * 60 * 60;
    const res = Object.values(data)
      .filter(item => item.timeStamp.toDate().getMonth() === month)
      .reduce((acc: {[key: string]: Array<transactionType>}, item) => {
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
        } else if (acc[item.timeStamp.seconds]) {
          acc[item.timeStamp.seconds].push(item);
        } else {
          acc[item.timeStamp.seconds] = [item];
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
      (acc: Array<{title: string; data: Array<transactionType>}>, curr) => {
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
    x.reverse();
    return [...result, ...x];
  }

  const data = filterDataByDate(transaction);
  const filters = useAppSelector(state => state.transaction.filters);
  function applyFilters() {
    const x =
      filters.filter === 'none'
        ? data
        : data.map(data => {
            return {
              title: data.title,
              data: data.data.filter(item => item.type === filters.filter),
            };
          });
    if (filters.sort === 'oldest') {
      return x.slice().reverse();
    } else if (filters.sort === 'lowest') {
      return x.map(data => {
        return {
          title: data.title,
          data: data.data.slice().sort((a, b) => a.amount - b.amount),
        };
      });
    } else if (filters.sort === 'highest') {
      return x.map(data => {
        return {
          title: data.title,
          data: data.data.slice().sort((a, b) => b.amount - a.amount),
        };
      });
    } else {
      return x;
    }
  }
  return (
    <SafeAreaView style={styles.safeView}>
      <TransactionHeader month={month} setMonth={setMonth} />
      <ScrollView>
        <View style={styles.mainView}>
          <TouchableOpacity
            style={styles.financialBtn}
            onPress={() => {
              navigation.navigate(NAVIGATION.Story);
            }}>
            <Text style={styles.financialText}>See your financial report</Text>
            {ICONS.ArrowRight({height: 20, width: 20})}
          </TouchableOpacity>
          <SectionList
            scrollEnabled={false}
            style={{width: '100%'}}
            sections={applyFilters()}
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
                            conversion['usd'][
                              (user?.currency ?? 'USD').toLowerCase()
                            ] * item.amount
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
                    <Text style={styles.text1}>
                      {item.category[0].toLocaleUpperCase() +
                        item.category.slice(1)}
                    </Text>
                    <Text style={styles.text2}>{item.desc}</Text>
                  </View>
                  <View style={{alignItems: 'flex-end', rowGap: 5}}>
                    <Text
                      style={[
                        styles.text1,
                        {
                          fontWeight: '600',
                          color:
                            item.type === 'expense'
                              ? COLORS.PRIMARY.RED
                              : COLORS.PRIMARY.GREEN,
                        },
                      ]}>
                      {item.type === 'expense' ? '-' : '+'}{' '}
                      {currencies[user?.currency ?? 'USD'].symbol}{' '}
                      {(
                        conversion['usd'][
                          (user?.currency ?? 'USD').toLowerCase()
                        ] * item.amount
                      ).toFixed(2)}
                    </Text>
                    <Text style={styles.text2}>
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
            renderSectionHeader={({section: {title, data}}) =>
              data.length === 0 ? (
                <View />
              ) : (
                <Text style={styles.sectionHeader}>
                  {title !== 'today' && title !== 'yesterday'
                    ? Timestamp.fromMillis(Number(title) * 1000)
                        .toDate()
                        .getDate()
                        .toString() +
                      '/' +
                      (
                        Timestamp.fromMillis(Number(title) * 1000)
                          .toDate()
                          .getMonth() + 1
                      ).toString() +
                      '/' +
                      Timestamp.fromMillis(Number(title) * 1000)
                        .toDate()
                        .getFullYear()
                        .toString()
                    : title[0].toUpperCase() + title.slice(1)}
                </Text>
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TransactionScreen;
