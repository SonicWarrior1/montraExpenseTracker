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
}: Readonly<{
  props: Readonly<HomeScreenProps>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
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
        style={styles.dropdown}
        renderLeftIcon={() => (
          <View>{ICONS.ArrowDown({width: 15, height: 15,borderColor: COLOR.VIOLET[100],})}</View>
        )}
        renderRightIcon={() => <></>}
        placeholder={STRINGS.Month}
        placeholderStyle={{marginLeft: 10}}
        selectedTextStyle={{marginLeft: 10, color: COLOR.DARK[100]}}
        value={monthData[new Date().getMonth()]}
        data={monthData}
        labelField={'label'}
        valueField={'value'}
        onChange={({value}) => {
          setMonth(value-1);
        }}
        itemTextStyle={{color: COLOR.DARK[100]}}
        containerStyle={{backgroundColor: COLOR.LIGHT[100]}}
        activeColor={COLOR.LIGHT[100]}
      />
      <Pressable
        onPress={() => {
          props.navigation.push(NAVIGATION.Notification);
        }}>
        {ICONS.Notification({height: 25, width: 25})}
        {notifications && (
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

export default HomeHeader;
