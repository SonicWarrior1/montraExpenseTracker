import React, {useCallback, useEffect} from 'react';
import {Alert, Pressable, Text, View} from 'react-native';
import {Switch} from 'react-native-switch';
import {monthData, weekData} from '../../../constants/strings';
import {COLORS} from '../../../constants/commonStyles';
import Spacer from '../../../components/Spacer';
import {Timestamp} from '@react-native-firebase/firestore';
import {useAppTheme} from '../../../hooks/themeHook';
import style from '../styles';
import {repeatDataType} from '../../../defs/transaction';
import {RepeatDataModel} from '../../../DbModels/RepeatDataModel';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import { STRINGS } from '../../../localization';

function RepeatInput({
  pageType,
  repeatData,
  setRepeatData,
  repeatSheetRef,
  isEdit,
  isSwitchOn,
  setIsSwitchOn,
  firstTime,
}: Readonly<{
  pageType: 'expense' | 'income' | 'transfer';
  repeatData: repeatDataType | RepeatDataModel | undefined;
  setRepeatData: React.Dispatch<
    React.SetStateAction<repeatDataType | RepeatDataModel | undefined>
  >;
  repeatSheetRef: React.RefObject<BottomSheetModalMethods>;
  isEdit: boolean;
  isSwitchOn: boolean;
  setIsSwitchOn: React.Dispatch<React.SetStateAction<boolean>>;
  firstTime: boolean;
}>) {
  const getDate = useCallback(() => {
    if (repeatData) {
      if (isEdit) {
        if ((repeatData.date as Timestamp)?.seconds !== undefined) {
          return (
            Timestamp.fromMillis((repeatData.date as Timestamp)?.seconds * 1000)
              ?.toDate()
              ?.getDate() +
            ' ' +
            monthData(STRINGS)[
              Timestamp.fromMillis(
                (repeatData.date as Timestamp)?.seconds * 1000,
              )
                ?.toDate()
                ?.getMonth()
            ].label +
            ' ' +
            Timestamp.fromMillis((repeatData.date as Timestamp)?.seconds * 1000)
              ?.toDate()
              ?.getFullYear()
          );
        } else {
          return (
            (repeatData.date as Date)?.getDate() +
            ' ' +
            monthData(STRINGS)[(repeatData.date as Date)?.getMonth()].label +
            ' ' +
            (repeatData.date as Date)?.getFullYear()
          );
        }
      } else {
        return (
          (repeatData.date as Date)?.getDate() +
          ' ' +
          monthData(STRINGS)[(repeatData.date as Date)?.getMonth()].label +
          ' ' +
          (repeatData.date as Date)?.getFullYear()
        );
      }
    }
  }, [isEdit, repeatData]);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  useEffect(() => {
    console.log(isSwitchOn, firstTime);
    if (isSwitchOn && !firstTime) {
      repeatSheetRef.current?.present();
    } else if (!isSwitchOn) {
      setRepeatData(undefined);
    }
  }, [isSwitchOn]);
  return (
    <>
      {pageType !== 'transfer' && (
        <>
          <View style={styles.flexRow}>
            <View>
              <Text style={styles.flexRowText1}>{STRINGS.Repeat}</Text>
              <Text style={styles.flexRowText2}>
                {repeatData
                  ? 'Repeat transaction, set your own time'
                  : STRINGS.RepeatTransaction}
              </Text>
            </View>
            <Switch
              backgroundActive={COLORS.VIOLET[100]}
              backgroundInactive={COLORS.VIOLET[20]}
              activeText=""
              inActiveText=""
              barHeight={30}
              circleSize={24}
              switchBorderRadius={16}
              innerCircleStyle={{width: 24, height: 24}}
              switchLeftPx={5}
              switchRightPx={5}
              circleBorderWidth={0}
              onValueChange={val => {
                if (!val) {
                  Alert.alert(
                    'Clearing Repeat Transaction Frequency',
                    'Are you sure you want to clear the repeat transaction frequency?',
                    [
                      {
                        text: 'Cancel',
                      },
                      {
                        text: 'Ok',
                        onPress: () => {
                          setIsSwitchOn(false);
                        },
                      },
                    ],
                  );
                } else {
                  setIsSwitchOn(true);
                }
              }}
              value={isSwitchOn}
            />
          </View>
          <Spacer height={20} />
        </>
      )}
      {repeatData && (
        <View style={styles.flexRow}>
          <View>
            <Text style={styles.flexRowText1}>{STRINGS.Frequency}</Text>
            <Text style={styles.flexRowText2}>
              {repeatData.freq[0].toUpperCase() + repeatData.freq.slice(1)}
              {repeatData.freq !== 'daily' && ' - '}
              {repeatData.freq === 'yearly' &&
                monthData(STRINGS)[repeatData.month! - 1].label}{' '}
              {(repeatData.freq === 'yearly' ||
                repeatData.freq === 'monthly') &&
                repeatData.day}
              {repeatData.freq === 'weekly' &&
                weekData(STRINGS)[repeatData.weekDay].label}
            </Text>
          </View>
          {/* {repeatData.end === 'date' && ( */}
          <View>
            <Text style={styles.flexRowText1}>{STRINGS.EndAfter}</Text>
            <Text style={styles.flexRowText2}>
              {repeatData.end === 'date' ? getDate() : 'Never'}
            </Text>
          </View>
          {/* )} */}
          <Pressable
            style={styles.editBtn}
            onPress={() => {
              repeatSheetRef.current?.present();
            }}>
            <Text style={styles.editBtnText}>{STRINGS.Edit}</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

export default React.memo(RepeatInput);
