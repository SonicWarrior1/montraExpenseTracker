import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {COLORS} from '../../constants/commonStyles';
import styles from './styles';

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
  return (
    <Dropdown
      style={styles.dropdown}
      placeholder={placeholder}
      placeholderStyle={{color: COLORS.DARK[25]}}
      data={data}
      labelField={'label'}
      value={{label: value, value: value}}
      onChange={onChange}
      valueField={'value'}
      onFocus={onFocus}
    />
  );
}

export default CustomDropdown;
