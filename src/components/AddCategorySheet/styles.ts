import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
  sheetView: {
    alignItems: 'center',
    paddingTop: 15,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    color: COLOR.DARK[100],
    borderWidth: 1,
    borderRadius: 20,
    height: 60,
    paddingHorizontal: 20,
    borderColor: COLORS.LIGHT[20],
    width: '100%',
  },
  sheetBack: { borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: COLOR.LIGHT[100] },
});

export default styles;
