import React from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import styles from './styles';

function CustomButton({
  backgroundColor = COLORS.PRIMARY.VIOLET,
  title,
  onPress,
  textColor = COLORS.PRIMARY.LIGHT,
  borderWidth = 0,
  borderColor,
  icon: component,
}: Readonly<{
  backgroundColor?: string;
  title: string;
  onPress: () => void;
  textColor?: string;
  borderWidth?: number;
  borderColor?: string;
  icon?: React.ReactNode;
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
      {component ? (
        <View
          style={{flexDirection: 'row', columnGap: 10, alignItems: 'center'}}>
          {component}
          <Text style={[styles.text, {color: textColor}]}>{title}</Text>
        </View>
      ) : (
        <Text style={[styles.text, {color: textColor}]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export default CustomButton;
