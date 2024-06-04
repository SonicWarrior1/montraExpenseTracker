import React, {useState} from 'react';
import {Pressable, SafeAreaView, ScrollView, Text, View} from 'react-native';
import styles from './styles';
import {ICONS} from '../../constants/icons';
import CustomButton from '../../components/CustomButton';
import Sapcer from '../../components/Spacer';
import {BudgetScreenProps} from '../../defs/navigation';
import {currencies, monthData, NAVIGATION} from '../../constants/strings';
import {useAppSelector} from '../../redux/store';
import {Bar} from 'react-native-progress';
import {COLORS} from '../../constants/commonStyles';

function BudgetScreen({navigation}: Readonly<BudgetScreenProps>) {
  const [month, setMonth] = useState(new Date().getMonth());
  const budgets = useAppSelector(
    state => state.user.currentUser?.budget[month],
  );
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const conversion = useAppSelector(state => state.transaction.conversion);
  const spend =
    useAppSelector(state => state.user.currentUser?.spend[month]) ?? {};
  return (
    <View style={styles.safeView}>
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
              color: 'white',
            })}
          </Pressable>
          <Text style={styles.month}>{monthData[month].label}</Text>
          <Pressable
            onPress={() => {
              setMonth(month => {
                if (month < new Date().getMonth()) {
                  return month + 1;
                }
                return month;
              });
            }}>
            {ICONS.ArrowRight({
              height: 30,
              width: 30,
              color: 'white',
              borderColor: 'white',
            })}
          </Pressable>
        </View>
      </SafeAreaView>
      <View style={styles.mainView}>
        {budgets === undefined || Object.values(budgets).length === 0 ? (
          <View style={styles.centerCtr}>
            {month < new Date().getMonth() ? (
              <Text style={styles.centerText}>
                You don't have a budget for this month.
              </Text>
            ) : (
              <>
                <Text style={styles.centerText}>You don't have a budget.</Text>
                <Text style={styles.centerText}>
                  Let's make one so you are in control.
                </Text>
              </>
            )}
          </View>
        ) : (
          <ScrollView style={{flex: 1, marginTop: 10, width: '100%'}}>
            {Object.entries(budgets).map(([key, val]) => {
              return (
                <Pressable
                  key={key}
                  style={styles.listItemCtr}
                  onPress={() => {
                    navigation.push(NAVIGATION.DetailBudget, {
                      category: key,
                    });
                  }}>
                  <View style={styles.catRow}>
                    <View style={styles.catCtr}>
                      <View style={styles.colorBox}></View>
                      <Text style={styles.catText}>
                        {key[0].toUpperCase() + key.slice(1)}
                      </Text>
                    </View>
                    {(spend[key] ?? 0) >= val.limit &&
                      ICONS.Alert({
                        height: 20,
                        width: 20,
                        color: COLORS.PRIMARY.RED,
                      })}
                  </View>
                  <Text style={styles.text1}>
                    Remaining {currencies[currency!].symbol}
                    {val.limit - spend[key] < 0
                      ? '0'
                      : spend[key] === undefined
                      ? (
                          conversion['usd'][currency!.toLowerCase()] * val.limit
                        ).toFixed(2)
                      : (
                          conversion['usd'][currency!.toLowerCase()] *
                            val.limit -
                          (spend[key] ?? 0)
                        ).toFixed(2)}
                  </Text>
                  <Bar
                    progress={(spend[key] ?? 0) / val.limit}
                    height={8}
                    width={null}
                  />
                  <Text style={styles.text2}>
                    {currencies[currency!].symbol}
                    {(
                      conversion['usd'][currency!.toLowerCase()!] *
                      (spend[key] ?? 0)
                    ).toFixed(2)}{' '}
                    of {currencies[currency!].symbol}
                    {(
                      conversion['usd'][currency!.toLowerCase()!] * val.limit
                    ).toFixed(2)}
                  </Text>
                  {(spend[key] ?? 0) >= val.limit && (
                    <Text style={styles.limitText}>
                      You've exceed the limit!
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        )}
        {month === new Date().getMonth() && (
          <CustomButton
            title="Create a Budget"
            onPress={() => {
              navigation.push(NAVIGATION.CreateBudget, {isEdit: false});
            }}
          />
        )}
        <Sapcer height={20} />
      </View>
    </View>
  );
}
export default BudgetScreen;
