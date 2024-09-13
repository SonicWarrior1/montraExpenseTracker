import {Pressable, Text, View} from 'react-native';
import style from '../ChatFilePickerSheet/styles';
import {iconProps} from '../../constants/icons';
import {useAppTheme} from '../../hooks/themeHook';
import React from 'react';

function FilePickButton({
  icon,
  title,
  onPress,
}: Readonly<{
  icon: (params: iconProps) => React.ReactNode;
  title: string;
  onPress: () => void;
}>) {
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <View style={{alignItems:'center',justifyContent:"center"}}>
      <Pressable style={styles.sheetBtn} onPress={onPress}>
        {icon({height: 25, width: 25})}
      </Pressable>
      <Text style={styles.sheetBtnText}>{title}</Text>
    </View>
  );
}
export default React.memo(FilePickButton);
