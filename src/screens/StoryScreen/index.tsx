/* eslint-disable react-native/no-inline-styles */
import {Dimensions, SafeAreaView, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from '../../constants/commonStyles';
import styles from './styles';
import {catIcons, ICONS} from '../../constants/icons';
import CustomButton from '../../components/CustomButton';
import {StoryScreenProps} from '../../defs/navigation';
import {useAppSelector} from '../../redux/store';
import {currencies, NAVIGATION} from '../../constants/strings';

export default function StoryScreen({navigation}: StoryScreenProps) {
  const screenHeight = Dimensions.get('screen').height;
  const screenWidth = Dimensions.get('screen').width;
  const user = useAppSelector(state => state.user.currentUser);
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
  console.log(biggestIncome, biggestSpend, budgetExceed);
  const conversion = useAppSelector(state => state.transaction.conversion);
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const [index, setIndex] = useState(0);
  console.log('dsijfefmiosdmfsdmo', biggestSpend, biggestIncome);
  return (
    <SafeAreaView
      style={[
        styles.safeView,
        {
          backgroundColor:
            index === 0
              ? COLORS.RED[100]
              : index === 1
              ? COLORS.GREEN[100]
              : COLORS.VIOLET[100],
        },
      ]}>
      <View style={styles.progressRow}>
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 0 ? 1 : 0.6,
            },
          ]}
        />
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 1 ? 1 : 0.6,
            },
          ]}
        />
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 2 ? 1 : 0.6,
            },
          ]}
        />
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 3 ? 1 : 0.6,
            },
          ]}
        />
      </View>
      <View style={styles.mainView}>
        {index !== 3 && <Text style={styles.title}>This Month</Text>}
        <View style={{alignItems: 'center'}}>
          <Text
            style={[
              styles.text1,
              {
                paddingHorizontal: index === 3 ? 0 : 40,
                marginTop: index === 3 ? 150 : 0,
              },
            ]}>
            {index === 0
              ? 'You Spend 💸'
              : index === 1
              ? 'You Earned 💰'
              : index === 2
              ? (budgetExceed === undefined ? 0 : budgetExceed.length) +
                ' of 12 Budget is exceeds the limit'
              : '“Financial freedom is freedom from fear.”'}
          </Text>
          {index === 3 && <Text style={styles.text2}>-Robert Kiyosaki</Text>}
          {index === 2 && (
            <View style={styles.catRow}>
              {budgetExceed !== undefined &&
                budgetExceed.map(item => (
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
            <Text style={styles.amt}>
              {currencies[currency!].symbol}
              {index === 0
                ? (
                    conversion['usd'][currency!.toLowerCase()!] *
                    Object.values(
                      user?.spend[new Date().getMonth()] ?? [],
                    ).reduce((acc, curr) => acc + curr, 0)
                  )
                    .toFixed(2)
                    .toString()
                : (
                    conversion['usd'][currency!.toLowerCase()!] *
                    Object.values(
                      user?.income[new Date().getMonth()] ?? [],
                    ).reduce((acc, curr) => acc + curr, 0)
                  )
                    .toFixed(2)
                    .toString()}
            </Text>
          )}
        </View>
        {((index === 0 && biggestSpend[0][0] !== '') ||
          (index === 1 && biggestIncome[0][0] !== '')) && (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {index === 0
                ? 'and your biggest spending is from'
                : 'your biggest Income is from'}
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
            <Text style={styles.amt2}>
              {currencies[currency!].symbol}
              {index === 0
                ? (
                    conversion['usd'][currency!.toLowerCase()!] *
                    biggestSpend[0][1]
                  )
                    .toFixed(2)
                    .toString()
                : (
                    conversion['usd'][currency!.toLowerCase()!] *
                    biggestIncome[0][1]
                  )
                    .toFixed(2)
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
            console.log('left');
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
            console.log('right');
            if (index < 3) {
              setIndex(index => index + 1);
            }
          }}
        />
      </View>
      {index === 3 && (
        <View style={{paddingHorizontal: 16}}>
          <CustomButton
            title="See the full detail"
            onPress={() => {
              navigation.replace(NAVIGATION.FinancialReport);
            }}
            backgroundColor={COLORS.LIGHT[100]}
            textColor={COLORS.VIOLET[100]}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
