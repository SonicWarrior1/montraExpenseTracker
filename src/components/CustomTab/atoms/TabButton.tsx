import {Pressable, Text} from 'react-native';
import {iconProps} from '../../../constants/icons';
import Spacer from '../../Spacer';
import {COLORS} from '../../../constants/commonStyles';
import style from '../styles';
import {useAppTheme} from '../../../hooks/themeHook';
import React from 'react';

function TabButton({
  onPress,
  icon,
  title,
  isActive,
}: Readonly<{
  onPress: () => void;
  icon: (params: iconProps) => React.ReactNode;
  title: string;
  isActive: boolean;
}>) {
  const styles = style(useAppTheme());
  return (
    <Pressable style={styles.tabBtn} onPress={onPress}>
      {icon({
        height: 25,
        width: 25,
        color: isActive ? COLORS.PRIMARY.VIOLET : '#C6C6C6',
      })}
      <Spacer height={10} />
      <Text
        style={[
          styles.btnText,
          {color: isActive ? COLORS.PRIMARY.VIOLET : '#C6C6C6'},
        ]}>
        {title}
      </Text>
    </Pressable>
  );
}

export default React.memo(TabButton);
