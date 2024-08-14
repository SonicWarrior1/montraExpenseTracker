import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import style from '../styles';
import {currencies} from '../../../constants/strings';
import {useAppTheme} from '../../../hooks/themeHook';
import {formatWithCommas} from '../../../utils/commonFuncs';
import { STRINGS } from '../../../localization';

function Piegraph({
  transType,
  spends,
  incomes,
  catColors,
  // conversion,
  currency,
  totalSpend,
  totalIncome,
}: Readonly<{
  transType: 'income' | 'expense';
  spends:
    | never[]
    | {
        [category: string]: {
          [currency: string]: number;
        };
      }
    | undefined;
  incomes:
    | never[]
    | {
        [category: string]: {
          [currency: string]: number;
        };
      }
    | undefined;
  catColors:
    | {
        [key: string]: string;
      }
    | undefined;
  currency: string | undefined;
  // conversion: {
  //   [key: string]: {
  //     [key: string]: number;
  //   };
  // };
  totalSpend: number;
  totalIncome: number;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  function labelComponent() {
    return (
      <Text style={styles.pieCenterText} numberOfLines={1}>
        {currencies[currency!].symbol}
        {formatWithCommas(
          (transType === 'expense' ? totalSpend : totalIncome)
            .toFixed(2)
            .toString(),
        )}
      </Text>
    );
  }
  const getFlexValue = () => {
    if (transType === 'expense') {
      if (spends && spends.length !== 0) {
        return 0;
      } else {
        return 1;
      }
    } else if (transType === 'income') {
      if (incomes && incomes.length !== 0) {
        return 0;
      } else {
        return 1;
      }
    }
  };
  const checkEmpty = () => {
    if (transType === 'expense') {
      return Number(totalSpend) !== 0;
    } else {
      return Number(totalIncome) !== 0;
    }
  };
  const pieData = useMemo(
    () =>
      Object.entries(transType === 'expense' ? spends ?? {} : incomes ?? {})
        .sort((a, b) => b[1].USD - a[1].USD)
        .map(item => {
          return {
            value: item[1][currency?.toUpperCase() ?? 'USD'],
            color: catColors![item[0]],
          };
        }),
    [catColors, currency, incomes, spends, transType],
  );
  return (
    <View
      style={[
        styles.pieView,
        {
          flex: getFlexValue(),
        },
      ]}>
      {checkEmpty() ? (
        <PieChart
          donut
          innerRadius={90}
          innerCircleBorderWidth={3}
          innerCircleBorderColor={'#ffffff'}
          strokeWidth={3}
          strokeColor="#ffffff"
          isAnimated={true}
          centerLabelComponent={labelComponent}
          innerCircleColor={COLOR.LIGHT[100]}
          data={pieData}
        />
      ) : (
        <View style={styles.noDataCtr}>
          <Text style={styles.emptyText}>{STRINGS.NoData}</Text>
        </View>
      )}
    </View>
  );
}

export default React.memo(Piegraph);
