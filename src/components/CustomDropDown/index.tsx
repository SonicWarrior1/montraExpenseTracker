import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {COLORS} from '../../constants/commonStyles';
import style from './styles';
import {useAppTheme} from '../../hooks/themeHook';
import {ICONS} from '../../constants/icons';
import {Text, View} from 'react-native';

function CustomDropdown({
  data,
  onChange,
  value,
  placeholder,
  onFocus,
}: Readonly<{
  data: Array<any>;
  onChange: (item: any) => void;
  value: any;
  placeholder: string;
  onFocus?: () => void;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <Dropdown
      style={styles.dropdown}
      placeholder={placeholder}
      placeholderStyle={{color: COLORS.DARK[25]}}
      data={data}
      labelField={'label'}
      value={{label: value, value: value}}
      renderItem={item => {
        return (
          <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: item.value === 'add' ? '700' : undefined,
              }}>
              {item.label}
            </Text>
          </View>
        );
      }}
      onChange={onChange}
      valueField={'value'}
      onFocus={onFocus}
      itemTextStyle={{color: COLOR.DARK[100]}}
      containerStyle={{backgroundColor: COLOR.LIGHT[100]}}
      activeColor={COLOR.LIGHT[100]}
      selectedTextStyle={{color: COLOR.DARK[100]}}
      renderRightIcon={() => (
        <View>
          {ICONS.ArrowDown({
            height: 20,
            width: 20,
            borderColor: COLOR.DARK[25],
          })}
        </View>
      )}
    />
  );
}

export default CustomDropdown;
