import React, {useEffect, useState} from 'react';
import {Dimensions, Pressable, Text, useColorScheme, View} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {COLORS} from '../../../constants/commonStyles';
import {transactionType} from '../../../defs/transaction';
import style from '../styles';
import {STRINGS} from '../../../constants/strings';
import {useAppTheme} from '../../../hooks/themeHook';
import {useAppSelector} from '../../../redux/store';
import {Timestamp} from '@react-native-firebase/firestore';
import LinegraphLabel from '../../../components/LinegraphLabel';

function Graph({
  data,
  month,
}: Readonly<{
  data: {
    [key: string]: transactionType;
  };
  month: number;
}>) {
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const scheme = useColorScheme();
  const finalTheme = theme === 'device' ? scheme : theme;
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
          Timestamp.fromMillis(item.timeStamp.seconds * 1000)
            .toDate()
            .getMonth() === month && item.type === 'expense'
        );
      } else {
        return item.timeStamp.seconds >= startOfYear && item.type === 'expense';
      }
    })
    .sort((a, b) => a.timeStamp.seconds - b.timeStamp.seconds)
    .map(item => {
      return {
        value: item.amount,
        date:
          graphDay === 0
            ? Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                .toDate()
                .getHours() +
              ':' +
              (Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                .toDate()
                .getMinutes() < 10
                ? '0' +
                  Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                    .toDate()
                    .getMinutes()
                : Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                    .toDate()
                    .getMinutes())
            : Timestamp.fromMillis(item.timeStamp.seconds * 1000)
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
    });
  useEffect(() => {
    if (month !== new Date().getMonth()) {
      setGraphDay(2);
    }
  }, [month]);
  return (
    <>
      {graphData.length <= 1 ? (
        <View style={styles.emptyCtr}>
          <Text style={styles.emptyText}>{STRINGS.NotEnoughData}</Text>
        </View>
      ) : (
        <View style={{transform: [{translateX: -10}]}}>
          <LineChart
            height={180}
            data={graphData}
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
            disableScroll
            yAxisExtraHeight={30}
            pointerConfig={{
              pointerStripHeight: 220,
              pointerStripColor: 'lightgray',
              pointerStripWidth: 2,
              pointerColor: 'lightgray',
              pointerLabelWidth: 100,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (
                items: {date: string; value: number}[],
              ) => <LinegraphLabel items={items} />,
            }}
          />
        </View>
      )}
      <View style={styles.dayRow}>
        {month === new Date().getMonth() && (
          <Pressable
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  graphDay === 0
                    ? COLOR.YELLOW[20]
                    : finalTheme === 'light'
                    ? COLOR.LIGHT[100]
                    : COLOR.LIGHT[40],
                width:
                  month === new Date().getMonth()
                    ? Dimensions.get('screen').width / 4.2
                    : Dimensions.get('screen').width / 2.2,
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
        )}
        {month === new Date().getMonth() && (
          <Pressable
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  graphDay === 1
                    ? COLOR.YELLOW[20]
                    : finalTheme === 'light'
                    ? COLOR.LIGHT[100]
                    : COLOR.LIGHT[40],
                width:
                  month === new Date().getMonth()
                    ? Dimensions.get('screen').width / 4.2
                    : Dimensions.get('screen').width / 2.2,
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
        )}
        <Pressable
          style={[
            styles.filterBtn,
            {
              backgroundColor:
                graphDay === 2
                  ? COLOR.YELLOW[20]
                  : finalTheme === 'light'
                  ? COLOR.LIGHT[100]
                  : COLOR.LIGHT[40],
              width:
                month === new Date().getMonth()
                  ? Dimensions.get('screen').width / 4.2
                  : Dimensions.get('screen').width / 2.2,
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
                graphDay === 3
                  ? COLOR.YELLOW[20]
                  : finalTheme === 'light'
                  ? COLOR.LIGHT[100]
                  : COLOR.LIGHT[40],
              width:
                month === new Date().getMonth()
                  ? Dimensions.get('screen').width / 4.2
                  : Dimensions.get('screen').width / 2.2,
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
