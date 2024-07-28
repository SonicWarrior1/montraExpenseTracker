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
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {NotificationScreenProps} from '../../defs/navigation';
import {ICONS} from '../../constants/icons';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import style from './styles';
import {encrypt} from '../../utils/encryption';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
import Spacer from '../../components/Spacer';
import {useNetInfo} from '@react-native-community/netinfo';
import {useRealm} from '@realm/react';
import {UpdateMode} from 'realm';
import {updateNotification} from '../../redux/reducers/userSlice';
import NotificationListItem from './atoms/NotificationListItem';

function NotificationScreen({navigation}: Readonly<NotificationScreenProps>) {
  // redux
  const notifications = useAppSelector(
    state => state.user.currentUser?.notification,
  );
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const dispatch = useAppDispatch();
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const userDoc = firestore().collection('users').doc(uid);
  const {isConnected} = useNetInfo();
  const realm = useRealm();

  // state
  const [menu, setMenu] = useState<boolean>(false);
  // functions
  const handleMarkRead = useCallback(async () => {
    try {
      if (!isConnected) {
        for (const item of Object.values(notifications!)) {
          dispatch(updateNotification({type: 'read', id: item.id}));
          realm.write(() => {
            realm.create(
              'notification',
              {
                ...item,
                read: true,
              },
              UpdateMode.All,
            );
          });
        }
      } else {
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
      }
      setMenu(false);
    } catch (e) {}
  }, [notifications, uid, isConnected, userDoc]);
  const handleDelete = useCallback(() => {
    Alert.alert(STRINGS.AreYouSure, STRINGS.AreYouSureDelete, [
      {
        text: STRINGS.No,
        onPress: () => {
          (async () => {
            setMenu(false);
            console.log('OK Pressed');
          })();
        },
      },
      {
        text: STRINGS.Yes,
        onPress: () => {
          (async () => {
            try {
              setMenu(false);
              if (!isConnected) {
                for (const item of Object.values(notifications!)) {
                  dispatch(updateNotification({type: 'delete', id: item.id}));
                  realm.write(() => {
                    realm.create(
                      'notification',
                      {
                        ...item,
                        deleted: true,
                      },
                      UpdateMode.All,
                    );
                  });
                }
              } else {
                await userDoc.update({notification: {}});
              }
            } catch (e) {
              console.log(e);
            }
          })();
        },
      },
    ]);
  }, [uid, isConnected, notifications, userDoc]);
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
          if (!isConnected) {
            dispatch(updateNotification({type: 'delete', id: item.id}));
            realm.write(() => {
              realm.create(
                'notification',
                {
                  ...item,
                  deleted: true,
                },
                UpdateMode.All,
              );
            });
          } else {
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
          }
        } catch (e) {
          console.log(e);
        }
      },
    [notifications, isConnected, userDoc, uid],
  );
  useEffect(() => {
    if (
      Object.values(notifications!).filter(item => item.read === false)
        .length !== 0
    ) {
      handleMarkRead();
    }
  }, [notifications]);
  return (
    <SafeAreaView style={styles.safeView}>
      <Pressable
        onPress={() => {
          if (menu) {
            setMenu(false);
          }
        }}
        style={styles.safeView}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            {ICONS.ArrowLeft({
              height: 25,
              width: 25,
              color: COLOR.DARK[100],
              borderColor: COLOR.DARK[100],
            })}
          </Pressable>
          <Text style={styles.headerTitle}>{STRINGS.Notifications}</Text>
          {Object.values(notifications!).length === 0 ? (
            <Spacer width={25} />
          ) : (
            <Pressable
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
          <FlatList
            data={Object.values(notifications).sort(
              (a, b) => b.time.seconds - a.time.seconds,
            )}
            renderItem={({item}) => (
              <NotificationListItem
                handleSingleDelete={handleSingleDelete}
                item={item}
              />
            )}
          />
        )}
        {menu && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.menuText}>{STRINGS.ClearAll}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

export default React.memo(NotificationScreen);
