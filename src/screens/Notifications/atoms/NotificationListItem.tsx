import {Pressable, Text, View} from 'react-native';
import React from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {Timestamp} from '@react-native-firebase/firestore';
import {monthData, STRINGS} from '../../../constants/strings';
import {ICONS} from '../../../constants/icons';
import {useAppTheme} from '../../../hooks/themeHook';
import style from '../styles';

export default function NotificationListItem({
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
          <Text style={styles.text1} numberOfLines={1}>
            {item.type === 'budget-percent'
              ? `Exceeded ${item.percentage}% of ${
                  item.category[0].toUpperCase() + item.category.slice(1)
                } budget`
              : item.category[0].toUpperCase() +
                item.category.slice(1) +
                ' Budget Limit Exceeded'}
          </Text>
          <Text style={styles.text2}>
            {item.type === 'budget-percent'
              ? `You've exceeded ${item.percentage}% of your ${
                  item.category[0].toUpperCase() + item.category.slice(1)
                } budget. Take action to stay on track.`
              : 'Your ' +
                item.category[0].toUpperCase() +
                item.category.slice(1) +
                ' ' +
                STRINGS.BudgetExceed}
          </Text>
        </View>
        <View style={styles.timeCtr}>
          <Text style={styles.text2}>
            {Timestamp.fromMillis(item.time.seconds * 1000)
              .toDate()
              .getHours()}
            .
            {Timestamp.fromMillis(item.time.seconds * 1000)
              .toDate()
              .getMinutes() < 10
              ? '0' +
                Timestamp.fromMillis(item.time.seconds * 1000)
                  .toDate()
                  .getMinutes()
              : Timestamp.fromMillis(item.time.seconds * 1000)
                  .toDate()
                  .getMinutes()}
          </Text>
          <Text style={styles.text2}>
            {Timestamp.fromMillis(item.time.seconds * 1000)
              ?.toDate()
              ?.getDate() +
              ' ' +
              monthData[
                Timestamp.fromMillis(item.time.seconds * 1000)
                  ?.toDate()
                  ?.getMonth()
              ].label +
              ' ' +
              Timestamp.fromMillis(item.time.seconds * 1000)
                ?.toDate()
                ?.getFullYear()}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}
