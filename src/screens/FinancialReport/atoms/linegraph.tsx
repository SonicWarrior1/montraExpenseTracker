import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {COLORS} from '../../../constants/commonStyles';
import {LineChart} from 'react-native-gifted-charts';
import styles from '../styles';
import {currencies} from '../../../constants/strings';
import {transactionType} from '../../../defs/transaction';

function Linegraph({
  totalSpend,
  totalIncome,
  data,
  currency,
  transType,
  conversion,
  month,
}: Readonly<{
  totalSpend: string;
  totalIncome: string;
  data: {
    [key: string]: transactionType;
  };
  currency: string | undefined;
  transType: 'income' | 'expense';
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  month: number;
}>) {
  return (
    <>
      <Text style={styles.amt}>
        {currencies[currency!].symbol}
        {(
          conversion['usd']?.[currency!.toLowerCase()] *
          Number(transType === 'expense' ? totalSpend : totalIncome)
        )
          .toFixed(2)
          .toString()}
      </Text>
      <View style={styles.graphView}>
        <LineChart
          data={Object.values(data)
            .filter(
              item =>
                item.timeStamp.toDate().getMonth() === month &&
                item.type === transType,
            )
            .sort((a, b) => a.timeStamp.seconds - b.timeStamp.seconds)
            .map(item => {
              return {value: item.amount};
            })}
          areaChart
          adjustToWidth
          startFillColor1={COLORS.VIOLET[40]}
          isAnimated={true}
          initialSpacing={0}
          width={Dimensions.get('screen').width}
          hideDataPoints
          thickness={8}
          hideRules
          hideYAxisText
          hideAxesAndRules
          color={COLORS.VIOLET[100]}
          curveType={0}
          curved={true}
        />
      </View>
    </>
  );
}

export default Linegraph;
