import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    safeView: {flex: 1, backgroundColor: COLOR.LIGHT[100]},
    mainView: {
      flex: 1,
      // justifyContent: 'center',
      paddingTop: Dimensions.get('screen').height * 0.085,
      alignItems: 'center',
      paddingHorizontal: 30,
    },
  });
export default styles;
