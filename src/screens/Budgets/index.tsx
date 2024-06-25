import React, {useCallback, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, Text, View} from 'react-native';
import style from './styles';
import {ICONS} from '../../constants/icons';
import CustomButton from '../../components/CustomButton';
import Spacer from '../../components/Spacer';
import {BudgetScreenProps} from '../../defs/navigation';
import {
  currencies,
  monthData,
  NAVIGATION,
  STRINGS,
} from '../../constants/strings';
import {useAppSelector} from '../../redux/store';
import {Bar} from 'react-native-progress';
import {COLORS} from '../../constants/commonStyles';
import {useAppTheme} from '../../hooks/themeHook';
import TabBackdrop from '../../components/TabBackdrop';
import {useQuery} from '@realm/react';
import {BudgetModel} from '../../DbModels/BudgetModel';
import {formatWithCommas, getMyColor} from '../../utils/commonFuncs';

function BudgetScreen({navigation}: Readonly<BudgetScreenProps>) {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // state
  const [month, setMonth] = useState(new Date().getMonth());
  // redux
  const budgets = useAppSelector(
    state => state.user.currentUser?.budget[month],
  );
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const conversion = useAppSelector(state => state.transaction.conversion);
  const spend =
    useAppSelector(state => state.user.currentUser?.spend[month]) ?? {};
  console.log(spend);
  // functions
  const getValue = (
    val: {
      alert: boolean;
      limit: number;
      percentage: number;
    },
    key: string,
  ) => {
    if (val.limit - spend[key] < 0) {
      return '0';
    } else if (spend[key] === undefined) {
      return (conversion.usd[currency!.toLowerCase()] * val.limit).toFixed(1);
    } else {
      return (
        conversion.usd[currency!.toLowerCase()] *
        (val.limit - (spend[key] ?? 0))
      ).toFixed(1);
    }
  };
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
              renderItem={({item}) => {
                const key = item[0];
                const val = item[1];
                const color = getMyColor();
                return (
                  <Pressable
                    key={key}
                    style={styles.listItemCtr}
                    onPress={() => {
                      navigation.push(NAVIGATION.DetailBudget, {
                        category: key,
                        month: month,
                      });
                    }}>
                    <View style={styles.catRow}>
                      <View style={styles.catCtr}>
                        <View
                          style={[styles.colorBox, {backgroundColor: color}]}
                        />
                        <Text style={styles.catText}>
                          {key[0].toUpperCase() + key.slice(1)}
                        </Text>
                      </View>
                      {(spend[key] ?? 0) >= val.limit &&
                        ICONS.Alert({
                          height: 25,
                          width: 25,
                          color: COLORS.PRIMARY.RED,
                        })}
                    </View>
                    <Text style={styles.text1}>
                      Remaining {currencies[currency!].symbol}
                      {formatWithCommas(Number(getValue(val, key)).toString())}
                    </Text>
                    <Bar
                      progress={(spend[key] ?? 0) / val.limit}
                      height={8}
                      width={null}
                      color={color}
                    />
                    <Text style={styles.text2}>
                      {currencies[currency!].symbol}
                      {formatWithCommas(
                        Number(
                          (
                            conversion.usd[currency!.toLowerCase()] *
                            (spend[key] ?? 0)
                          ).toFixed(1),
                        ).toString(),
                      )}{' '}
                      of {currencies[currency!].symbol}
                      {formatWithCommas(Number((
                        conversion.usd[currency!.toLowerCase()] * val.limit
                      ).toFixed(1)).toString())}
                    </Text>
                    {(spend[key] ?? 0) >= val.limit && (
                      <Text style={styles.limitText}>
                        {STRINGS.LimitExceeded}
                      </Text>
                    )}
                  </Pressable>
                );
              }}
            />
          )}
          {month === new Date().getMonth() && (
            <CustomButton
              title={STRINGS.CreateBudget}
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
export default BudgetScreen;
