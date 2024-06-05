import React from 'react';
import {Pressable, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import {Dropdown} from 'react-native-element-dropdown';
import styles from './styles';
import {useAppDispatch} from '../../redux/store';
import {openFilterSheet} from '../../redux/reducers/transactionSlice';
import {monthData} from '../../constants/strings';

function TransactionHeader({
  month,
  setMonth,
}: Readonly<{
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
}>) {
  const dispatch = useAppDispatch();
  return (
    <View style={styles.header}>
      <Dropdown
        style={styles.dropdown}
        renderLeftIcon={() => (
          <View>{ICONS.ArrowDown({width: 15, height: 15})}</View>
        )}
        renderRightIcon={() => <></>}
        placeholder="Month"
        placeholderStyle={{marginLeft: 10}}
        value={monthData[month]}
        data={monthData}
        labelField={'label'}
        valueField={'value'}
        onChange={({value}) => {
          setMonth(value - 1);
        }}
      />
      <Pressable
        style={styles.filterBtn}
        onPress={() => {
          dispatch(openFilterSheet(true));
        }}>
        {ICONS.Filter({height: 20, width: 20})}
      </Pressable>
    </View>
  );
}

export default TransactionHeader;
