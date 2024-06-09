import React, {useState} from 'react';
import {Dimensions, Pressable, Text, View} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {COLORS} from '../../../constants/commonStyles';
import {transactionType} from '../../../defs/transaction';
import styles from '../styles';
import { STRINGS } from '../../../constants/strings';

function Graph({
  data,
  month,
}: Readonly<{
  data: {
    [key: string]: transactionType;
  };
  month: number;
}>) {
  const [graphDay, setGraphDay] = useState(0);
  const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000;
  const startOfWeek = Math.floor(
    (new Date().setHours(0, 0, 0, 0) - new Date().getDay() * 86400000) / 1000,
  );
  const startOfYear = Math.floor(
    new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0) / 1000,
  );
  const graphData = Object.values(data)
    .filter(item => {
      if (graphDay === 0) {
        return (
          item.timeStamp.seconds >= startOfToday && item.type === 'expense'
        );
      } else if (graphDay === 1) {
        return item.timeStamp.seconds >= startOfWeek && item.type === 'expense';
      } else if (graphDay === 2) {
        return (
          item.timeStamp.toDate().getMonth() === month &&
          item.type === 'expense'
        );
      } else {
        return item.timeStamp.seconds >= startOfYear && item.type === 'expense';
      }
    })
    .sort((a, b) => a.timeStamp.seconds - b.timeStamp.seconds)
    .map(item => {
      return {value: item.amount};
    });
  return (
    <>
      {graphData.length <= 1 ? (
        <View
          style={styles.emptyCtr}>
          <Text
            style={styles.emptyText}>
            {STRINGS.NotEnoughData}
          </Text>
        </View>
      ) : (
        <View style={{transform: [{translateX: -10}]}}>
          <LineChart
            height={150}
            data={graphData}
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
      )}
      <View style={styles.dayRow}>
        <Pressable
          style={[
            styles.filterBtn,
            {
              backgroundColor:
                graphDay === 0 ? COLORS.YELLOW[20] : COLORS.LIGHT[100],
            },
          ]}
          onPress={() => {
            setGraphDay(0);
          }}>
          <Text
            style={[
              styles.filterBtnText,
              {
                color: graphDay === 0 ? COLORS.YELLOW[100] : COLORS.DARK[25],
                fontWeight: graphDay === 0 ? '700' : '500',
              },
            ]}>
            {STRINGS.Today}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterBtn,
            {
              backgroundColor:
                graphDay === 1 ? COLORS.YELLOW[20] : COLORS.LIGHT[100],
            },
          ]}
          onPress={() => {
            setGraphDay(1);
          }}>
          <Text
            style={[
              styles.filterBtnText,
              {
                color: graphDay === 1 ? COLORS.YELLOW[100] : COLORS.DARK[25],
                fontWeight: graphDay === 1 ? '700' : '500',
              },
            ]}>
            {STRINGS.Week}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterBtn,
            {
              backgroundColor:
                graphDay === 2 ? COLORS.YELLOW[20] : COLORS.LIGHT[100],
            },
          ]}
          onPress={() => {
            setGraphDay(2);
          }}>
          <Text
            style={[
              styles.filterBtnText,
              {
                color: graphDay === 2 ? COLORS.YELLOW[100] : COLORS.DARK[25],
                fontWeight: graphDay === 2 ? '700' : '500',
              },
            ]}>
            {STRINGS.Month}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterBtn,
            {
              backgroundColor:
                graphDay === 3 ? COLORS.YELLOW[20] : COLORS.LIGHT[100],
            },
          ]}
          onPress={() => {
            setGraphDay(3);
          }}>
          <Text
            style={[
              styles.filterBtnText,
              {
                color: graphDay === 3 ? COLORS.YELLOW[100] : COLORS.DARK[25],
                fontWeight: graphDay === 3 ? '700' : '500',
              },
            ]}>
            {STRINGS.Year}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

export default Graph;
