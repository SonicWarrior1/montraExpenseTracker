import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {ICONS} from '../../../constants/icons';
import {Dropdown} from 'react-native-element-dropdown';
import style from '../styles';
import {monthData} from '../../../constants/strings';
import {useAppTheme} from '../../../hooks/themeHook';
import { COLORS } from '../../../constants/commonStyles';
import { STRINGS } from '../../../localization';

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
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <View style={styles.monthRow}>
      <Dropdown
      showsVerticalScrollIndicator={false}
        autoScroll={false}
        style={styles.dropdown}
        renderLeftIcon={() => (
          <View style={{marginRight: 10}}>
            {ICONS.ArrowDown({
              width: 15,
              height: 15,
              borderColor: COLOR.VIOLET[100],
            })}
          </View>
        )}
        renderItem={item => {
          return (
            <View
              style={[
                styles.itemCtr,
                {
                  backgroundColor:
                    item.value === month + 1
                      ? COLOR.VIOLET[60]
                      : COLOR.LIGHT[100],
                },
              ]}>
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      item.value === month + 1
                        ? COLORS.LIGHT[100]
                        : COLOR.DARK[100],
                  },
                ]}>
                {item.label}
              </Text>
            </View>
          );
        }}
        renderRightIcon={() => <></>}
        placeholder={STRINGS.Month}
        value={monthData(STRINGS)[month]}
        data={monthData(STRINGS).slice(0, new Date().getMonth() + 1)}
        labelField={'label'}
        valueField={'value'}
        onChange={({value}) => {
          setMonth(value - 1);
        }}
        itemTextStyle={{color: COLOR.DARK[100]}}
        containerStyle={{backgroundColor: COLOR.LIGHT[100]}}
        activeColor={COLOR.LIGHT[100]}
        selectedTextStyle={{color: COLOR.DARK[100]}}
      />
      <View style={styles.graphBtnCtr}>
        <Pressable
          style={[
            styles.graphBtn,
            {
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6,
              backgroundColor:
                graph === 0 ? COLOR.VIOLET[100] : COLOR.LIGHT[100],
            },
          ]}
          onPress={() => {
            setGraph(0);
            setType('transaction');
          }}>
          {ICONS.LineChart({
            height: 25,
            width: 25,
            color: graph === 0 ? COLOR.LIGHT[100] : COLOR.VIOLET[100],
          })}
        </Pressable>
        <Pressable
          style={[
            styles.graphBtn,
            {
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              backgroundColor:
                graph === 1 ? COLOR.VIOLET[100] : COLOR.LIGHT[100],
            },
          ]}
          onPress={() => {
            setGraph(1);
            setType('category');
          }}>
          {ICONS.Pie({
            height: 25,
            width: 25,
            color: graph === 1 ? COLOR.LIGHT[100] : COLOR.VIOLET[100],
          })}
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(FinancialReportHeader);
