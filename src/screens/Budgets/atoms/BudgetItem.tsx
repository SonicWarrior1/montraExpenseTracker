import React, {useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import {ICONS} from '../../../constants/icons';
import {formatWithCommas} from '../../../utils/commonFuncs';
import {currencies, NAVIGATION} from '../../../constants/strings';
import {COLORS} from '../../../constants/commonStyles';
import {BottomParamList, RootStackParamList} from '../../../defs/navigation';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {Bar} from 'react-native-progress';
import {useAppSelector} from '../../../redux/store';
import { STRINGS } from '../../../localization';

function BudgetItem({
  item,
  spend,
  currency,
  // conversion,
  styles,
  navigation,
  month,
}: Readonly<{
  item: [
    string,
    {
      alert: boolean;
      limit: number;
      percentage: number;
      conversion: {
        [key: string]: {
          [key: string]: number;
        };
      };
    },
  ];
  month: number;
  currency: string | undefined;
  spend: {
    [category: string]: {
      [currency: string]: number;
    };
  };
  // conversion: {
  //   [key: string]: {
  //     [key: string]: number;
  //   };
  // };
  styles: any;
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomParamList, 'Budget', undefined>,
    StackNavigationProp<RootStackParamList, keyof RootStackParamList, undefined>
  >;
}>) {
  const key = item[0];
  const val = item[1];
  const expenseColors = useAppSelector(
    state => state.user.currentUser?.expenseColors,
  );
  const color = expenseColors?.[key] ?? 'green';
  const getValue = useCallback(
    (
      budget: {
        alert: boolean;
        limit: number;
        percentage: number;
      },
      cat: string,
    ) => {
      if (spend?.[cat]?.USD === undefined) {
        return (
          item[1].conversion.usd[currency?.toLowerCase() ?? 'usd'] *
          budget.limit
        ).toFixed(2);
      }
      if (budget.limit - (spend?.[cat]?.USD ?? 0) < 0) {
        return '0';
      }

      return (
        budget.limit *
          item[1].conversion.usd[currency?.toLowerCase() ?? 'usd'] -
        (spend?.[cat]?.[currency?.toUpperCase() ?? 'USD'] ?? 0)
      ).toFixed(2);
    },
    [currency, item, spend],
  );
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
          <View style={[styles.colorBox, {backgroundColor: color}]} />
          <Text style={styles.catText}>
            {key[0].toUpperCase() + key.slice(1)}
          </Text>
        </View>
        {(spend?.[key]?.USD ?? 0) >= val.limit &&
          ICONS.Alert({
            height: 25,
            width: 25,
            color: COLORS.PRIMARY.RED,
          })}
      </View>
      <Text style={styles.text1}>
        Remaining {currencies[currency!].symbol}
        {formatWithCommas(getValue(val, key).toString())}
      </Text>
      <Bar
        progress={(spend?.[key]?.USD ?? 0) / val.limit}
        height={8}
        width={null}
        color={color}
      />
      <Text style={styles.text2}>
        {currencies[currency!].symbol}
        {formatWithCommas(
          (spend?.[key]?.[currency?.toUpperCase() ?? 'USD'] ?? 0)
            .toFixed(2)
            .toString(),
        )}{' '}
        of {currencies[currency!].symbol}
        {formatWithCommas(
          (val.conversion.usd[currency!.toLowerCase()] * val.limit)
            .toFixed(2)
            .toString(),
        )}
      </Text>
      {(spend?.[key]?.USD ?? 0) >= val.limit && (
        <Text style={styles.limitText}>{STRINGS.LimitExceeded}</Text>
      )}
    </Pressable>
  );
}

export default React.memo(BudgetItem);
