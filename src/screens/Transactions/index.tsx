import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {ICONS} from '../../constants/icons';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {transactionType} from '../../defs/transaction';
import {COLORS} from '../../constants/commonStyles';
import {ScrollView} from 'react-native-gesture-handler';
import TransactionHeader from '../../components/TransactionHeader';
import {TransactionScreenProps} from '../../defs/navigation';
import {setTransaction} from '../../redux/reducers/transactionSlice';
function TransactionScreen({navigation}: Readonly<TransactionScreenProps>) {
  const user = useAppSelector(state => state.user.currentUser);
  const [data, setData] = useState<
    {
      title: string;
      data: Array<transactionType>;
    }[]
  >([]);
  const dispatch = useAppDispatch();
  const fetchData = useCallback(async () => {
    try {
      const res = await firestore()
        .collection('users')
        .doc(user?.uid)
        .collection('transactions')
        .orderBy('timeStamp', 'desc')
        .get();
      const data = res.docs.map(snapshot => snapshot.data() as transactionType);
      // dispatch(setTransaction(data));
      const filteredData = filterDataByDate(data);
      setData(filteredData);
    } catch (e) {
      console.log(e);
    }
  }, []);
  function filterDataByDate(data: transactionType[]) {
    const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000;
    const startOfYesterday = startOfToday - 24 * 60 * 60;

    const res = data.reduce(
      (acc: {[key: string]: Array<transactionType>}, item) => {
        const itemTime = item.timeStamp.seconds;
        if (itemTime >= startOfToday) {
          if (acc['today']) {
            acc['today'].push(item);
          } else {
            acc['today'] = [item];
          }
        } else if (itemTime >= startOfYesterday) {
          if (acc['yesterday']) {
            acc['yesterday'].push(item);
          } else {
            acc['yesterday'] = [item];
          }
        } else {
          if (acc[item.timeStamp.seconds]) {
            acc[item.timeStamp.seconds].push(item);
          } else {
            acc[item.timeStamp.seconds] = [item];
          }
        }
        return acc;
      },
      {},
    );
    const result = [
      {title: 'today', data: res['today'] ?? []},
      {title: 'yesterday', data: res['yesterday'] ?? []},
    ];
    delete res['today'];
    delete res['yesterday'];
    const arr = Object.entries(res);
    const x = arr.reduce(
      (acc: Array<{title: string; data: Array<transactionType>}>, curr) => {
        acc.push({title: curr[0], data: curr[1]});
        return acc;
      },
      [],
    );
    x.reverse();
    return [...result, ...x];
  }
  useEffect(() => {
    fetchData();
    const subscribe = firestore()
      .collection('users')
      .doc(user?.uid)
      .collection('transactions')
      .orderBy('timeStamp', 'desc')
      .onSnapshot(snapshot => {
        const filteredData = filterDataByDate(
          snapshot.docs.map(snapshot => snapshot.data() as transactionType),
        );
        setData(filteredData);
      });
    return () => subscribe();
  }, []);
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
      <TransactionHeader />
      <ScrollView>
        <View style={styles.mainView}>
          <TouchableOpacity style={styles.financialBtn} onPress={() => {}}>
            <Text style={styles.financialText}>See your financial report</Text>
            {ICONS.ArrowRight({height: 20, width: 20})}
          </TouchableOpacity>
          <SectionList
            scrollEnabled={false}
            style={{width: '100%'}}
            sections={applyFilters()}
            renderItem={({item}) => (
              <Pressable
                style={styles.listItemCtr}
                onPress={() => {
                  navigation.push('TransactionDetail', {transaction: item});
                }}>
                <View style={styles.icon}>
                  {ICONS.Camera({height: 30, width: 30})}
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
                    {item.type === 'expense' ? '-' : '+'} $ {item.amount}
                  </Text>
                  <Text style={styles.text2}>
                    {item.timeStamp.toDate().getHours()}:
                    {item.timeStamp.toDate().getMinutes() < 10
                      ? '0' + item.timeStamp.toDate().getMinutes()
                      : item.timeStamp.toDate().getMinutes()}
                  </Text>
                </View>
              </Pressable>
            )}
            renderSectionHeader={({section: {title, data}}) =>
              data.length === 0 ? (
                <View></View>
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
