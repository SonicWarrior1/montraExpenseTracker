import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = (COLOR:typeof COLORS)=> StyleSheet.create({
  sheetView: {
    alignItems: 'center',
    paddingTop: 15,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  sheetBack: { borderTopLeftRadius: 32, borderTopRightRadius: 32,backgroundColor:COLOR.LIGHT[100] },
});

export default styles;
