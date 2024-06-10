import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
  sheetView: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  flexRow: { flexDirection: 'row', columnGap: 10 },
  sheetBack: { borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: COLOR.LIGHT[100] },
  flex: { flex: 1 },
});
export default styles;
