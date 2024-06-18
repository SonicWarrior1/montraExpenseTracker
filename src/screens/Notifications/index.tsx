import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAppSelector} from '../../redux/store';
import {NotificationScreenProps} from '../../defs/navigation';
import {ICONS} from '../../constants/icons';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import style from './styles';
import {encrypt} from '../../utils/encryption';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
import {Swipeable} from 'react-native-gesture-handler';
import Spacer from '../../components/Spacer';

function NotificationScreen({navigation}: Readonly<NotificationScreenProps>) {
  // redux
  const notifications = useAppSelector(
    state => state.user.currentUser?.notification,
  );
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const userDoc = firestore().collection('users').doc(uid);
  // state
  const [menu, setMenu] = useState(false);
  // functions
  const handleMarkRead = useCallback(async () => {
    try {
      const readNotifications = Object.values(notifications!).reduce(
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
          acc[val.id] = {
            ...val,
            category: encrypt(val.category, uid!),
            type: encrypt(val.type, uid!),
            read: true,
          };
          return acc;
        },
        {},
      );
      await userDoc.update({notification: readNotifications});
      setMenu(false);
    } catch (e) {
      console.log(e);
    }
  }, [notifications, uid]);
  const handleDelete = useCallback(() => {
    Alert.alert(
      'Are you sure ?',
      'Are you sure you want to delete all the notifications.',
      [
        {
          text: 'No',
          onPress: () => {
            (async () => {
              console.log('OK Pressed');
            })();
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            (async () => {
              try {
                setMenu(false);
                await userDoc.update({notification: {}});
              } catch (e) {
                console.log(e);
              }
            })();
          },
        },
      ],
    );
  }, [uid]);
  const handleSingleDelete = useCallback(
    (item: {
        category: string;
        type: string;
        id: string;
        time: Timestamp;
        read: boolean;
      }) =>
      async () => {
        try {
          const deletedNotifications = Object.values(notifications!).reduce(
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
              if (val.id !== item.id) {
                acc[val.id] = {
                  ...val,
                  category: encrypt(val.category, uid!),
                  type: encrypt(val.type, uid!),
                  read: true,
                };
              }
              return acc;
            },
            {},
          );
          await userDoc.update({
            notification: deletedNotifications,
          });
        } catch (e) {
          console.log(e);
        }
      },
    [notifications],
  );
  useEffect(() => {
    if (
      Object.values(notifications!).filter(item => item.read === false)
        .length !== 0
    ) {
      handleMarkRead();
    }
  });
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{marginLeft: 15}}>
          {ICONS.ArrowLeft({
            height: 25,
            width: 25,
            color: COLOR.DARK[100],
            borderColor: COLOR.DARK[100],
          })}
        </Pressable>
        <Text style={styles.headerTitle}>{STRINGS.Notifications}</Text>
        {Object.values(notifications!).length === 0 ? (
          <Spacer width={25}></Spacer>
        ) : (
          <Pressable
            style={{marginRight: 15}}
            onPress={() => {
              setMenu(menu => !menu);
            }}>
            {ICONS.More({height: 20, width: 20, color: COLOR.DARK[100]})}
          </Pressable>
        )}
      </View>
      {notifications === undefined ||
      Object.values(notifications).length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.NoNotifText}>{STRINGS.NoNotification}</Text>
        </View>
      ) : (
        <Pressable
          onPress={() => {
            if (menu) {
              setMenu(false);
            }
          }}
          style={{flex: 1}}>
          <FlatList
            data={Object.values(notifications).sort(
              (a, b) => b.time.seconds - a.time.seconds,
            )}
            renderItem={({item}) => {
              return (
                <Swipeable
                  renderRightActions={() => {
                    return (
                      <Pressable
                        style={styles.delete}
                        onPress={handleSingleDelete(item)}>
                        {ICONS.Trash({
                          height: 30,
                          width: 30,
                          color: COLOR.LIGHT[100],
                        })}
                      </Pressable>
                    );
                  }}>
                  <View style={styles.ctr}>
                    <View style={{maxWidth: '85%'}}>
                      <Text style={styles.text1} numberOfLines={1}>
                        {item.type === 'budget-percent'
                          ? `Exceeded ${item.percentage}% of ${
                              item.category[0].toUpperCase() +
                              item.category.slice(1)
                            } budget`
                          : item.category[0].toUpperCase() +
                            item.category.slice(1) +
                            ' Budget Limit Exceeded'}
                      </Text>
                      <Text style={styles.text2}>
                        {item.type === 'budget-percent'
                          ? `You've exceeded ${item.percentage}% of your ${
                              item.category[0].toUpperCase() +
                              item.category.slice(1)
                            } budget. Take action to stay on track.`
                          : 'Your ' +
                            item.category[0].toUpperCase() +
                            item.category.slice(1) +
                            ' ' +
                            STRINGS.BudgetExceed}
                      </Text>
                    </View>
                    <Text style={styles.text2}>
                      {item.time.toDate().getHours()}.
                      {item.time.toDate().getMinutes() < 10
                        ? '0' + item.time.toDate().getMinutes()
                        : item.time.toDate().getMinutes()}
                    </Text>
                  </View>
                </Swipeable>
              );
            }}
          />
        </Pressable>
      )}
      {menu && (
        <View style={styles.menu}>
          {/* <Pressable onPress={handleMarkRead}>
            <Text style={styles.menuText}>{STRINGS.MarkAllRead}</Text>
          </Pressable> */}
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.menuText}>{STRINGS.RemoveAll}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default NotificationScreen;
