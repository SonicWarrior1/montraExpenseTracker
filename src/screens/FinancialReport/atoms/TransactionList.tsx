import {Timestamp} from '@react-native-firebase/firestore';
import React from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import styles from '../styles';
import {currencies} from '../../../constants/strings';
import {COLORS} from '../../../constants/commonStyles';
import {catIcons, ICONS} from '../../../constants/icons';
import { transactionType } from '../../../defs/transaction';

function TransactionList({
  data,
  transType,
  month,
  conversion,
  currency,
}: Readonly<{
  data: {
    [key: string]: transactionType;
  };
  transType: 'income' | 'expense';
  month: number;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string | undefined;
}>) {
  return (
    <FlatList
      style={{paddingHorizontal: 20}}
      data={Object.values(data)
        .filter(
          item =>
            item.timeStamp.toDate().getMonth() === month &&
            item.type === transType,
        )
        .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
        .slice(0, 4)}
      renderItem={({item}) => {
        return (
          <Pressable
            style={styles.listItemCtr}
            onPress={() => {
              // navigation.push('TransactionDetail', {
              //   transaction: {
              //     ...item,
              //     amount: Number(
              //       (
              //         conversion['usd'][currency!.toLowerCase()] *
              //         item.amount
              //       ).toFixed(2),
              //     ),
              //   },
              // });
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
                {item.category[0].toLocaleUpperCase() + item.category.slice(1)}
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
                {currencies[currency!].symbol}{' '}
                {(
                  conversion['usd'][currency!.toLowerCase()] * item.amount
                ).toFixed(2)}
              </Text>
              <Text style={styles.text2}>
                {Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                  .toDate()
                  .toLocaleDateString()}{' '}
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
  );
}

export default TransactionList;
