import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
  flex: { flex: 1 },
  sheetView: {
    alignItems: 'center',
    paddingTop: 15,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text1: {
    fontSize: RFValue(16),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: COLOR.DARK[100]
  },
  text2: {
    fontSize: RFValue(16),
    fontWeight: '500',
    color: COLOR.DARK[25],
    textAlign: 'center',
    marginBottom: 20,
  },
  BtnRow: { flexDirection: 'row', flex: 1, columnGap: 20 ,marginTop:10},
  sheetBack: { borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: COLOR.LIGHT[100] },
});
export default styles;
