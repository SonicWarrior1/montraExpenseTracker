import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    dropdown: {
      borderWidth: 1,
      borderRadius: 20,
      height: 60,
      paddingHorizontal: 20,
      borderColor: COLOR.LIGHT[20],
      width: '100%',
    },
  });
export default styles;
