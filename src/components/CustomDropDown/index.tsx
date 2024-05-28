import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {COLORS} from '../../constants/commonStyles';

function CustomDropdown({
  data,
  onChange,
  value,
  placeholder,
  onFocus
}: Readonly<{
  data: Array<any>;
  onChange: (item: any) => void;
  value: any;
  placeholder: string;
  onFocus?:()=>void
}>) {
  return (
    <Dropdown
      style={{
        borderWidth: 1,
        borderRadius: 20,
        height: 60,
        paddingHorizontal: 20,
        borderColor: COLORS.LIGHT[20],
        width: '100%',
      }}
      placeholder={placeholder}
      placeholderStyle={{color: COLORS.DARK[25]}}
      data={data}
      labelField={'label'}
      value={value}
      onChange={onChange}
      valueField={'value'}
      onFocus={onFocus}
    />
  );
}

export default CustomDropdown;
