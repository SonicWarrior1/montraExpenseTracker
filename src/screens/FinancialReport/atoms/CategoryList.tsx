import React from 'react';
import {FlatList, Text, View} from 'react-native';
import Spacer from '../../../components/Spacer';
import {Bar} from 'react-native-progress';
import {COLORS} from '../../../constants/commonStyles';
import {currencies} from '../../../constants/strings';
import style from '../styles';
import {useAppTheme} from '../../../hooks/themeHook';
import {formatWithCommas} from '../../../utils/commonFuncs';

function CategoryList({
  spends,
  incomes,
  transType,
  catColors,
  currency,
  // conversion,
  totalSpend,
  totalIncome,
  sort,
}: Readonly<{
  spends:
    | never[]
    | {
        [category: string]: {
          [currency: string]: number;
        };
      }
    | undefined;
  incomes:
    | never[]
    | {
        [category: string]: {
          [currency: string]: number;
        };
      }
    | undefined;
  transType: 'income' | 'expense';
  catColors:
    | {
        [key: string]: string;
      }
    | undefined;
  currency: string | undefined;
  // conversion: {
  //   [key: string]: {
  //     [key: string]: number;
  //   };
  // };
  totalSpend: number;
  totalIncome: number;
  sort: boolean;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const listData = Object.entries(
    transType === 'expense' ? spends ?? {} : incomes ?? {},
  ).sort((a, b) => b[1].USD - a[1].USD);
  if (sort) {
    listData.reverse();
  }
  console.log('sdfklsdmnofkmo', listData);
  return (
    <FlatList
      style={{paddingHorizontal: 20}}
      data={listData}
      scrollEnabled={false}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={({item}) =>
        Number(item[1][currency?.toUpperCase() ?? 'USD']) ? (
          <View>
            <View style={styles.catRow}>
              <View style={styles.catCtr2}>
                <View
                  style={[
                    styles.colorBox,
                    {backgroundColor: catColors![item[0]]},
                  ]}
                />
                <Text style={styles.catText} numberOfLines={1}>
                  {item[0][0].toUpperCase() + item[0].slice(1)}
                </Text>
              </View>
              <Text
                style={[
                  styles.catAmt,
                  {
                    color:
                      transType === 'expense'
                        ? COLORS.RED[100]
                        : COLORS.GREEN[100],
                  },
                ]}>
                {transType === 'expense' ? '- ' : '+ '}
                {currencies[currency!].symbol}
                {formatWithCommas(
                  Number(
                    item[1][currency?.toUpperCase() ?? 'USD'].toFixed(2),
                  ).toString(),
                )}
              </Text>
            </View>
            <Spacer height={5} />
            <Bar
              progress={
                item[1].USD /
                (transType === 'expense'
                  ? Number(totalSpend)
                  : Number(totalIncome))
              }
              height={12}
              width={null}
              animated
              borderRadius={20}
              borderWidth={0}
              unfilledColor={COLOR.LIGHT[40]}
              color={catColors![item[0]]}
            />
            <Spacer height={20} />
          </View>
        ) : (
          <View />
        )
      }
    />
  );
}

export default CategoryList;

const ListEmptyComponent = () => {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Text style={styles.emptyText}>No Data for this Month</Text>
    </View>
  );
};
