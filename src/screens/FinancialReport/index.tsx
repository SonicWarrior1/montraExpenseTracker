import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import styles from './styles';
import {Dropdown} from 'react-native-element-dropdown';
import {useAppSelector} from '../../redux/store';
import Sapcer from '../../components/Spacer';
import FinancialReportHeader from './atoms/header';
import Linegraph from './atoms/linegraph';
import Piegraph from './atoms/piegraph';
import TransactionList from './atoms/TransactionList';
import CategoryList from './atoms/CategoryList';

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
  const totalSpend = useMemo(
    () =>
      Object.values(spends)
        .reduce((a, b) => a + b, 0)
        .toFixed(2),
    [spends],
  );
  const totalIncome = useMemo(
    () =>
      Object.values(incomes)
        .reduce((a, b) => a + b, 0)
        .toFixed(2),
    [incomes],
  );
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
  return (
    <SafeAreaView style={styles.safeView}>
      <FinancialReportHeader
        graph={graph}
        month={month}
        setGraph={setGraph}
        setMonth={setMonth}
        setType={setType}
      />
      {graph === 0 ? (
        <Linegraph
          conversion={conversion}
          currency={currency}
          data={data}
          month={month}
          transType={transType}
          totalIncome={totalIncome}
          totalSpend={totalSpend}
        />
      ) : (
        <Piegraph
          catColors={catColors}
          conversion={conversion}
          currency={currency}
          incomes={incomes}
          spends={spends}
          totalIncome={totalIncome}
          totalSpend={totalSpend}
          transType={transType}
        />
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
        <TransactionList
          conversion={conversion}
          currency={currency}
          data={data}
          month={month}
          transType={transType}
        />
      ) : (
        <CategoryList
          catColors={catColors}
          conversion={conversion}
          currency={currency}
          incomes={incomes}
          spends={spends}
          totalIncome={totalIncome}
          totalSpend={totalSpend}
          transType={transType}
        />
      )}
    </SafeAreaView>
  );
}

export default React.memo(FinancialReport);
