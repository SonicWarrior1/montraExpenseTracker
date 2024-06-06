import React from 'react';
import {COLORS} from '../../constants/commonStyles';
import {Image, Pressable, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {monthData, NAVIGATION} from '../../constants/strings';
import {ICONS} from '../../constants/icons';
import styles from './styles';
import {useAppSelector} from '../../redux/store';
import { HomeScreenProps } from '../../defs/navigation';

function HomeHeader({navigation}:Readonly<HomeScreenProps>) {
  const notifications = useAppSelector(
    state => state.user.currentUser?.notification,
  );
  return (
    <View
      style={styles.ctr}>
      <View
        style={styles.imgCtr}>
        <Image
          source={require('../../assets/Images/profileImg.jpeg')}
          style={styles.img}
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
                Object.values(notifications ?? []).filter(item => !item.read)
                  .length
              }
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

export default HomeHeader;
