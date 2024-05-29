import React from 'react';
import {Pressable, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import {Dropdown} from 'react-native-element-dropdown';
import styles from './styles';
import {useAppDispatch} from '../../redux/store';
import { openFilterSheet } from '../../redux/reducers/transactionSlice';

function TransactionHeader() {
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
        value={'Month'}
        data={[]}
        labelField={'label'}
        valueField={'value'}
        onChange={() => {}}
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
