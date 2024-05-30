import React from 'react';
import {Pressable, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import styles from './styles';

function CustomButton({
  backgroundColor = COLORS.PRIMARY.VIOLET,
  title,
  onPress,
  textColor = COLORS.PRIMARY.LIGHT,
  borderWidth = 0,
  borderColor,
}: Readonly<{
  backgroundColor?: string;
  title: string;
  onPress: () => void;
  textColor?: string;
  borderWidth?: number;
  borderColor?: string;
}>) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: backgroundColor,
          borderWidth: borderWidth,
          borderColor: borderColor,
        },
      ]}
      onPress={onPress}>
      <Text style={[styles.text, {color: textColor}]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default CustomButton;
