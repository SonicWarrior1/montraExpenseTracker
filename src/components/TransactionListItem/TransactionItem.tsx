import {Timestamp} from '@react-native-firebase/firestore';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {ColorSchemeName, Pressable, View, Text} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {catIcons, ICONS} from '../../constants/icons';
import {NAVIGATION, currencies, monthData} from '../../constants/strings';
import {OfflineTransactionModel} from '../../DbModels/OfflineTransactionModel';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {RootStackParamList, BottomParamList} from '../../defs/navigation';
import {useAppTheme} from '../../hooks/themeHook';
import {useAppSelector} from '../../redux/store';
import {formatWithCommas} from '../../utils/commonFuncs';
import {formatAMPM} from '../../utils/firebase';
import style from './styles';
import {RFValue} from 'react-native-responsive-fontsize';

const TransactionItem = ({
  item,
  theme,
  scheme,
  navigation,
  dateShow,
  disabled,
}: {
  item: OnlineTransactionModel | OfflineTransactionModel;
  theme: 'light' | 'device' | 'dark' | undefined;
  scheme: ColorSchemeName;
  navigation:
    | StackNavigationProp<RootStackParamList, 'FinancialReport', undefined>
    | CompositeNavigationProp<
        BottomTabNavigationProp<
          BottomParamList,
          'Transaction' | 'Home',
          undefined
        >,
        StackNavigationProp<
          RootStackParamList,
          keyof RootStackParamList,
          undefined
        >
      >;
  dateShow?: boolean;
  disabled?: boolean;
}) => {
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const finaltheme = theme === 'device' ? scheme : theme;
  // redux
  const user = useAppSelector(state => state.user.currentUser);
  // const conversion = useAppSelector(state => state.user.conversion);
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
      disabled={disabled}
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
        <Text style={styles.text1} numberOfLines={1}>
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
          {formatWithCommas(
            (
              item.conversion.usd[(user?.currency ?? 'USD').toLowerCase()] *
              item.amount
            )
              .toFixed(2)
              .toString(),
          )}
        </Text>
        <Text
          style={[
            styles.text2,
            {fontSize: dateShow ? RFValue(11) : RFValue(13)},
          ]}>
          {formatAMPM(
            Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate(),
          )}
        </Text>
        {dateShow && (
          <Text
            style={[
              styles.text2,
              {fontSize: dateShow ? RFValue(11) : RFValue(13)},
            ]}>
            {Timestamp.fromMillis(item.timeStamp.seconds * 1000)
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
                ?.getFullYear()}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default React.memo(TransactionItem);
