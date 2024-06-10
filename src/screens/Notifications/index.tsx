import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, Text, View} from 'react-native';
import {useAppSelector} from '../../redux/store';
import {NotificationScreenProps} from '../../defs/navigation';
import {ICONS} from '../../constants/icons';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import style from './styles';
import {encrypt} from '../../utils/encryption';
import {STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';

function NotificationScreen({navigation}: Readonly<NotificationScreenProps>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const notifications = useAppSelector(
    state => state.user.currentUser?.notification,
  );
  const uid = useAppSelector(state => state.user.currentUser?.uid);
  const [menu, setMenu] = useState(false);

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
      await firestore()
        .collection('users')
        .doc(uid)
        .update({notification: readNotifications});
      setMenu(false);
    } catch (e) {
      console.log(e);
    }
  }, [notifications, uid]);
  const handleDelete = useCallback(async () => {
    try {
      await firestore().collection('users').doc(uid).update({notification: {}});
      setMenu(false);
    } catch (e) {
      console.log(e);
    }
  }, [uid]);
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
        <Pressable
          style={{marginRight: 15}}
          onPress={() => {
            setMenu(menu => !menu);
          }}>
          {ICONS.More({height: 20, width: 20, color: COLOR.DARK[100]})}
        </Pressable>
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
          renderItem={({item}) => {
            return (
              <View style={styles.ctr}>
                <View>
                  <Text style={styles.text1}>
                    {item.category[0].toUpperCase() + item.category.slice(1)}{' '}
                    {STRINGS.BudgetExceed}
                  </Text>
                  <Text style={styles.text2}>
                    Your{' '}
                    {item.category[0].toUpperCase() + item.category.slice(1)}{' '}
                    {STRINGS.BudgetExceed}
                  </Text>
                </View>
                <Text style={styles.text2}>
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
        <View style={styles.menu}>
          <Pressable onPress={handleMarkRead}>
            <Text style={styles.menuText}>{STRINGS.MarkAllRead}</Text>
          </Pressable>
          <Pressable onPress={handleDelete}>
            <Text style={styles.menuText}>{STRINGS.RemoveAll}</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

export default NotificationScreen;
