import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../constants/commonStyles';
import style from './styles';
import {catIcons, ICONS} from '../../constants/icons';
import CustomButton from '../../components/CustomButton';
import {StoryScreenProps} from '../../defs/navigation';
import {useAppSelector} from '../../redux/store';
import {currencies, NAVIGATION, STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';

export default function StoryScreen({navigation}: Readonly<StoryScreenProps>) {
  // redux
  const user = useAppSelector(state => state.user.currentUser);
  const conversion = useAppSelector(state => state.transaction.conversion);
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  // constants
  const screenHeight = Dimensions.get('screen').height;
  const screenWidth = Dimensions.get('screen').width;
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const biggestSpend: [string, number][] =
    user?.spend[new Date().getMonth()] !== undefined
      ? Object.entries(user?.spend[new Date().getMonth()]).sort(
          (a, b) => b[1] - a[1],
        )
      : [['', 0]];
  const biggestIncome: [string, number][] =
    user?.income[new Date().getMonth()] !== undefined
      ? Object.entries(user?.income[new Date().getMonth()]).sort(
          (a, b) => b[1] - a[1],
        )
      : [['', 0]];
  const budgetExceed =
    user?.budget[new Date().getMonth()] !== undefined &&
    user?.spend[new Date().getMonth()] !== undefined
      ? Object.entries(user?.budget[new Date().getMonth()]).filter(
          item => item[1].limit <= user?.spend[new Date().getMonth()][item[0]],
        )
      : undefined;
  // state
  const [index, setIndex] = useState(0);

  const getBackgroundColor = () => {
    if (index === 0) {
      return COLORS.RED[100];
    } else if (index === 1) {
      return COLORS.GREEN[100];
    } else {
      return COLORS.VIOLET[100];
    }
  };

  const getText = () => {
    if (index === 0) {
      return STRINGS.YouSpend;
    } else if (index === 1) {
      return STRINGS.YouEarned;
    } else if (index === 2) {
      return (
        (budgetExceed === undefined ? 0 : budgetExceed.length) +
        STRINGS.BudgetLimitExceed
      );
    } else {
      return STRINGS.Quote;
    }
  };
  return (
    <SafeAreaView
      style={[
        styles.safeView,
        {
          backgroundColor: getBackgroundColor(),
        },
      ]}>
      <View style={styles.progressRow}>
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 0 ? 1 : 0.5,
            },
          ]}
        />
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 1 ? 1 : 0.5,
            },
          ]}
        />
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 2 ? 1 : 0.5,
            },
          ]}
        />
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 3 ? 1 : 0.5,
            },
          ]}
        />
      </View>
      <View style={styles.mainView}>
        {index !== 3 && <Text style={styles.title}>{STRINGS.ThisMonth}</Text>}
        <View style={{alignItems: 'center'}}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
            <Text
              style={[
                styles.text1,
                {
                  paddingHorizontal: 0,
                  marginTop: index === 3 ? 150 : 0,
                },
              ]}>
              {getText()}
            </Text>
            {index==0?<Image
              source={require('../../assets/Images/YouSpend.png')}
              style={{transform:[{scale:1.1}]}}
            />:<Image
            source={require('../../assets/Images/YouEarned.png')}
            style={{transform:[{scale:1.1}]}}
          />}
          </View>
          {index === 3 && (
            <Text style={styles.text2}>{STRINGS.QuoteAuthor}</Text>
          )}
          {index === 2 && (
            <View style={styles.catRow}>
              {budgetExceed?.map(item => (
                <View style={styles.catCtr} key={item?.[0]?.[0] ?? ''}>
                  <View
                    style={[
                      styles.colorBox,
                      {
                        backgroundColor:
                          catIcons[item?.[0]]?.color ?? COLORS.LIGHT[20],
                      },
                    ]}>
                    {catIcons[item?.[0]]?.icon({height: 20, width: 20}) ??
                      ICONS.Money({height: 20, width: 20})}
                  </View>
                  <Text style={styles.catText}>
                    {item[0][0].toUpperCase() + item[0].slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          )}
          {(index === 0 || index === 1) && (
            <Text style={[styles.amt,{marginTop:15}]} numberOfLines={1}>
              {currencies[currency!].symbol}
              {index === 0
                ? (
                    conversion.usd[currency!.toLowerCase()] *
                    Object.values(
                      user?.spend[new Date().getMonth()] ?? [],
                    ).reduce((acc, curr) => acc + curr, 0)
                  )
                    .toFixed(1)
                    .toString()
                : (
                    conversion.usd[currency!.toLowerCase()] *
                    Object.values(
                      user?.income[new Date().getMonth()] ?? [],
                    ).reduce((acc, curr) => acc + curr, 0)
                  )
                    .toFixed(1)
                    .toString()}
            </Text>
          )}
        </View>
        
        {((index === 0 && biggestSpend[0][0] !== '') ||
          (index === 1 && biggestIncome[0][0] !== '')) && (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {index === 0 ? STRINGS.BiggestSpending : STRINGS.BiggestIncome}
            </Text>
            <View style={styles.catCtr}>
              <View
                style={[
                  styles.colorBox,
                  {
                    backgroundColor:
                      index === 0
                        ? catIcons[biggestSpend[0][0]]?.color ??
                          COLORS.LIGHT[20]
                        : catIcons[biggestIncome[0][0]]?.color ??
                          COLORS.LIGHT[20],
                  },
                ]}>
                {index === 0
                  ? catIcons[biggestSpend[0][0]]?.icon({
                      height: 20,
                      width: 20,
                    }) ?? ICONS.Money({height: 20, width: 20})
                  : catIcons[biggestIncome[0][0]]?.icon({
                      height: 20,
                      width: 20,
                    }) ?? ICONS.Money({height: 20, width: 20})}
              </View>
              {(biggestSpend[0][0] !== '' || biggestIncome[0][0] !== '') && (
                <Text style={styles.catText}>
                  {index === 0
                    ? biggestSpend[0][0][0].toUpperCase() +
                      biggestSpend[0][0].slice(1)
                    : biggestIncome[0][0][0].toUpperCase() +
                      biggestIncome[0][0].slice(1)}
                </Text>
              )}
            </View>
            <Text style={styles.amt2} numberOfLines={1}>
              {currencies[currency!].symbol}
              {index === 0
                ? (conversion.usd[currency!.toLowerCase()] * biggestSpend[0][1])
                    .toFixed(1)
                    .toString()
                : (
                    conversion.usd[currency!.toLowerCase()] *
                    biggestIncome[0][1]
                  )
                    .toFixed(1)
                    .toString()}
            </Text>
          </View>
        )}
        {((index === 0 && biggestSpend[0][0] === '') ||
          (index === 1 && biggestIncome[0][0] === '')) && <View />}
        {index === 2 && <View />}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={{
            height: screenHeight,
            width: screenWidth / 2,
          }}
          onPress={() => {
            if (index > 0) {
              setIndex(index => index - 1);
            }
          }}
        />
        <TouchableOpacity
          style={{
            height: screenHeight,
            width: screenWidth / 2,
          }}
          onPress={() => {
            if (index < 3) {
              setIndex(index => index + 1);
            }
          }}
        />
      </View>
      {index === 3 && (
        <View style={{paddingHorizontal: 16}}>
          <CustomButton
            title={STRINGS.SeeFullDetail}
            onPress={() => {
              navigation.replace(NAVIGATION.FinancialReport);
            }}
            backgroundColor={COLOR.LIGHT[100]}
            textColor={COLORS.VIOLET[100]}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
