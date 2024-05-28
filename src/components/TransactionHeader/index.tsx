import React from 'react';
import {Dimensions, Pressable, View} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import {Dropdown} from 'react-native-element-dropdown';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import styles from './styles';

function TransactionHeader(props: Readonly<BottomTabHeaderProps>) {
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
        style={styles.filterBtn}>
        {ICONS.Filter({height: 20, width: 20})}
      </Pressable>
    </View>
  );
}

export default TransactionHeader;
