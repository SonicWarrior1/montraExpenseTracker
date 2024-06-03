import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, Text, View} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {useAppSelector} from '../../redux/store';
import {NotificationScreenProps} from '../../defs/navigation';
import {ICONS} from '../../constants/icons';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import {UserType} from '../../defs/user';

function NotificationScreen({navigation}: NotificationScreenProps) {
  const notifications = useAppSelector(
    state => state.user.currentUser?.notification,
  );
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const [menu, setMenu] = useState(false);
  // console.log(notifications);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.LIGHT[100]}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{marginLeft: 15}}>
          {ICONS.ArrowLeft({
            height: 25,
            width: 25,
            color: 'black',
            borderColor: 'black',
          })}
        </Pressable>
        <Text style={{fontSize: 18, fontWeight: '600'}}>Notifications</Text>
        <Pressable
          style={{marginRight: 15}}
          onPress={() => {
            setMenu(menu => !menu);
          }}>
          {ICONS.More({height: 20, width: 20})}
        </Pressable>
      </View>
      {notifications === undefined ||
      Object.values(notifications!).length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{fontSize: 14, fontWeight: '500', color: COLORS.DARK[25]}}>
            There is no notification for now
          </Text>
        </View>
      ) : (
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
                    Your{' '}
                    {item.category[0].toUpperCase() + item.category.slice(1)}{' '}
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
      )}
      {menu && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
            position: 'absolute',
            justifyContent: 'space-between',
            alignItems: 'center',
            rowGap: 30,
            backgroundColor: 'white',
            shadowColor: 'grey',
            shadowOpacity: 0.3,
            right: 15,
            top: 90,
            shadowRadius: 5,
            shadowOffset: {
              height: 2,
              width: 1,
            },
          }}>
          <Pressable
            onPress={async () => {
              try {
                const nn = Object.values(notifications!).reduce(
                  (
                    acc: {
                      [key: string]: {
                        category: string;
                        type: string;
                        id: string;
                        time: Timestamp;
                        read: boolean;
                      };
                    },
                    val,
                  ) => {
                    acc[val.id] = {...val, read: true};
                    return acc;
                  },
                  {},
                );
                await firestore()
                  .collection('users')
                  .doc(uid)
                  .update({notification: nn});
                setMenu(false);
              } catch (e) {
                console.log(e);
              }
            }}>
            <Text>Mark all Read</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              try {
                await firestore()
                  .collection('users')
                  .doc(uid)
                  .update({notification: {}});
                setMenu(false);
              } catch (e) {
                console.log(e);
              }
            }}>
            <Text>Remove all</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

export default NotificationScreen;
