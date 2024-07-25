import React, {useState} from 'react';
import {
  View,
  TextInput,
  Pressable,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import styles from './styles';
import {ICONS} from '../../constants/icons';
import {useAppTheme} from '../../hooks/themeHook';
import {PlaceholderTextColor} from '../../constants/commonStyles';

function CustomPassInput({
  value,
  onChangeText,
  placeholderText,
  inputColor = 'black',
  onBlur,
}: Readonly<{
  value: string | undefined;
  onChangeText: (str: string) => void;
  onBlur?: (props: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  placeholderText: string;
  eyeColor?: string;
  inputColor?: string;
}>) {
  const [showPass, setShowPass] = useState<boolean>(true);
  const COLOR = useAppTheme();
  return (
    <View style={styles.passInputContainer}>
      <TextInput
        style={[styles.passInput, {color: inputColor}]}
        placeholder={placeholderText}
        secureTextEntry={showPass}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={PlaceholderTextColor}
        textContentType="oneTimeCode"
        onBlur={onBlur}
      />
      <Pressable
        onPress={() => {
          setShowPass(pass => !pass);
        }}>
        {!showPass
          ? ICONS.Show({
              height: 22,
              width: 22,
              color: COLOR.LIGHT[100],
              borderColor: COLOR.DARK[25],
            })
          : ICONS.Hide({
              height: 22,
              width: 22,
              color: COLOR.DARK[25],
            })}
      </Pressable>
    </View>
  );
}
export default React.memo(CustomPassInput);
