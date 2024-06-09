import React from 'react';
import {Pressable, View} from 'react-native';
import {ICONS} from '../../../constants/icons';
import {Dropdown} from 'react-native-element-dropdown';
import styles from '../styles';
import {monthData, STRINGS} from '../../../constants/strings';
import {COLORS} from '../../../constants/commonStyles';

function FinancialReportHeader({
  month,
  setMonth,
  graph,
  setGraph,
  setType,
}: Readonly<{
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  graph: number;
  setGraph: React.Dispatch<React.SetStateAction<number>>;
  setType: React.Dispatch<React.SetStateAction<'transaction' | 'category'>>;
}>) {
  return (
    <View style={styles.monthRow}>
      <Dropdown
        style={styles.dropdown}
        renderLeftIcon={() => (
          <View style={{marginRight: 10}}>
            {ICONS.ArrowDown({width: 15, height: 15})}
          </View>
        )}
        renderRightIcon={() => <></>}
        placeholder={STRINGS.Month}
        value={monthData[month]}
        data={monthData}
        labelField={'label'}
        valueField={'value'}
        onChange={({value}) => {
          setMonth(value - 1);
        }}
      />
      <View style={styles.graphBtnCtr}>
        <Pressable
          style={[
            styles.graphBtn,
            {
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6,
              backgroundColor:
                graph === 0 ? COLORS.VIOLET[100] : COLORS.LIGHT[100],
            },
          ]}
          onPress={() => {
            setGraph(0);
            setType('transaction');
          }}>
          {ICONS.LineChart({
            height: 20,
            width: 20,
            color: graph === 0 ? COLORS.LIGHT[100] : COLORS.VIOLET[100],
          })}
        </Pressable>
        <Pressable
          style={[
            styles.graphBtn,
            {
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              backgroundColor:
                graph === 1 ? COLORS.VIOLET[100] : COLORS.LIGHT[100],
            },
          ]}
          onPress={() => {
            setGraph(1);
            setType('category');
          }}>
          {ICONS.Pie({
            height: 20,
            width: 20,
            color: graph === 1 ? COLORS.LIGHT[100] : COLORS.VIOLET[100],
          })}
        </Pressable>
      </View>
    </View>
  );
}

export default FinancialReportHeader;
