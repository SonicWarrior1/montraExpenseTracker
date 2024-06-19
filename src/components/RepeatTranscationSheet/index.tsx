import React, {useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import style from './styles';
import CustomDropdown from '../CustomDropDown';
import CustomButton from '../CustomButton';
import CustomInput from '../CustomInput';
import {monthData, STRINGS, weekData} from '../../constants/strings';
import {repeatDataType} from '../../defs/transaction';
import SheetBackdrop from '../SheetBackDrop';
import {useAppTheme} from '../../hooks/themeHook';
// Third party Libraries
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import DatePicker from 'react-native-date-picker';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {AnimatedEmptyError, EmptyError} from '../../constants/errors';
import Spacer from '../Spacer';

function RepeatTransactionSheet({
  bottomSheetModalRef,
  setRepeatData,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  setRepeatData: React.Dispatch<
    React.SetStateAction<repeatDataType | undefined>
  >;
}>) {
  // state
  const [freq, setFreq] = useState<'yearly' | 'monthly' | 'weekly' | 'daily'>();
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [weekDay, setWeekDay] = useState(1);
  const [end, setEnd] = useState<'date' | 'never'>();
  const [date, setDate] = useState<Date>(new Date());
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [formkey, setFormkey] = useState(false);
  // constants
  const snapPoints = useMemo(() => ['40%'], []);
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
      }}>
      <BottomSheetView style={styles.sheetView}>
        <View style={styles.flexRow}>
          <View style={[styles.flex, {minWidth: 35}]}>
            <CustomDropdown
              data={[
                {label: 'Yearly', value: 'yearly'},
                {label: 'Monthly', value: 'monthly'},
                {label: 'Weekly', value: 'weekly'},
                {label: 'Daily', value: 'daily'},
              ]}
              onChange={val => {
                setFreq(val.value);
              }}
              placeholder="Frequency"
              value={freq}
            />
          </View>
          {freq === 'yearly' && (
            <View style={[styles.flex, {minWidth: 70}]}>
              <CustomDropdown
                data={monthData}
                onChange={val => {
                  setMonth(val.value);
                }}
                placeholder={STRINGS.Month}
                value={month}
              />
            </View>
          )}
          {(freq === 'yearly' || freq === 'monthly') && (
            <View style={styles.flex}>
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
                }}
                placeholder={STRINGS.Day}
                value={day}
              />
            </View>
          )}
          {freq === 'weekly' && (
            <View style={styles.flex}>
              <CustomDropdown
                data={weekData}
                onChange={val => {
                  setWeekDay(val.value);
                }}
                placeholder={STRINGS.Day}
                value={weekDay}
              />
            </View>
          )}
        </View>
        <AnimatedEmptyError
          errorText="Please select an option"
          value={freq ?? ''}
          formKey={formkey}
        />
        <View style={styles.flexRow}>
          <View style={styles.flex}>
            <CustomDropdown
              data={[
                {label: 'Never', value: 'never'},
                {label: 'Date', value: 'date'},
              ]}
              onChange={val => {
                setEnd(val.value);
              }}
              placeholder="End After"
              value={end}
              disable={freq===undefined}
            />
          </View>
          {end === 'date' && (
            <Pressable
              style={styles.flex}
              onPress={() => {
                setIsDateOpen(true);
              }}>
              <CustomInput
                value={date.toLocaleDateString()}
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
                date={date ?? new Date()}
                open={isDateOpen}
                maximumDate={new Date('2050-1-1')}
                minimumDate={new Date()}
                onConfirm={d => {
                  setDate(d);
                  setIsDateOpen(false);
                }}
                onCancel={() => {
                  setIsDateOpen(false);
                }}
              />
            </Pressable>
          )}
        </View>
        <Spacer height={10} />
        <CustomButton
          title={STRINGS.Next}
          onPress={() => {
            setFormkey(true);
            if (freq) {
              setRepeatData({
                freq: freq ?? 'daily',
                month: month,
                day: day,
                weekDay: weekDay,
                end: end ?? 'never',
                date: date,
              });
              bottomSheetModalRef.current?.close();
            }
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default RepeatTransactionSheet;
