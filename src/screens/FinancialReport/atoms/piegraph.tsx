import React from 'react';
import {Text, View} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import styles from '../styles';
import {currencies} from '../../../constants/strings';

function Piegraph({
  transType,
  spends,
  incomes,
  catColors,
  conversion,
  currency,
  totalSpend,
  totalIncome,
}: Readonly<{
  transType: 'income' | 'expense';
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
  function labelComponent() {
    return (
      <Text style={{fontSize: 32, fontWeight: '700'}}>
        {currencies[currency!].symbol}
        {(
          conversion['usd']?.[currency!.toLowerCase()] *
          Number(transType === 'expense' ? totalSpend : totalIncome)
        )
          .toFixed(2)
          .toString()}
      </Text>
    );
  }
  return (
    <View
      style={[
        styles.pieView,
        {
          flex:
            transType === 'expense'
              ? spends.length !== 0
                ? 0
                : 1
              : incomes.length !== 0
              ? 0
              : 1,
        },
      ]}>
      {(
        transType === 'expense'
          ? Number(totalSpend) !== 0
          : Number(totalIncome) !== 0
      ) ? (
        <PieChart
          donut
          innerRadius={100}
          isAnimated={true}
          centerLabelComponent={labelComponent}
          data={Object.entries(transType === 'expense' ? spends : incomes).map(
            item => {
              return {
                value: item[1],
                color: catColors![item[0]],
              };
            },
          )}
        />
      ) : (
        <View style={{height: 230, justifyContent: 'center'}}>
          <Text>No Data</Text>
        </View>
      )}
    </View>
  );
}

export default Piegraph;
