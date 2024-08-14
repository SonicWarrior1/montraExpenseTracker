import {Pressable, Text, View} from 'react-native';
import React from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {Timestamp} from '@react-native-firebase/firestore';
import {monthData} from '../../../constants/strings';
import {ICONS} from '../../../constants/icons';
import {useAppTheme} from '../../../hooks/themeHook';
import style from '../styles';
import {formatAMPM} from '../../../utils/firebase';
import {convertNotificationText, STRINGS} from '../../../localization';

function NotificationListItem({
  item,
  handleSingleDelete,
}: Readonly<{
  item: {
    category: string;
    type: string;
    id: string;
    time: Timestamp;
    read: boolean;
    percentage: number;
  };
  handleSingleDelete: ({
    category,
    type,
    id,
    time,
    read,
    percentage,
  }: {
    category: string;
    type: string;
    id: string;
    time: Timestamp;
    read: boolean;
    percentage: number;
  }) => () => void;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <Swipeable
      renderRightActions={() => {
        return (
          <Pressable style={styles.delete} onPress={handleSingleDelete(item)}>
            {ICONS.Trash({
              height: 30,
              width: 30,
              color: COLOR.LIGHT[100],
            })}
          </Pressable>
        );
      }}>
      <View style={styles.ctr}>
        <View style={styles.textCtr}>
          <Text style={styles.text1}>
            {item.type === 'budget-percent'
              ? convertNotificationText(STRINGS, item.category, 1,item.percentage)
              : convertNotificationText(STRINGS, item.category,1)}
          </Text>
          <Text style={styles.text2}>
            {item.type === 'budget-percent'
              ? convertNotificationText(STRINGS, item.category, 2,item.percentage)
              : convertNotificationText(STRINGS, item.category, 2)}
          </Text>
        </View>
        <View style={styles.timeCtr}>
          <Text style={styles.text2}>
            {formatAMPM(
              Timestamp.fromMillis(item.time.seconds * 1000).toDate(),
            )}
          </Text>
          <Text style={[styles.text2, {textAlign: 'right'}]}>
            {Timestamp.fromMillis(item.time.seconds * 1000)
              ?.toDate()
              ?.getDate() +
              ' ' +
              monthData(STRINGS)[
                Timestamp.fromMillis(item.time.seconds * 1000)
                  ?.toDate()
                  ?.getMonth()
              ].label +
              '\n' +
              Timestamp.fromMillis(item.time.seconds * 1000)
                ?.toDate()
                ?.getFullYear()}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}

export default React.memo(NotificationListItem);
