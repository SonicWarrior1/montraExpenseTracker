import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {catIcons, ICONS} from '../../constants/icons';
import styles from './styles';
import {Dropdown} from 'react-native-element-dropdown';
import {currencies, monthData} from '../../constants/strings';
import {useAppSelector} from '../../redux/store';
import {LineChart, PieChart} from 'react-native-gifted-charts';
import {Timestamp} from '@react-native-firebase/firestore';
import {Bar} from 'react-native-progress';
import Sapcer from '../../components/Spacer';

function FinancialReport() {
  const getMyColor = useCallback(() => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
  }, []);
  const [month, setMonth] = useState(new Date().getMonth());
  const [graph, setGraph] = useState(0);
  const [transType, setTransType] = useState<'expense' | 'income'>('expense');
  const [type, setType] = useState<'transaction' | 'category'>('transaction');
  const [catColors, setCatColors] = useState<{[key: string]: string}>();
  const spends =
    useAppSelector(state => state.user.currentUser?.spend?.[month]) ?? [];
  const incomes =
    useAppSelector(state => state.user.currentUser?.income?.[month]) ?? [];
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const {conversion, transactions: data} = useAppSelector(
    state => state.transaction,
  );
  const totalSpend = Object.values(spends)
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
  const totalIncome = Object.values(incomes)
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
  useEffect(() => {
    setCatColors(
      Object.entries(transType === 'expense' ? spends : incomes).reduce(
        (acc: {[key: string]: string}, item) => {
          acc[item[0]] = getMyColor();
          return acc;
        },
        {},
      ),
    );
    return () => {
      setCatColors(undefined);
    };
  }, [transType]);
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
    <SafeAreaView style={styles.safeView}>
      <View style={styles.monthRow}>
        <Dropdown
          style={styles.dropdown}
          renderLeftIcon={() => (
            <View style={{marginRight: 10}}>
              {ICONS.ArrowDown({width: 15, height: 15})}
            </View>
          )}
          renderRightIcon={() => <></>}
          placeholder="Month"
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
      {graph === 0 ? (
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
      ) : (
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
            transType === 'expense' ? spends.length !== 0 : incomes.length !== 0
          ) ? (
            <PieChart
              donut
              innerRadius={100}
              isAnimated={true}
              centerLabelComponent={labelComponent}
              data={Object.entries(
                transType === 'expense' ? spends : incomes,
              ).map(item => {
                return {
                  value: item[1],
                  color: catColors![item[0]],
                };
              })}
            />
          ) : (
            <Text>No Data</Text>
          )}
        </View>
      )}
      <View style={styles.typeRow}>
        <View style={styles.innerTypeRow}>
          <Pressable
            style={[
              styles.typeBtn,
              {
                backgroundColor:
                  transType === 'expense'
                    ? COLORS.VIOLET[100]
                    : COLORS.LIGHT[60],
              },
            ]}
            onPress={() => {
              setTransType('expense');
            }}>
            <Text
              style={[
                styles.typeText,
                {
                  color:
                    transType === 'expense'
                      ? COLORS.LIGHT[100]
                      : COLORS.DARK[100],
                },
              ]}>
              Expense
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.typeBtn,
              {
                backgroundColor:
                  transType === 'income'
                    ? COLORS.VIOLET[100]
                    : COLORS.LIGHT[60],
              },
            ]}
            onPress={() => {
              setTransType('income');
            }}>
            <Text
              style={[
                styles.typeText,
                {
                  color:
                    transType === 'income'
                      ? COLORS.LIGHT[100]
                      : COLORS.DARK[100],
                },
              ]}>
              Income
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.flexRow}>
        <Dropdown
          style={[styles.dropdown, {width: 160}]}
          renderLeftIcon={() => (
            <View style={{marginRight: 10}}>
              {ICONS.ArrowDown({width: 15, height: 15})}
            </View>
          )}
          renderRightIcon={() => <></>}
          value={type}
          data={['transaction', 'category'].map(item => {
            return {label: item[0].toUpperCase() + item.slice(1), value: item};
          })}
          labelField={'label'}
          valueField={'value'}
          onChange={({value}) => {
            setType(value as 'transaction' | 'category');
            setGraph(
              (value as 'transaction' | 'category') === 'transaction' ? 0 : 1,
            );
          }}
        />
        <Pressable style={styles.filterBtn} onPress={() => {}}>
          {ICONS.SortwithArrow({height: 25, width: 25})}
        </Pressable>
      </View>
      <Sapcer height={10} />
      {type === 'transaction' ? (
        <FlatList
          style={{paddingHorizontal: 20}}
          data={Object.values(data)
            .filter(
              item =>
                item.timeStamp.toDate().getMonth() === month &&
                item.type === transType,
            )
            .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
            .slice(0, 4)}
          renderItem={({item}) => {
            return (
              <Pressable
                style={styles.listItemCtr}
                onPress={() => {
                  // navigation.push('TransactionDetail', {
                  //   transaction: {
                  //     ...item,
                  //     amount: Number(
                  //       (
                  //         conversion['usd'][currency!.toLowerCase()] *
                  //         item.amount
                  //       ).toFixed(2),
                  //     ),
                  //   },
                  // });
                }}>
                <View
                  style={[
                    styles.icon,
                    {
                      backgroundColor:
                        catIcons[item.category]?.color ?? COLORS.LIGHT[20],
                    },
                  ]}>
                  {catIcons[item.category]?.icon({height: 30, width: 30}) ??
                    ICONS.Money({height: 30, width: 30})}
                </View>
                <View style={styles.catCtr}>
                  <Text style={styles.text1}>
                    {item.category[0].toLocaleUpperCase() +
                      item.category.slice(1)}
                  </Text>
                  <Text style={styles.text2}>{item.desc}</Text>
                </View>
                <View style={{alignItems: 'flex-end', rowGap: 5}}>
                  <Text
                    style={[
                      styles.text1,
                      {
                        fontWeight: '600',
                        color:
                          item.type === 'expense'
                            ? COLORS.PRIMARY.RED
                            : COLORS.PRIMARY.GREEN,
                      },
                    ]}>
                    {item.type === 'expense' ? '-' : '+'}{' '}
                    {currencies[currency!].symbol}{' '}
                    {(
                      conversion['usd'][currency!.toLowerCase()] * item.amount
                    ).toFixed(2)}
                  </Text>
                  <Text style={styles.text2}>
                    {Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                      .toDate()
                      .toLocaleDateString()}{' '}
                    {Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                      .toDate()
                      .getHours()}
                    :
                    {Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                      .toDate()
                      .getMinutes() < 10
                      ? '0' +
                        Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                          .toDate()
                          .getMinutes()
                      : Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                          .toDate()
                          .getMinutes()}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      ) : (
        <FlatList
          style={{paddingHorizontal: 20}}
          data={Object.entries(transType === 'expense' ? spends : incomes)}
          renderItem={({item}) => (
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
                progress={item[1] / Number(totalSpend)}
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
          )}
        />
      )}
    </SafeAreaView>
  );
}

export default FinancialReport;
