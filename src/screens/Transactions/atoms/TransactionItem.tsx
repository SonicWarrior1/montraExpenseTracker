import {Timestamp} from '@react-native-firebase/firestore';
import {ColorSchemeName, Pressable, Text, View} from 'react-native';
import style from '../styles';
import {currencies, monthData, NAVIGATION} from '../../../constants/strings';
import {COLORS} from '../../../constants/commonStyles';
import {catIcons, ICONS} from '../../../constants/icons';
import {useAppTheme} from '../../../hooks/themeHook';
import {BottomParamList, RootStackParamList} from '../../../defs/navigation';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppSelector} from '../../../redux/store';
import React from 'react';
import {OnlineTransactionModel} from '../../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../../DbModels/OfflineTransactionModel';
import {formatAMPM} from '../../../utils/firebase';

const TransactionItem = ({
  item,
  theme,
  scheme,
  navigation,
  dateShow,
}: {
  item: OnlineTransactionModel | OfflineTransactionModel;
  theme: 'light' | 'device' | 'dark' | undefined;
  scheme: ColorSchemeName;
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomParamList, 'Transaction', undefined>,
    StackNavigationProp<RootStackParamList, keyof RootStackParamList, undefined>
  >;
  dateShow?: boolean;
}) => {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const finaltheme = theme === 'device' ? scheme : theme;
  // redux
  const user = useAppSelector(state => state.user.currentUser);
  const conversion = useAppSelector(state => state.transaction.conversion);
  // functions
  const getAmtSymbol = (
    item: OnlineTransactionModel | OfflineTransactionModel,
  ) => {
    if (item.type === 'expense') {
      return '-';
    } else if (item.type === 'income') {
      return '+';
    } else {
      return '';
    }
  };
  const getAmtColor = (
    item: OnlineTransactionModel | OfflineTransactionModel,
  ) => {
    if (item.type === 'expense') {
      return COLORS.PRIMARY.RED;
    } else if (item.type === 'income') {
      return COLORS.PRIMARY.GREEN;
    } else {
      return COLORS.PRIMARY.BLUE;
    }
  };
  return (
    <Pressable
      style={[
        styles.listItemCtr,
        {
          backgroundColor:
            finaltheme === 'light' ? COLORS.LIGHT[80] : COLORS.DARK[100],
        },
      ]}
      onPress={() => {
        navigation.push(NAVIGATION.TransactionDetail, {
          transaction: item,
        });
      }}>
      <View
        style={[
          styles.icon,
          {
            backgroundColor:
              item.type === 'transfer'
                ? COLORS.BLUE[80]
                : catIcons[item.category]?.color ?? COLORS.LIGHT[20],
          },
        ]}>
        {item.type === 'transfer'
          ? ICONS.Transfer({height: 30, width: 30})
          : catIcons[item.category]?.icon({
              height: 30,
              width: 30,
            }) ?? ICONS.Money({height: 30, width: 30})}
      </View>
      <View style={styles.catCtr}>
        <Text style={styles.text1}>
          {item.type === 'transfer'
            ? item.from + ' - ' + item.to
            : item.category[0].toLocaleUpperCase() + item.category.slice(1)}
        </Text>
        <Text style={styles.text2} numberOfLines={1}>
          {item.desc}
        </Text>
      </View>
      <View style={{alignItems: 'flex-end', rowGap: 5}}>
        <Text
          style={[
            styles.text1,
            {
              fontWeight: '600',
              color: getAmtColor(item),
            },
          ]}>
          {getAmtSymbol(item)} {currencies[user?.currency ?? 'USD'].symbol}
          {(
            conversion.usd[(user?.currency ?? 'USD').toLowerCase()] *
            item.amount
          ).toFixed(1)}
        </Text>
        <Text style={styles.text2}>
          {dateShow &&
            Timestamp.fromMillis(item.timeStamp.seconds * 1000)
              ?.toDate()
              ?.getDate() +
              ' ' +
              monthData[
                Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                  ?.toDate()
                  ?.getMonth()
              ].label +
              ' ' +
              Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                ?.toDate()
                ?.getFullYear()}{' '}
          {formatAMPM(
            Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate(),
          )}
        </Text>
      </View>
    </Pressable>
  );
};

export default React.memo(TransactionItem);
