import React from 'react';
import {Text, View} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import style from '../styles';
import {currencies, STRINGS} from '../../../constants/strings';
import {useAppTheme} from '../../../hooks/themeHook';

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
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  function labelComponent() {
    return (
      <Text style={styles.pieCenterText}>
        {currencies[currency!].symbol}
        {(
          conversion.usd?.[currency!.toLowerCase()] *
          Number(transType === 'expense' ? totalSpend : totalIncome)
        )
          .toFixed(1)
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
          innerCircleColor={COLOR.LIGHT[100]}
          data={Object.entries(transType === 'expense' ? spends : incomes)
            .sort((a, b) => b[1] - a[1])
            .map(item => {
              return {
                value: item[1],
                color: catColors![item[0]],
              };
            })}
        />
      ) : (
        <View style={styles.noDataCtr}>
          <Text style={styles.emptyText}>{STRINGS.NoData}</Text>
        </View>
      )}
    </View>
  );
}

export default Piegraph;
