import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
  filterBtn: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLOR.LIGHT[20],
  },
  filterBtnText: {
    fontWeight: '500',
    fontSize: 14,
    color: COLOR.DARK[100],
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 10,
  },
  sheetBack: { borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: COLOR.LIGHT[100] }
})
export default styles