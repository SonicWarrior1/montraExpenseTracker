import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {ICONS} from '../../../constants/icons';
import {formatWithCommas, getMyColor} from '../../../utils/commonFuncs';
import {currencies, NAVIGATION, STRINGS} from '../../../constants/strings';
import {COLORS} from '../../../constants/commonStyles';
import {
  BottomParamList,
  RootStackParamList,
} from '../../../defs/navigation';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {Bar} from 'react-native-progress';

function BudgetItem({
  item,
  spend,
  currency,
  conversion,
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
    },
  ];
  month: number;
  currency: string | undefined;
  spend: {
    [key: string]: number;
  };
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  styles: any;
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomParamList, 'Budget', undefined>,
    StackNavigationProp<RootStackParamList, keyof RootStackParamList, undefined>
  >;
}>) {
  const key = item[0];
  const val = item[1];
  const color = getMyColor();
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
      return (conversion.usd[currency!.toLowerCase()] * val.limit).toFixed(2);
    } else {
      return (
        conversion.usd[currency!.toLowerCase()] *
        (val.limit - (spend[key] ?? 0))
      ).toFixed(2);
    }
  };
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
              conversion.usd[currency!.toLowerCase()] * (spend[key] ?? 0)
            ).toFixed(2),
          ).toString(),
        )}{' '}
        of {currencies[currency!].symbol}
        {formatWithCommas(
          Number(
            (conversion.usd[currency!.toLowerCase()] * val.limit).toFixed(2),
          ).toString(),
        )}
      </Text>
      {(spend[key] ?? 0) >= val.limit && (
        <Text style={styles.limitText}>{STRINGS.LimitExceeded}</Text>
      )}
    </Pressable>
  );
}

export default React.memo(BudgetItem);
