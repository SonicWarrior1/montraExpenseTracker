import React, {useEffect} from 'react';
import {FlatList, Pressable, SafeAreaView, Text, View} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {useAppSelector} from '../../redux/store';
import {NotificationScreenProps} from '../../defs/navigation';
import {ICONS} from '../../constants/icons';

function NotificationScreen({navigation}: NotificationScreenProps) {
  const notifications = useAppSelector(
    state => state.user.currentUser?.notification,
  );
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable style={{marginRight: 15}}>
            {ICONS.More({height: 20, width: 20})}
          </Pressable>
        );
      },
    });
  }, []);
  console.log(notifications);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.LIGHT[100]}}>
      <FlatList
        data={Object.values(notifications!).sort(
          (a, b) => b.time.seconds - a.time.seconds,
        )}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderColor: COLORS.LIGHT[20],
                paddingVertical: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  {item.category[0].toUpperCase() + item.category.slice(1)}{' '}
                  budget has exceeded the limit
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: COLORS.DARK[25],
                    marginTop: 5,
                  }}>
                  Your {item.category[0].toUpperCase() + item.category.slice(1)}{' '}
                  budget has exceeded the limit
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: COLORS.DARK[25],
                }}>
                {item.time.toDate().getHours()}.
                {item.time.toDate().getMinutes() < 10
                  ? '0' + item.time.toDate().getMinutes()
                  : item.time.toDate().getMinutes()}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

export default NotificationScreen;
