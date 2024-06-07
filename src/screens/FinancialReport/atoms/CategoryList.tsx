import React from 'react';
import {FlatList, Text, View} from 'react-native';
import Sapcer from '../../../components/Spacer';
import {Bar} from 'react-native-progress';
import {COLORS} from '../../../constants/commonStyles';
import {currencies} from '../../../constants/strings';
import styles from '../styles';

function CategoryList({
  spends,
  incomes,
  transType,
  catColors,
  currency,
  conversion,
  totalSpend,
  totalIncome,
}: Readonly<{
  spends:
    | never[]
    | {
        [key: string]: number;
      };
  incomes:
    | never[]
    | {
        [key: string]: number;
      };
  transType: 'income' | 'expense';
  catColors:
    | {
        [key: string]: string;
      }
    | undefined;
  currency: string | undefined;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  totalSpend: string;
  totalIncome: string;
}>) {
  return (
    <FlatList
      style={{paddingHorizontal: 20}}
      data={Object.entries(transType === 'expense' ? spends : incomes)}
      renderItem={({item}) =>
        Number(item[1]) ? (
          <View>
            <View style={styles.catRow}>
              <View style={styles.catCtr2}>
                <View
                  style={[
                    styles.colorBox,
                    {backgroundColor: catColors![item[0]]},
                  ]}></View>
                <Text style={styles.catText}>
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
                {(conversion['usd']?.[currency!.toLowerCase()] * item[1])
                  .toFixed(2)
                  .toString()}
              </Text>
            </View>
            <Sapcer height={5} />
            <Bar
              progress={
                item[1] /
                (transType === 'expense'
                  ? Number(totalSpend)
                  : Number(totalIncome))
              }
              height={12}
              width={null}
              animated
              borderRadius={20}
              borderWidth={0}
              unfilledColor={COLORS.VIOLET[20]}
              color={catColors![item[0]]}
            />
            <Sapcer height={20} />
          </View>
        ) : (
          <View />
        )
      }
    />
  );
}

export default CategoryList;
