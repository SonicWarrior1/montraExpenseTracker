import React from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {SettingsScreenProps} from '../../defs/navigation';
import {NAVIGATION} from '../../constants/strings';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import {useAppSelector} from '../../redux/store';

function SettingsScreen({navigation}: SettingsScreenProps) {
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  return (
    <SafeAreaView style={{backgroundColor: COLORS.LIGHT[100], flex: 1}}>
      <Pressable
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          paddingVertical: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.navigate(NAVIGATION.Currency);
        }}>
        <Text style={{fontSize: 16, fontWeight: '500', paddingLeft: 10}}>
          Currency
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{fontSize: 14, fontWeight: '500', color: COLORS.DARK[25]}}>
            {currency}
          </Text>
          {ICONS.ArrowRight({
            height: 22,
            width: 22,
            color: COLORS.VIOLET[100],
            borderColor: COLORS.VIOLET[100],
          })}
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default SettingsScreen;
