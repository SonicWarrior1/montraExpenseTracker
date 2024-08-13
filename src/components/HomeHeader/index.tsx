import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import style from './styles';
import {COLORS} from '../../constants/commonStyles';
import {Dropdown} from 'react-native-element-dropdown';
import {monthData, NAVIGATION, STRINGS} from '../../constants/strings';
import {ICONS} from '../../constants/icons';
import {useAppSelector} from '../../redux/store';
import {HomeScreenProps} from '../../defs/navigation';
import {useAppTheme} from '../../hooks/themeHook';

function HomeHeader({
  props,
  setMonth,
  month,
}: Readonly<{
  props: Readonly<HomeScreenProps>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  month: number;
}>) {
  // redux
  const notifications = useAppSelector(
    state => state.user.currentUser?.notification,
  );
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <View style={styles.ctr}>
      <Pressable
        onPress={() => {
          props.navigation.jumpTo(NAVIGATION.Profile);
        }}>
        <View style={styles.imgCtr}>
          <Image
            source={require('../../assets/Images/profileImg.jpeg')}
            style={styles.img}
          />
        </View>
      </Pressable>
      <Dropdown
        showsVerticalScrollIndicator={false}
        style={styles.dropdown}
        renderLeftIcon={() => (
          <View>
            {ICONS.ArrowDown({
              width: 15,
              height: 15,
              borderColor: COLOR.VIOLET[100],
            })}
          </View>
        )}
        renderRightIcon={() => <></>}
        placeholder={STRINGS.Month}
        placeholderStyle={{marginLeft: 10}}
        selectedTextStyle={{marginLeft: 10, color: COLOR.DARK[100]}}
        value={monthData[month]}
        data={monthData.slice(0, new Date().getMonth() + 1)}
        labelField={'label'}
        valueField={'value'}
        onChange={({value}) => {
          setMonth(value - 1);
        }}
        renderItem={item => {
          return (
            <View
              style={[
                styles.itemCtr,
                {
                  backgroundColor:
                    item.value === month + 1
                      ? COLOR.VIOLET[60]
                      : COLOR.LIGHT[100],
                },
              ]}>
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      item.value === month + 1
                        ? COLORS.LIGHT[100]
                        : COLOR.DARK[100],
                  },
                ]}>
                {item.label}
              </Text>
            </View>
          );
        }}
        autoScroll={false}
        itemTextStyle={{color: COLOR.DARK[100]}}
        containerStyle={{backgroundColor: COLOR.LIGHT[100]}}
        activeColor={COLOR.LIGHT[100]}
      />
      <Pressable
        onPress={() => {
          props.navigation.push(NAVIGATION.Notification);
        }}>
        {ICONS.Notification({height: 25, width: 25})}
        {notifications &&
          Object.values(notifications ?? []).filter(item => !item.read)
            ?.length !== 0 && (
            <View style={styles.notifCount}>
              <Text style={{color: COLORS.VIOLET[100]}}>
                {Object.values(notifications ?? []).filter(item => !item.read)
                  ?.length ?? 0}
              </Text>
            </View>
          )}
      </Pressable>
    </View>
  );
}

export default React.memo(HomeHeader);
