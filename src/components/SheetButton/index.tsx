import {Pressable, Text} from 'react-native';
import style from '../FilePickerSheet/styles';
import {iconProps} from '../../constants/icons';
import {useAppTheme} from '../../hooks/themeHook';

function SheetButtons({
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
    <Pressable style={styles.sheetBtn} onPress={onPress}>
      {icon({height: 30, width: 30})}
      <Text style={styles.sheetBtnText}>{title}</Text>
    </Pressable>
  );
}
export default SheetButtons;
