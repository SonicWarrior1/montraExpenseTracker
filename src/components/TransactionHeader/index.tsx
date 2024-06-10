import React from 'react';
import {Pressable, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import {Dropdown} from 'react-native-element-dropdown';
import style from './styles';
import {useAppDispatch} from '../../redux/store';
import {openFilterSheet} from '../../redux/reducers/transactionSlice';
import {monthData, STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';

function TransactionHeader({
  month,
  setMonth,
}: Readonly<{
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
}>) {
  const dispatch = useAppDispatch();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <View style={styles.header}>
      <Dropdown
        style={styles.dropdown}
        renderLeftIcon={() => (
          <View>{ICONS.ArrowDown({width: 15, height: 15})}</View>
        )}
        renderRightIcon={() => <></>}
        placeholder={STRINGS.Month}
        value={monthData[month]}
        data={monthData}
        labelField={'label'}
        valueField={'value'}
        onChange={({value}) => {
          setMonth(value - 1);
        }}
        itemTextStyle={{color: COLOR.DARK[100]}}
        containerStyle={{backgroundColor: COLOR.LIGHT[100]}}
        activeColor={COLOR.LIGHT[100]}
        selectedTextStyle={{color: COLOR.DARK[100], marginLeft: 10}}
      />
      <Pressable
        style={styles.filterBtn}
        onPress={() => {
          dispatch(openFilterSheet(true));
        }}>
        {ICONS.Filter({
          height: 20,
          width: 20,
          color: COLOR.DARK[100],
          borderColor: COLOR.DARK[100],
        })}
      </Pressable>
    </View>
  );
}

export default TransactionHeader;
