import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import CustomDropdown from '../CustomDropDown';
import DatePicker from 'react-native-date-picker';
import CustomButton from '../CustomButton';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import CustomInput from '../CustomInput';
import {monthData, weekData} from '../../constants/strings';
import {repeatDataType} from '../../defs/transaction';
import styles from './styles';

function RepeatTransactionSheet({
  bottomSheetModalRef,
  setRepeatData,
}: Readonly<{
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  setRepeatData: React.Dispatch<
    React.SetStateAction<repeatDataType | undefined>
  >;
}>) {
  const [freq, setFreq] = useState<'yearly' | 'monthly' | 'weekly' | 'daily'>();
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [weekDay, setWeekDay] = useState(1);
  const [end, setEnd] = useState<'date' | 'never'>();
  const [date, setDate] = useState<Date>(new Date());
  const [isDateOpen, setIsDateOpen] = useState(false);

  const snapPoints = useMemo(() => ['40%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const year = new Date().getFullYear();
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
      onChange={handleSheetChanges}>
      <BottomSheetView style={styles.sheetView}>
        <View style={styles.flexRow}>
          <View style={{flex: 1}}>
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
            <View style={{flex: 1}}>
              <CustomDropdown
                data={monthData}
                onChange={val => {
                  setMonth(val.value);
                }}
                placeholder="Month"
                value={month}
              />
            </View>
          )}
          {(freq === 'yearly' || freq === 'monthly') && (
            <View style={{flex: 1}}>
              <CustomDropdown
                data={
                  freq === 'monthly'
                    ? daysInYear[new Date().getMonth()].days.map(day => {
                        return {
                          label: day,
                          value: day,
                        };
                      })
                    : daysInYear[month - 1].days.map(day => {
                        return {
                          label: day,
                          value: day,
                        };
                      })
                }
                onChange={val => {
                  setDay(val.value);
                }}
                placeholder="Day"
                value={day}
              />
            </View>
          )}
          {freq === 'weekly' && (
            <View style={{flex: 1}}>
              <CustomDropdown
                data={weekData}
                onChange={val => {
                  setWeekDay(val.value);
                }}
                placeholder="Day"
                value={weekDay}
              />
            </View>
          )}
        </View>
        <View style={styles.flexRow}>
          <View style={{flex: 1}}>
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
            />
          </View>
          {end === 'date' && (
            <Pressable
              style={{flex: 1}}
              onPress={() => {
                setIsDateOpen(true);
              }}>
              <CustomInput
                value={date.toLocaleDateString()}
                onChangeText={() => {}}
                placeholderText="Date"
                type="name"
                onPress={() => {
                  setIsDateOpen(true);
                }}
                editable={false}
              />
              <DatePicker
                modal
                mode="date"
                date={date ?? new Date()}
                open={isDateOpen}
                maximumDate={new Date('2050-1-1')}
                minimumDate={new Date('1950-1-1')}
                onConfirm={d => {
                  setDate(d);
                  setIsDateOpen(false);
                }}
                onCancel={() => {
                  setIsDateOpen(false);
                }}
                focusable={true}
              />
            </Pressable>
          )}
        </View>
        <CustomButton
          title="Next"
          onPress={() => {
            setRepeatData({
              freq: freq ?? 'daily',
              month: month,
              day: day,
              weekDay: weekDay,
              end: end ?? 'never',
              date: date,
            });
            bottomSheetModalRef.current?.close();
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default RepeatTransactionSheet;
