import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import style from './styles';
import {useAppTheme} from '../../hooks/themeHook';
import {ICONS} from '../../constants/icons';
import {Text, View} from 'react-native';
import {PlaceholderTextColor} from '../../constants/commonStyles';

function CustomDropdown({
  data,
  onChange,
  value,
  placeholder,
  onFocus,
  leftIcon,
  catColors,
  disable,
}: Readonly<{
  data: Array<{label: number | string; value: number | string}>;
  onChange: (item: any) => void;
  value: any;
  placeholder: string;
  onFocus?: () => void;
  leftIcon?: (visible?: boolean) => JSX.Element | null | undefined;
  catColors?: {
    [key: string]: string;
  };
  disable?: boolean;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <Dropdown
      style={styles.dropdown}
      placeholder={placeholder}
      placeholderStyle={{color: PlaceholderTextColor}}
      data={data}
      labelField={'label'}
      value={{label: value, value: value}}
      renderItem={item => {
        return (
          <View style={styles.itemCtr}>
            {leftIcon && item.value !== 'add' && (
              <View
                style={[
                  styles.icon,
                  {
                    backgroundColor: catColors?.[item.value ?? ''] ?? 'green',
                  },
                ]}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  fontWeight: item.value === 'add' ? '700' : undefined,
                },
              ]}>
              {item.label}
            </Text>
          </View>
        );
      }}
      renderLeftIcon={leftIcon}
      onChange={onChange}
      valueField={'value'}
      onFocus={onFocus}
      disable={disable ?? false}
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

export default React.memo(CustomDropdown);
