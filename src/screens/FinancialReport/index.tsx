import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  NativeScrollEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import style from './styles';
import {Dropdown} from 'react-native-element-dropdown';
import {useAppSelector} from '../../redux/store';
import Spacer from '../../components/Spacer';
import FinancialReportHeader from './atoms/header';
import Linegraph from './atoms/linegraph';
import Piegraph from './atoms/piegraph';
import TransactionList from './atoms/TransactionList';
import CategoryList from './atoms/CategoryList';
import {useAppTheme} from '../../hooks/themeHook';
import {useQuery} from '@realm/react';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../DbModels/OfflineTransactionModel';
import CustomHeader from '../../components/CustomHeader';
import {FinancialReportScreenProps} from '../../defs/navigation';
import { STRINGS } from '../../localization';

function FinancialReport({navigation}: Readonly<FinancialReportScreenProps>) {
  // state
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [graph, setGraph] = useState<number>(0);
  const [transType, setTransType] = useState<'expense' | 'income'>('expense');
  const [type, setType] = useState<'transaction' | 'category'>('transaction');
  // const [catColors, setCatColors] = useState<{[key: string]: string}>();
  const [sort, setSort] = useState<boolean>(false);
  const [incomeOffset, setIncomeOffset] = useState<number>(0);
  const [expenseOffset, setExpenseOffset] = useState<number>(0);
  // redux
  const spends = useAppSelector(
    state => state.user.currentUser?.spend?.[month],
  );
  const incomes = useAppSelector(
    state => state.user.currentUser?.income?.[month],
  );
  const expenseColors = useAppSelector(
    state => state.user.currentUser?.expenseColors,
  );
  const incomeColors = useAppSelector(
    state => state.user.currentUser?.incomeColors,
  );
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const onlineData = useQuery(OnlineTransactionModel);
  const offlineData = useQuery(OfflineTransactionModel);
  const data = [
    ...onlineData.filter(item => item.changed !== true),
    ...offlineData.filter(item => item.operation !== 'delete'),
  ];
  //
  const totalSpend = useMemo(
    () =>
      Object.values(spends ?? {}).reduce(
        (a, b) => a + b[currency?.toUpperCase() ?? 'USD'],
        0,
      ),
    [currency, spends],
  );
  const totalIncome = useMemo(
    () =>
      Object.values(incomes ?? {}).reduce(
        (a, b) => a + b[currency?.toUpperCase() ?? 'USD'],
        0,
      ),
    [currency, incomes],
  );
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 5;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  // constants
  const limit = 5;
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const scheme = useColorScheme();
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const finalTheme = theme === 'device' ? scheme : theme;
  const typeBtnColor = (type: 'income' | 'expense') => {
    if (transType === type) {
      return COLORS.VIOLET[100];
    } else if (finalTheme === 'light') {
      return COLORS.LIGHT[60];
    } else {
      return COLOR.DARK[75];
    }
  };
  const onScroll = ({nativeEvent}: {nativeEvent: NativeScrollEvent}) => {
    console.log('sdkml');
    if (isCloseToBottom(nativeEvent)) {
      if (incomeOffset + limit < Object.values(data).length) {
        if (transType === 'expense') {
          setExpenseOffset(offset => offset + 5);
        } else {
          setIncomeOffset(offset => offset + 5);
        }
      }
    }
  };
  return (
    <SafeAreaView style={[styles.safeView, {flex: 1}]}>
      <ScrollView
        contentContainerStyle={[styles.safeView]}
        style={[styles.safeView, {paddingBottom: 20}]}
        onScroll={onScroll}
        scrollEventThrottle={400}>
        <CustomHeader
          backgroundColor={COLOR.LIGHT[100]}
          title={STRINGS.FinancialReport}
          navigation={navigation}
          color={COLOR.DARK[100]}
        />
        <FinancialReportHeader
          graph={graph}
          month={month}
          setGraph={setGraph}
          setMonth={setMonth}
          setType={setType}
        />
        {graph === 0 ? (
          <Linegraph
            // conversion={conversion}
            currency={currency}
            data={data}
            month={month}
            transType={transType}
            totalIncome={totalIncome}
            totalSpend={totalSpend}
          />
        ) : (
          <Piegraph
            catColors={transType === 'expense' ? expenseColors : incomeColors}
            // conversion={conversion}
            currency={currency}
            incomes={incomes}
            spends={spends}
            totalIncome={totalIncome}
            totalSpend={totalSpend}
            transType={transType}
          />
        )}
        <View style={styles.typeRow}>
          <View
            style={[
              styles.innerTypeRow,
              {
                backgroundColor:
                  finalTheme === 'dark' ? COLORS.DARK[75] : COLOR.LIGHT[60],
              },
            ]}>
            <Pressable
              style={[
                styles.typeBtn,
                {
                  backgroundColor: typeBtnColor('expense'),
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
                        : COLOR.DARK[100],
                  },
                ]}>
                {STRINGS.Expense}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.typeBtn,
                {
                  backgroundColor: typeBtnColor('income'),
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
                        : COLOR.DARK[100],
                  },
                ]}>
                {STRINGS.Income}
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.flexRow}>
          <Dropdown
          showsVerticalScrollIndicator={false}
            style={[styles.dropdown, {width: 160}]}
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
                        item.value === type
                          ? COLOR.VIOLET[60]
                          : COLOR.LIGHT[100],
                    },
                  ]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          item.value === type
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
            value={type}
            data={['transaction', 'category'].map(item => {
              return {
                label: item[0].toUpperCase() + item.slice(1),
                value: item,
              };
            })}
            labelField={'label'}
            valueField={'value'}
            onChange={({value}) => {
              setType(value as 'transaction' | 'category');
              setGraph(
                (value as 'transaction' | 'category') === 'transaction' ? 0 : 1,
              );
            }}
            itemTextStyle={{color: COLOR.DARK[100]}}
            containerStyle={{backgroundColor: COLOR.LIGHT[100]}}
            activeColor={COLOR.LIGHT[100]}
            selectedTextStyle={{color: COLOR.DARK[100]}}
          />
          <Pressable
            style={[
              styles.filterBtn,
              {
                transform: [
                  {rotateZ: sort ? '-180deg' : '0deg'},
                  {rotateY: sort ? '180deg' : '0deg'},
                ],
              },
            ]}
            onPress={() => {
              setSort(sort => !sort);
            }}>
            {ICONS.SortwithArrow({
              height: 25,
              width: 25,
              color: COLOR.DARK[100],
            })}
          </Pressable>
        </View>
        <Spacer height={10} />
        {type === 'transaction' ? (
          <TransactionList
            data={data}
            month={month}
            transType={transType}
            sort={sort}
            limit={limit}
            incomeOffset={incomeOffset}
            expenseOffset={expenseOffset}
            scheme={scheme}
            theme={theme}
            navigation={navigation}
          />
        ) : (
          <CategoryList
            catColors={transType === 'expense' ? expenseColors : incomeColors}
            currency={currency}
            incomes={incomes}
            spends={spends}
            totalIncome={totalIncome}
            totalSpend={totalSpend}
            transType={transType}
            sort={sort}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(FinancialReport);
