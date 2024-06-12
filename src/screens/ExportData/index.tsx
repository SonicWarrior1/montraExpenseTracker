import React, {useCallback, useState} from 'react';
import {Platform, SafeAreaView, Text, View} from 'react-native';
import style from './styles';
import {useAppSelector} from '../../redux/store';
import {monthData, STRINGS, weekData} from '../../constants/strings';
import CustomDropdown from '../../components/CustomDropDown';
import CustomButton from '../../components/CustomButton';
import {ICONS} from '../../constants/icons';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {Timestamp} from '@react-native-firebase/firestore';
import {jsonToCSV} from 'react-native-csv';
import ReactNativeBlobUtil from 'react-native-blob-util';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
function ExportData() {
  // redux
  const data = useAppSelector(state => state.transaction.transactions);
  // state
  const [dataType, setDataType] = useState<'all' | 'expense' | 'income'>('all');
  const [dataRange, setDataRange] = useState<7 | 15 | 30>(7);
  const [dataFormat, setDataFormat] = useState<'csv' | 'pdf'>('csv');
  // functions
  const handleExport = useCallback(async () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - dataRange);
    const x = jsonToCSV(
      Object.values(data)
        .filter(
          item =>
            item.timeStamp.toDate() > daysAgo &&
            (dataType === 'all' ? true : dataType === item.type),
        )
        .map(val => {
          return {
            ...val,
            timeStamp: val.timeStamp.toDate(),
            freq:
              (val.freq?.freq ?? 'never') +
              ' ' +
              (val.freq?.freq === 'yearly'
                ? val.freq.day! + monthData[val.freq.month!].label
                : val.freq?.freq === 'monthly'
                ? val.freq.day
                : val.freq?.freq === 'weekly'
                ? weekData[val.freq.weekDay].label
                : '') +
              ' ' +
              (val.freq?.end !== undefined && val.freq.end === 'date'
                ? ',end - ' + (val.freq.date as Timestamp).toDate()
                : ''),
          };
        }),
    );
    try {
      const id = uuid.v4();
      const dirPath =
        Platform.OS === 'ios'
          ? ReactNativeBlobUtil.fs.dirs.DocumentDir
          : ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir;
      await ReactNativeBlobUtil.fs.writeFile(`${dirPath}/${id}.csv`, x);
      if (Platform.OS === 'ios') {
        ReactNativeBlobUtil.ios.openDocument(`${dirPath}/${id}.csv`);
      } else {
        Toast.show({text1: 'File Downloaded'});
      }
    } catch (e) {
      console.log(e);
    }
  }, [data, dataRange, dataType]);
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainView}>
        <View>
          <Text style={styles.text}>{STRINGS.WhatExport}</Text>
          <CustomDropdown
            data={['all', 'expense', 'income'].map(item => {
              return {
                label: item[0].toUpperCase() + item.slice(1),
                value: item,
              };
            })}
            onChange={data => {
              setDataType(data.value);
            }}
            placeholder=""
            value={dataType}
          />
          <Text style={styles.text}>{STRINGS.Whendaterange}</Text>
          <CustomDropdown
            data={['7', '15', '30'].map(item => {
              return {
                label: `Last ${item} days`,
                value: item,
              };
            })}
            onChange={data => {
              setDataRange(data.value);
            }}
            placeholder=""
            value={dataRange}
          />
          <Text style={styles.text}>{STRINGS.WhatFormat}</Text>
          <CustomDropdown
            data={[
              'csv',
              //  'pdf'
            ].map(item => {
              return {
                label: item.toUpperCase(),
                value: item,
              };
            })}
            onChange={data => {
              setDataFormat(data.value);
            }}
            placeholder=""
            value={dataFormat}
          />
        </View>
        <CustomButton
          title={STRINGS.Export}
          onPress={handleExport}
          icon={ICONS.Download({height: 20, width: 20})}
        />
      </View>
    </SafeAreaView>
  );
}

export default ExportData;
