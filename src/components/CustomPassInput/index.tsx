import {View, TextInput, Pressable} from 'react-native';
import styles from './styles';
import {useState} from 'react';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import {useAppTheme} from '../../hooks/themeHook';

function CustomPassInput({
  value,
  onChangeText,
  placeholderText,
  inputColor = 'black',
}: Readonly<{
  value: string | undefined;
  onChangeText: (str: string) => void;
  placeholderText: string;
  eyeColor?: string;
  inputColor?: string;
}>) {
  const [showPass, setShowPass] = useState(true);
  const COLOR = useAppTheme();
  return (
    <View style={styles.passInputContainer}>
      <TextInput
        style={[styles.passInput, {color: inputColor}]}
        placeholder={placeholderText}
        secureTextEntry={showPass}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={COLORS.DARK[25]}
        textContentType="oneTimeCode"
      />
      <Pressable
        onPress={() => {
          setShowPass(pass => !pass);
        }}>
        {showPass
          ? ICONS.Show({
              height: 24,
              width: 24,
              color: 'transparent',
              borderColor: COLOR.DARK[100],
            })
          : ICONS.Hide({
              height: 22,
              width: 22,
              color: COLOR.DARK[100],
            })}
      </Pressable>
    </View>
  );
}
export default CustomPassInput;
