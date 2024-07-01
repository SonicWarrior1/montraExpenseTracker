import {Timestamp} from '@react-native-firebase/firestore';
import React from 'react';
import {ColorSchemeName, FlatList, Text, View} from 'react-native';
import style from '../styles';
import {useAppTheme} from '../../../hooks/themeHook';
import {OnlineTransactionModel} from '../../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../../DbModels/OfflineTransactionModel';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../defs/navigation';
import {STRINGS} from '../../../constants/strings';
import TransactionItem from '../../../components/TransactionListItem/TransactionItem';

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
  scheme,
  theme,
  navigation,
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
  scheme: ColorSchemeName;
  theme: 'light' | 'dark' | 'device' | undefined;
  navigation: StackNavigationProp<
    RootStackParamList,
    'FinancialReport',
    undefined
  >;
}>) {
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
      renderItem={({item}) => (
        <TransactionItem
          item={item}
          navigation={navigation}
          scheme={scheme}
          theme={theme}
          dateShow={true}
          disabled={true}
        />
      )}
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
