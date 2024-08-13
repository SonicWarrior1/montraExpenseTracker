import React, {useCallback, useMemo, useState} from 'react';
import {Platform, SafeAreaView, Text, View} from 'react-native';
import style from './styles';
import {useAppDispatch} from '../../redux/store';
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
import {setLoading} from '../../redux/reducers/userSlice';
import {useQuery} from '@realm/react';
import {OnlineTransactionModel} from '../../DbModels/OnlineTransactionModel';
import {OfflineTransactionModel} from '../../DbModels/OfflineTransactionModel';
import CustomHeader from '../../components/CustomHeader';
import {ExportScreenProps} from '../../defs/navigation';

function ExportData({navigation}: ExportScreenProps) {
  // redux
  const onlineData = useQuery(OnlineTransactionModel);
  const offlineData = useQuery(OfflineTransactionModel);
  const data = useMemo(
    () => [
      ...onlineData.filter(item => item.changed !== true),
      ...offlineData.filter(item => item.operation !== 'delete'),
    ],
    [offlineData, onlineData],
  );
  console.log(data.length);
  const dispatch = useAppDispatch();
  // state
  const [dataType, setDataType] = useState<
    'all' | 'expense' | 'income' | 'transfer'
  >('all');
  const [dataRange, setDataRange] = useState<7 | 15 | 30>(7);
  const [dataFormat, setDataFormat] = useState<'csv' | 'pdf'>('csv');
  // functions
  const formatExportData = useMemo(() => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - dataRange);
    return Object.values(data)
      .filter(
        item =>
          Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate() >
            daysAgo && (dataType === 'all' ? true : dataType === item.type),
      )
      .map(val => {
        const item = {...val};
        delete item.changed;
        delete item.conversion;
        if (item.type === 'transfer') {
          return {
            ...item,
            timeStamp: Timestamp.fromMillis(
              item.timeStamp.seconds * 1000,
            ).toDate(),
          };
        }
        let frequency = '';
        if (item.freq?.freq === 'yearly') {
          frequency = item.freq.day + monthData[item.freq.month].label;
        } else if (item.freq?.freq === 'monthly') {
          frequency = String(item.freq.day);
        } else if (item.freq?.freq === 'weekly') {
          frequency = weekData[item.freq.weekDay].label;
        }
        return {
          ...item,
          timeStamp: Timestamp.fromMillis(
            item.timeStamp.seconds * 1000,
          ).toDate(),
          freq:
            (item.freq?.freq ?? 'never') +
            ' ' +
            frequency +
            ' ' +
            (item.freq?.end !== undefined && item.freq.end === 'date'
              ? ',end - ' +
                Timestamp.fromMillis(item.freq.date?.seconds! * 1000).toDate()
              : ''),
        };
      });
  }, [data, dataType, dataRange]);
  const handleExport = useCallback(async () => {
    dispatch(setLoading(true));
    const csvData = jsonToCSV(formatExportData);
    if (csvData === '') {
      Toast.show({text1: STRINGS.NoDataToExport, type: 'error'});
      dispatch(setLoading(false));
      return;
    }
    try {
      const id = uuid.v4();
      const dirPath =
        Platform.OS === 'ios'
          ? ReactNativeBlobUtil.fs.dirs.DocumentDir
          : ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir;
      console.log(dirPath, csvData);
      await ReactNativeBlobUtil.fs.writeFile(`${dirPath}/${id}.csv`, csvData);
      if (Platform.OS === 'ios') {
        ReactNativeBlobUtil.ios.openDocument(`${dirPath}/${id}.csv`);
      } else {
        Toast.show({text1: 'File Downloaded'});
      }
      dispatch(setLoading(false));
    } catch (e) {
      console.log(e);
      dispatch(setLoading(false));
    }
  }, [dispatch, formatExportData]);
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <SafeAreaView style={styles.safeView}>
      <CustomHeader
        backgroundColor={COLOR.LIGHT[100]}
        navigation={navigation}
        title={STRINGS.Theme}
        color={COLOR.DARK[100]}
        bottomBorder={true}
      />
      <View style={styles.mainView}>
        <View>
          <Text style={styles.text}>{STRINGS.WhatExport}</Text>
          <CustomDropdown
            data={['all', 'expense', 'income', 'transfer'].map(item => {
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
            value={String(dataRange)}
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
          icon={ICONS.Download({
            height: 18,
            width: 18,
            color: 'transparent',
          })}
        />
      </View>
    </SafeAreaView>
  );
}

export default ExportData;
