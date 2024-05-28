import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {ICONS} from '../../constants/icons';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import {useAppSelector} from '../../redux/store';
import {transactionType} from '../../defs/transaction';
function TransactionScreen() {
  const user = useAppSelector(state => state.user.currentUser);
  const [data, setData] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const res = await firestore()
        .collection('users')
        .doc(user?.uid)
        .collection('transactions')
        .orderBy('timeStamp', 'desc')
        .get();
      const data = res.docs.map(snapshot => snapshot.data() as transactionType);
      const filteredData = filterDataByDate(data);
      setData(filteredData);
      //   console.log(filteredData);
      //   console.log(data[0].timeStamp.toDate());
    } catch (e) {
      console.log(e);
    }
  }, []);
  function filterDataByDate(data: transactionType[]) {
    const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000; // Start of today in seconds
    const startOfYesterday = startOfToday - 24 * 60 * 60; // Start of yesterday in milliseconds

    const res = data.reduce((acc, item) => {
      const itemTime = item.timeStamp.seconds;
      if (itemTime >= startOfToday) {
        // console.log('today', item);
        if (acc['today']) {
          acc['today'].push(item);
        } else {
          acc['today'] = [item];
        }
      } else if (itemTime >= startOfYesterday) {
        // console.log('yesterday', item);
        if (acc['yesterday']) {
          acc['yesterday'].push(item);
        } else {
          acc['yesterday'] = [item];
        }
      } else {
        // console.log('yesterday', item);
        if (acc[item.timeStamp.seconds]) {
          acc[item.timeStamp.seconds] = acc[item.timeStamp.seconds].push(item);
        } else {
          acc[item.timeStamp.seconds] = [item];
        }
      }
      return acc;
    }, {});
    const arr = Object.entries(res);
    const result = arr.reduce((acc, curr) => {
      acc.push({title: curr[0], data: curr[1]});
      return acc;
    }, []);
    console.log(result);
    return result;
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainView}>
        <TouchableOpacity style={styles.financialBtn} onPress={() => {}}>
          <Text style={styles.financialText}>See your financial report</Text>
          {ICONS.ArrowRight({height: 20, width: 20})}
        </TouchableOpacity>
        <SectionList
          sections={data}
          renderItem={({item}) => <Text>{item.amount}</Text>}
          renderSectionHeader={({section: {title}}) => (
            <Text>
              {title !== 'today' && title !== 'yesterday'
                ? Timestamp.fromMillis(title * 1000)
                    .toDate()
                    .toLocaleDateString()
                : title}
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default TransactionScreen;
