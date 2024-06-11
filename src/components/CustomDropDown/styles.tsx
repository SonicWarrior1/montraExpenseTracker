import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    dropdown: {
      borderWidth: 1,
      borderRadius: 20,
      height: Dimensions.get('screen').height * 0.07,
      paddingHorizontal: 20,
      borderColor: '#F1F1FA',
      width: '100%',
    },
  });
export default styles;
