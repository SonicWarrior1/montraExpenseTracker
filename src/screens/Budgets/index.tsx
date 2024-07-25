import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, Text, View} from 'react-native';
import style from './styles';
import {ICONS} from '../../constants/icons';
import CustomButton from '../../components/CustomButton';
import Spacer from '../../components/Spacer';
import {BudgetScreenProps} from '../../defs/navigation';
import {monthData, NAVIGATION, STRINGS} from '../../constants/strings';
import {useAppSelector} from '../../redux/store';
import {useAppTheme} from '../../hooks/themeHook';
import TabBackdrop from '../../components/TabBackdrop';
import BudgetItem from './atoms/BudgetItem';

function BudgetScreen({navigation}: Readonly<BudgetScreenProps>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // state
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [spend, setSpend] = useState<{
    [category: string]: {
      [currency: string]: number;
    };
  }>({});
  // redux
  const budgets = useAppSelector(
    state => state.user.currentUser?.budget[month],
  );
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  // const conversion = useAppSelector(state => state.user.conversion)
  const monthlySpend = useAppSelector(
    state => state.user.currentUser?.spend[month],
  );
  // functions
  const onPress = useCallback(() => {
    setMonth(month => {
      if (month < new Date().getMonth()) {
        return month + 1;
      }
      return month;
    });
  }, []);
  useEffect(() => {
    console.log('USE EFFECT');
    if (
      monthlySpend &&
      Object.keys(monthlySpend).length >= Object.keys(spend).length
    ) {
      setSpend(monthlySpend ?? {});
    }
  }, [monthlySpend]);
  return (
    <>
      <View style={styles.safeView}>
        <Spacer height={30} />
        <SafeAreaView style={styles.safeView}>
          <View style={styles.monthRow}>
            <Pressable
              onPress={() => {
                setMonth(month => {
                  if (month > 0) {
                    return month - 1;
                  }
                  return month;
                });
              }}>
              {ICONS.ArrowLeft2({
                height: 30,
                width: 30,
                color: COLOR.LIGHT[100],
              })}
            </Pressable>
            <Text style={styles.month}>{monthData[month].label}</Text>
            <Pressable onPress={onPress}>
              {ICONS.ArrowRight({
                height: 30,
                width: 30,
                color: COLOR.LIGHT[100],
                borderColor: COLOR.LIGHT[100],
              })}
            </Pressable>
          </View>
        </SafeAreaView>
        <Spacer height={25} />
        <View style={styles.mainView}>
          {budgets === undefined || Object.values(budgets).length === 0 ? (
            <View style={styles.centerCtr}>
              {month < new Date().getMonth() ? (
                <Text style={styles.centerText}>
                  {STRINGS.NoBudgetForThisMonth}
                </Text>
              ) : (
                <>
                  <Text style={styles.centerText}>{STRINGS.NoBudget}</Text>
                  <Text style={styles.centerText}>
                    {STRINGS.CreateBudgetForThisMonth}
                  </Text>
                </>
              )}
            </View>
          ) : (
            <FlatList
              data={Object.entries(budgets)}
              style={{marginTop: 15, width: '100%'}}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <BudgetItem
                  item={item}
                  // conversion={conversion}
                  currency={currency}
                  month={month}
                  navigation={navigation}
                  spend={spend}
                  styles={styles}
                  key={item[0]}
                />
              )}
            />
          )}
          {month === new Date().getMonth() && (
            <CustomButton
              title={STRINGS.CreateABudget}
              onPress={() => {
                navigation.push(NAVIGATION.CreateBudget, {isEdit: false});
              }}
            />
          )}
          <Spacer height={20} />
        </View>
      </View>
      <TabBackdrop />
    </>
  );
}
export default React.memo(BudgetScreen);
