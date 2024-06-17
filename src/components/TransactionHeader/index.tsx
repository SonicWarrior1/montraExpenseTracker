import React from 'react';
import {Pressable, Text, View} from 'react-native';
import style from './styles';
import {ICONS} from '../../constants/icons';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {openFilterSheet} from '../../redux/reducers/transactionSlice';
import {monthData, STRINGS} from '../../constants/strings';
import {useAppTheme} from '../../hooks/themeHook';
import {COLORS} from '../../constants/commonStyles';
// Third party Libraries
import {Dropdown} from 'react-native-element-dropdown';

function TransactionHeader({
  month,
  setMonth,
}: Readonly<{
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
}>) {
  // constants
  const dispatch = useAppDispatch();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // redux
  const filters = useAppSelector(state => state.transaction.filters);
  console.log(filters.sort !== 'none' ? 1 : 0);
  return (
    <View style={styles.header}>
      <Dropdown
        style={styles.dropdown}
        renderLeftIcon={() => (
          <View>
            {ICONS.ArrowDown({
              width: 15,
              height: 15,
              borderColor: COLOR.VIOLET[100],
            })}
          </View>
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
        {(filters.filter !== 'none' ? 1 : 0) +
          (filters.sort !== 'none' ? 1 : 0) +
          (filters.cat.length > 0 ? filters.cat.length : 0) !==
          0 && (
          <View style={styles.notifCount}>
            <Text style={{color: COLORS.LIGHT[100]}}>
              {(filters.filter !== 'none' ? 1 : 0) +
                (filters.sort !== 'none' ? 1 : 0) +
                (filters.cat.length > 0 ? filters.cat.length : 0)}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

export default TransactionHeader;
