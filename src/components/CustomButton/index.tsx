import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import styles from './styles';

function CustomButton({
  backgroundColor = COLORS.PRIMARY.VIOLET,
  title,
  onPress,
  textColor = COLORS.LIGHT[100],
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
          style={styles.btnCtr}>
          {component}
          <Text style={[styles.text, {color: textColor}]}>{title}</Text>
        </View>
      ) : (
        <Text style={[styles.text, {color: textColor}]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(CustomButton);
