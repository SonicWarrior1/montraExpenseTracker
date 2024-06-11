import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    safeView: {flex: 1, backgroundColor: COLOR.LIGHT[100]},
    mainView: {
      flex: 1,
      // justifyContent: 'center',
      paddingTop: Dimensions.get('screen').height * 0.1,
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    text: {
      fontSize: RFValue(24),
      fontWeight: '600',
      alignSelf: 'flex-start',
      color: COLOR.DARK[100],
    },
    flex: {
      flex: 1,
    },
  });
export default styles;
