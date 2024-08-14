import { RFValue } from 'react-native-responsive-fontsize';
import {COLORS} from '../../constants/commonStyles';
import { StyleSheet } from 'react-native';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
  safeView: {flex: 1, backgroundColor: COLOR.LIGHT[100]},
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {fontSize: RFValue(14), fontWeight: '500', color: COLOR.DARK[100]},
  checkbox: {width: 28},
});

export default styles;
