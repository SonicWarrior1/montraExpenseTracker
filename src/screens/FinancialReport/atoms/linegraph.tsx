import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {COLORS} from '../../../constants/commonStyles';
import {LineChart} from 'react-native-gifted-charts';
import style from '../styles';
import {currencies} from '../../../constants/strings';
import {transactionType} from '../../../defs/transaction';
import {useAppTheme} from '../../../hooks/themeHook';
import { Timestamp } from '@react-native-firebase/firestore';

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
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <>
      <Text style={styles.amt}>
        {currencies[currency!].symbol}
        {(
          conversion['usd']?.[currency!.toLowerCase()] *
          Number(transType === 'expense' ? totalSpend : totalIncome)
        )
          .toFixed(1)
          .toString()}
      </Text>
      <View style={styles.graphView}>
        {Object.values(data)
          .filter(
            item =>
              Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate().getMonth() === month &&
              item.type === transType,
          )
          .sort((a, b) => a.timeStamp.seconds - b.timeStamp.seconds)
          .map(item => {
            return {value: item.amount};
          }).length <= 1 ? (
          <View
            style={{
              height: 230,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.emptyText}>Not Enough Data</Text>
          </View>
        ) : (
          <LineChart
            data={Object.values(data)
              .filter(
                item =>
                  Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate().getMonth() === month &&
                  item.type === transType,
              )
              .sort((a, b) => a.timeStamp.seconds - b.timeStamp.seconds)
              .map(item => {
                return {value: item.amount};
              })}
            areaChart
            adjustToWidth
            startFillColor1={COLORS.VIOLET[40]}
            endFillColor1={COLOR.LIGHT[100]}
            isAnimated={true}
            initialSpacing={0}
            width={Dimensions.get('screen').width}
            hideDataPoints
            thickness={12}
            hideRules
            hideYAxisText
            hideAxesAndRules
            color={COLORS.VIOLET[100]}
            curveType={1}
            curved={true}
            overflowBottom={-1}
            onlyPositive
          />
        )}
      </View>
    </>
  );
}

export default Linegraph;
