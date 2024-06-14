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
  return (
    <TextInput
      style={[styles.input, {color: inputColor, flex: flex}]}
      placeholder={placeholderText}
      keyboardType={type === 'name' ? 'default' : 'email-address'}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={COLORS.DARK[25]}
      autoCapitalize={
        type === 'name' ? 'words' : type === 'sentence' ? 'sentences' : 'none'
      }
      autoCorrect={false}
      maxLength={maxLength}
      onBlur={onBlur}
      editable={editable}
      onPress={onPress}
    />
  );
}
export default CustomInput;
