import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLOR.LIGHT[100] },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: { fontSize: 14, fontWeight: '500', color: COLOR.DARK[100] }
})
export default styles