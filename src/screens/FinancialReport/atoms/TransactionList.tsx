import {Timestamp} from '@react-native-firebase/firestore';
import React from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import style from '../styles';
import {currencies} from '../../../constants/strings';
import {COLORS} from '../../../constants/commonStyles';
import {catIcons, ICONS} from '../../../constants/icons';
import {transactionType} from '../../../defs/transaction';
import {useAppTheme} from '../../../hooks/themeHook';

function TransactionList({
  data,
  transType,
  month,
  conversion,
  currency,
  sort,
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
  sort: boolean;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const listData = Object.values(data)
    .filter(
      item =>
        Timestamp.fromMillis(item.timeStamp.seconds * 1000)
          .toDate()
          .getMonth() === month && item.type === transType,
    )
    .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
    .slice(0, 4);
  if (sort) {
    listData.reverse();
  }

  return (
    <FlatList
      style={{paddingHorizontal: 20}}
      data={listData}
      scrollEnabled={false}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={({item}) => {
        return (
          <Pressable style={styles.listItemCtr}>
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
              <Text style={styles.text2} numberOfLines={1}>
                {item.desc}
              </Text>
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
                ).toFixed(1)}
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

const ListEmptyComponent = () => {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Text style={styles.emptyText}>No Transactions for this Month</Text>
    </View>
  );
};