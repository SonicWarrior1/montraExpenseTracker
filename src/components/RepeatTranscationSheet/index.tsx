import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Dimensions, Pressable, View} from 'react-native';
import style from './styles';
import CustomDropdown from '../CustomDropDown';
import CustomButton from '../CustomButton';
import CustomInput from '../CustomInput';
import {
  EndDropdownData,
  FreqDropdownData,
  monthData,
  weekData,
} from '../../constants/strings';
import {repeatDataType} from '../../defs/transaction';
import SheetBackdrop from '../SheetBackDrop';
import {useAppTheme} from '../../hooks/themeHook';
// Third party Libraries
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import DatePicker from 'react-native-date-picker';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {AnimatedEmptyError} from '../../constants/errors';
import Spacer from '../Spacer';
import {RepeatDataModel} from '../../DbModels/RepeatDataModel';
import {Timestamp} from '@react-native-firebase/firestore';
import {ICONS} from '../../constants/icons';
import {PlaceholderTextColor} from '../../constants/commonStyles';
import {isTablet} from 'react-native-device-info';
import {STRINGS} from '../../localization';

function RepeatTransactionSheet({
  bottomSheetModalRef,
  setRepeatData,
  repeatData,
  setIsSwitchOn,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  setRepeatData: React.Dispatch<
    React.SetStateAction<repeatDataType | RepeatDataModel | undefined>
  >;
  repeatData?: repeatDataType | RepeatDataModel;
  setIsSwitchOn: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const getDate = useCallback(() => {
    if (repeatData?.date) {
      if ((repeatData?.date as Timestamp)?.seconds) {
        return Timestamp.fromMillis(
          (repeatData?.date as Timestamp)?.seconds * 1000,
        ).toDate();
      } else {
        return repeatData?.date as Date;
      }
    } else {
      return undefined;
    }
  }, [repeatData]);
  // state
  type freqType = 'yearly' | 'monthly' | 'weekly' | 'daily';
  const [freq, setFreq] = useState<freqType>(
    (repeatData?.freq as freqType) ?? undefined,
  );
  const [month, setMonth] = useState<number>(repeatData?.month ?? 1);
  const [day, setDay] = useState<number>(repeatData?.day ?? 1);
  const [weekDay, setWeekDay] = useState<number>(repeatData?.weekDay ?? 1);
  const [end, setEnd] = useState<'date' | 'never'>(
    (repeatData?.end as 'date' | 'never') ?? undefined,
  );
  const [date, setDate] = useState<Date | undefined>(getDate());
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
  const [formkey, setFormkey] = useState<boolean>(false);
  const [myDate, setMyDate] = useState<Date>();
  // constants
  const snapPoints = useMemo(() => ['35%'], []);
  const year = new Date().getFullYear();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // functions
  const generateDaysInYear = useMemo(() => {
    const daysInYear = [];
    for (let month = 1; month <= 12; month++) {
      let daysInMonth;
      if (month === 2) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          daysInMonth = 29;
        } else {
          daysInMonth = 28;
        }
      } else {
        daysInMonth = new Date(year, month, 0).getDate();
      }
      const daysArray = [];
      for (let day = 1; day <= daysInMonth; day++) {
        daysArray.push(day);
      }
      daysInYear.push({
        month: month,
        days: daysArray,
      });
    }
    return daysInYear;
  }, [year]);
  useEffect(() => {
    let x = new Date(`${new Date().getFullYear()}-${month}-${day}`);
    if (freq === 'monthly') {
      x = new Date(new Date().getFullYear(), new Date().getMonth(), day);
    }
    setMyDate(x);
  }, [month, day, freq]);
  useEffect(() => {
    setFreq((repeatData?.freq as freqType) ?? undefined);
    setMonth(repeatData?.month ?? 1);
    setDay(repeatData?.day ?? 1);
    setWeekDay(repeatData?.weekDay ?? 1);
    setEnd((repeatData?.end as 'date' | 'never') ?? undefined);
    setDate(getDate());
  }, [repeatData, getDate]);
  const daysInYear = generateDaysInYear;
  return (
    <BottomSheetModal
      enablePanDownToClose
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.sheetBack}
      handleIndicatorStyle={{backgroundColor: COLOR.VIOLET[40]}}
      onDismiss={() => {
        setFormkey(false);
        if (repeatData === undefined) {
          setIsSwitchOn(false);
        }
        setFreq((repeatData?.freq as freqType) ?? undefined);
        setMonth(repeatData?.month ?? 1);
        setDay(repeatData?.day ?? 1);
        setWeekDay(repeatData?.weekDay ?? 1);
        setEnd((repeatData?.end as 'date' | 'never') ?? undefined);
        setDate(getDate());
      }}>
      <BottomSheetView style={styles.sheetView}>
        <View style={styles.flexRow}>
          <View style={[styles.flex, {minWidth: 45}]}>
            <CustomDropdown
              data={FreqDropdownData(STRINGS)}
              onChange={val => {
                setFreq(val.value);
                setDate(undefined);
              }}
              placeholder={STRINGS.Frequency}
              value={freq}
            />
          </View>
          {freq === 'yearly' && (
            <View style={[styles.flex, {minWidth: 70}]}>
              <CustomDropdown
                data={monthData(STRINGS)}
                onChange={val => {
                  setMonth(val.value);
                  setDate(undefined);
                }}
                placeholder={STRINGS.Month}
                value={month}
              />
            </View>
          )}
          {(freq === 'yearly' || freq === 'monthly') && (
            <View style={[styles.flex, {minWidth: 24}]}>
              <CustomDropdown
                data={
                  freq === 'monthly'
                    ? daysInYear[new Date().getMonth()].days.map(day => {
                        return {
                          label: String(day),
                          value: day,
                        };
                      })
                    : daysInYear[month - 1].days.map(day => {
                        return {
                          label: String(day),
                          value: day,
                        };
                      })
                }
                onChange={val => {
                  setDay(val.value);
                  setDate(undefined);
                }}
                placeholder={STRINGS.Day}
                value={day}
              />
            </View>
          )}
          {freq === 'weekly' && (
            <View style={styles.flex}>
              <CustomDropdown
                data={weekData(STRINGS)}
                onChange={val => {
                  setWeekDay(val.value);
                  setDate(undefined);
                }}
                placeholder={STRINGS.Day}
                value={weekDay}
              />
            </View>
          )}
        </View>
        <AnimatedEmptyError
          errorText={STRINGS.PleaseSelectOption}
          value={freq ?? ''}
          formKey={formkey}
        />
        <View style={styles.flexRow}>
          <View style={styles.flex}>
            <CustomDropdown
              data={EndDropdownData(STRINGS)}
              onChange={val => {
                setEnd(val.value);
              }}
              placeholder={STRINGS.EndAfter}
              value={end}
              dropdownPosition="top"
              // disable={freq === undefined}
            />
          </View>
          {end === 'date' && (
            <Pressable
              style={styles.flex}
              onPress={() => {
                setIsDateOpen(true);
              }}>
              <CustomInput
                value={date?.toLocaleDateString() ?? ''}
                onChangeText={() => {}}
                placeholderText={STRINGS.Date}
                type="name"
                onPress={() => {
                  setIsDateOpen(true);
                }}
                editable={false}
                inputColor={COLOR.DARK[100]}
              />
              <DatePicker
                modal
                mode="date"
                date={
                  date ??
                  (freq === 'yearly' || freq === 'monthly'
                    ? myDate ?? new Date()
                    : new Date())
                }
                open={isDateOpen}
                maximumDate={new Date('2050-1-1')}
                minimumDate={
                  freq === 'yearly' || freq === 'monthly' ? myDate : new Date()
                }
                onConfirm={d => {
                  setDate(d);
                  setIsDateOpen(false);
                }}
                onCancel={() => {
                  setIsDateOpen(false);
                }}
              />
              <View
                style={[
                  styles.calender,
                  {
                    top:
                      Dimensions.get('screen').width *
                      0.15 *
                      (isTablet() ? 0.36 : 0.31),
                  },
                ]}>
                {ICONS.Calender({
                  height: 20,
                  width: 20,
                  color: PlaceholderTextColor,
                })}
              </View>
            </Pressable>
          )}
        </View>
        {end === undefined ? (
          <AnimatedEmptyError
            errorText={STRINGS.PleaseSelectOption}
            value={end ?? ''}
            formKey={formkey}
          />
        ) : (
          end === 'date' && (
            <AnimatedEmptyError
              errorText={STRINGS.PleaseSelectDate}
              value={date?.toLocaleDateString() ?? ''}
              formKey={formkey}
            />
          )
        )}
        <Spacer height={10} />
        <CustomButton
          title={STRINGS.Next}
          onPress={() => {
            setFormkey(true);
            if (freq && end) {
              if (end === 'date' && date === undefined) {
                return true;
              }
              setRepeatData({
                freq: freq ?? 'daily',
                month: month,
                day: day,
                weekDay: weekDay,
                end: end ?? 'never',
                date: date ?? new Date(),
              });
              setIsSwitchOn(true);
              bottomSheetModalRef.current?.dismiss();
            }
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default React.memo(RepeatTransactionSheet);
