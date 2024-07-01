import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
} from 'react-native';
import styles from './styles';
import {COLORS, PlaceholderTextColor} from '../../constants/commonStyles';
import React, {useMemo} from 'react';

function CustomInput({
  value,
  onChangeText,
  type,
  placeholderText,
  maxLength = 100,
  inputColor = COLORS.DARK[100],
  onBlur,
  flex,
  editable,
  onPress,
}: Readonly<{
  value: string;
  onChangeText: (str: string) => void;
  type: 'email' | 'name' | 'sentence';
  placeholderText: string;
  maxLength?: number;
  inputColor?: string;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  flex?: number;
  editable?: boolean;
  onPress?: () => void;
}>) {
  const autoCapitalize = useMemo(() => {
    if (type === 'name') {
      return 'words';
    } else if (type === 'sentence') {
      return 'sentences';
    } else {
      return 'none';
    }
  }, [type]);

  return (
    <TextInput
      style={[styles.input, {color: inputColor, flex: flex}]}
      placeholder={placeholderText}
      keyboardType={type === 'name' ? 'default' : 'email-address'}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={PlaceholderTextColor}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      maxLength={maxLength}
      onBlur={onBlur}
      editable={editable}
      onPress={onPress}
    />
  );
}
export default React.memo(CustomInput);
