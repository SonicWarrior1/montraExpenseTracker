import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {useAppSelector} from '../../redux/store';
import LinearGradient from 'react-native-linear-gradient';
import {ICONS} from '../../constants/icons';
import {currencies, monthData, NAVIGATION} from '../../constants/strings';
import {Dropdown} from 'react-native-element-dropdown';
import styles from './styles';
import {COLORS} from '../../constants/commonStyles';
import {HomeScreenProps} from '../../defs/navigation';
import {LineChart} from 'react-native-gifted-charts';

function Home({navigation}: Readonly<HomeScreenProps>) {
  const notifications = useAppSelector(
    state => state.user.currentUser?.notification,
  );
  const conversion = useAppSelector(state => state.transaction.conversion);
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const month = new Date().getMonth();
  const spends = useAppSelector(state => state.user.currentUser?.spend[month]);
  const totalSpend = Object.values(spends ?? [])
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
  const incomes = useAppSelector(
    state => state.user.currentUser?.income[month],
  );
  const totalIncome = Object.values(incomes ?? [])
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <LinearGradient
        colors={['#FFF6E5', '#F8EDD830']}
        style={{
          flex: 1,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          paddingTop: 15,
        }}>
        <SafeAreaView
          style={{
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 2,
                borderWidth: 1,
                borderColor: COLORS.VIOLET[100],
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../assets/Images/profileImg.jpeg')}
                style={{height: 32, width: 32, borderRadius: 30}}
              />
            </View>
            <Dropdown
              style={styles.dropdown}
              renderLeftIcon={() => (
                <View>{ICONS.ArrowDown({width: 15, height: 15})}</View>
              )}
              renderRightIcon={() => <></>}
              placeholder="Month"
              placeholderStyle={{marginLeft: 10}}
              selectedTextStyle={{marginLeft: 10}}
              value={monthData[new Date().getMonth()]}
              data={monthData}
              labelField={'label'}
              valueField={'value'}
              onChange={() => {}}
            />
            <Pressable
              onPress={() => {
                navigation.push(NAVIGATION.Notification);
              }}>
              {ICONS.Notification({height: 25, width: 25})}
              {notifications && (
                <View
                  style={{
                    padding: 1,
                    height: 20,
                    width: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    backgroundColor: COLORS.LIGHT[100],
                    position: 'absolute',
                    top: 15,
                    left: -5,
                  }}>
                  <Text style={{color: COLORS.VIOLET[100]}}>
                    {
                      Object.values(notifications).filter(item => !item.read)
                        .length
                    }
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.DARK[25],
              marginTop: 15,
            }}>
            Account Balance
          </Text>
          <Text style={{fontSize: 40, fontWeight: '600', marginTop: 8}}>
            {currencies[currency!].symbol}
            {(conversion['usd']?.[currency!.toLowerCase()!] * 9400)
              .toFixed(2)
              .toString()}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              paddingHorizontal: 15,
              columnGap: 10,
              marginTop: 25,
            }}>
            <View
              style={[styles.moneyCtr, {backgroundColor: COLORS.GREEN[100]}]}>
              <View style={styles.iconCtr}>
                {ICONS.Income({
                  height: 25,
                  width: 25,
                  color: COLORS.GREEN[100],
                })}
              </View>
              <View>
                <Text style={styles.text1}>Income</Text>
                <Text style={styles.text2}>
                  {currencies[currency!].symbol}
                  {(
                    conversion['usd']?.[currency!.toLowerCase()!] *
                    Number(totalIncome)
                  )
                    .toFixed(2)
                    .toString()}
                </Text>
              </View>
            </View>
            <View style={[styles.moneyCtr, {backgroundColor: COLORS.RED[100]}]}>
              <View style={styles.iconCtr}>
                {ICONS.Expense({
                  height: 25,
                  width: 25,
                  color: COLORS.RED[100],
                })}
              </View>
              <View>
                <Text style={styles.text1}>Expense</Text>
                <Text style={styles.text2}>
                  {currencies[currency!].symbol}
                  {(
                    conversion['usd']?.[currency!.toLowerCase()!] *
                    Number(totalSpend)
                  )
                    .toFixed(2)
                    .toString()}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <View style={{flex: 1.4}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          {/* <LineChart
            data={[{value: 0}, {value: 100}, ...totalSpend]}
            areaChart
            adjustToWidth
            startFillColor1={COLORS.VIOLET[40]}
            animateOnDataChange
            isAnimated={true}
            width={Dimensions.get('screen').width}
            hideDataPoints
            thickness={10}
            hideRules
            hideYAxisText
            hideAxesAndRules
            color={COLORS.VIOLET[100]}
            curveType={0}
            curved={true}
          /> */}
        </View>
      </View>
    </View>
  );
}

export default Home;
