import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
} from 'react-native';
import styles from './styles';
import {COLORS} from '../../constants/commonStyles';

function CustomInput({
  value,
  onChangeText,
  type,
  placeholderText,
  maxLength = 100,
  inputColor = COLORS.PRIMARY.DARK,
  onBlur,
  flex,
}: Readonly<{
  value: string;
  onChangeText: (str: string) => void;
  type: 'email' | 'name';
  placeholderText: string;
  maxLength?: number;
  inputColor?: string;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  flex?: number;
}>) {
  return (
    <TextInput
      style={[styles.input, {color: inputColor, flex: flex}]}
      placeholder={placeholderText}
      keyboardType={type === 'name' ? 'default' : 'email-address'}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={COLORS.DARK[25]}
      autoCapitalize={type === 'name' ? 'words' : 'none'}
      autoCorrect={false}
      maxLength={maxLength}
      onBlur={onBlur}
    />
  );
}
export default CustomInput;
