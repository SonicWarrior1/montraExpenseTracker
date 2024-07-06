import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {COLORS} from '../../../constants/commonStyles';
import {LineChart} from 'react-native-gifted-charts';
import style from '../styles';
import {currencies} from '../../../constants/strings';
import {useAppTheme} from '../../../hooks/themeHook';
import {Timestamp} from '@react-native-firebase/firestore';
import LinegraphLabel from '../../../components/LinegraphLabel';
import {OnlineTransactionModel} from '../../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../../DbModels/OfflineTransactionModel';
import {formatWithCommas} from '../../../utils/commonFuncs';

function Linegraph({
  totalSpend,
  totalIncome,
  data,
  currency,
  transType,
  conversion,
  month,
}: Readonly<{
  totalSpend: number;
  totalIncome: number;
  data: (OnlineTransactionModel | OfflineTransactionModel)[];
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
        {formatWithCommas(
          Number(
            (
              conversion.usd?.[currency!.toLowerCase()] *
              Number(transType === 'expense' ? totalSpend : totalIncome)
            ).toFixed(2),
          ).toString(),
        )}
      </Text>
      <View style={styles.graphView}>
        {data
          .filter(
            item =>
              Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                .toDate()
                .getMonth() === month && item.type === transType,
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
            data={data
              .filter(
                item =>
                  Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                    .toDate()
                    .getMonth() === month && item.type === transType,
              )
              .sort((a, b) => a.timeStamp.seconds - b.timeStamp.seconds)
              .map(item => {
                return {
                  value: item.amount,
                  date:
                    Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                      .toDate()
                      .getDay() +
                    '/' +
                    Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                      .toDate()
                      .getMonth() +
                    '/' +
                    Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                      .toDate()
                      .getFullYear(),
                };
              })}
            areaChart
            adjustToWidth
            startFillColor1={COLORS.VIOLET[40]}
            endFillColor1={COLOR.LIGHT[100]}
            isAnimated={true}
            // initialSpacing={1}
            width={Dimensions.get('screen').width * 1.04}
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
            disableScroll
            yAxisExtraHeight={40}
            pointerConfig={{
              pointerStripHeight: 220,
              pointerStripColor: 'lightgray',
              pointerStripWidth: 2,
              pointerColor: 'lightgray',
              pointerLabelWidth: 100,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (items: {date: string; value: number}[]) =>
                LinegraphLabel({
                  items: items,
                  currency: currency,
                  conversion: conversion,
                  COLOR:COLOR,
                }),
            }}
          />
        )}
      </View>
    </>
  );
}

export default Linegraph;
