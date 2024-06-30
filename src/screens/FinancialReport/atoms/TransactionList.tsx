import {Timestamp} from '@react-native-firebase/firestore';
import React from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import style from '../styles';
import {currencies, STRINGS} from '../../../constants/strings';
import {COLORS} from '../../../constants/commonStyles';
import {catIcons, ICONS} from '../../../constants/icons';
import {useAppTheme} from '../../../hooks/themeHook';
import {OnlineTransactionModel} from '../../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../../DbModels/OfflineTransactionModel';
import {formatAMPM} from '../../../utils/firebase';
import {formatWithCommas} from '../../../utils/commonFuncs';

function TransactionList({
  data,
  transType,
  month,
  conversion,
  currency,
  sort,
  expenseOffset,
  incomeOffset,
  limit,
}: Readonly<{
  data: (OnlineTransactionModel | OfflineTransactionModel)[];
  transType: 'income' | 'expense';
  month: number;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string | undefined;
  sort: boolean;
  expenseOffset: number;
  incomeOffset: number;
  limit: number;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const listData = data
    .filter(
      item =>
        Timestamp.fromMillis(item.timeStamp.seconds * 1000)
          .toDate()
          .getMonth() === month && item.type === transType,
    )
    .sort((a, b) => b.amount - a.amount)
    .slice(
      0,
      transType === 'income' ? incomeOffset + limit : expenseOffset + limit,
    );
  if (sort) {
    listData.reverse();
  }

  return (
    <FlatList
      style={{paddingHorizontal: 20}}
      data={listData}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
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
              <Text style={styles.text1} numberOfLines={1}>
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
                {formatWithCommas(
                  Number(
                    (
                      conversion.usd[currency!.toLowerCase()] * item.amount
                    ).toFixed(1),
                  ).toString(),
                )}
              </Text>
              <Text style={styles.text2}>
                {Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                  .toDate()
                  .toLocaleDateString()}{' '}
                {formatAMPM(
                  Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate(),
                )}
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
      <Text style={styles.emptyText}>{STRINGS.NoTransactionsMonth}</Text>
    </View>
  );
};
