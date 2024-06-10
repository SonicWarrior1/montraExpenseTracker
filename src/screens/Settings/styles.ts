import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = (COLORS) => StyleSheet.create({
    btn: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: { fontSize: 16, fontWeight: '500', paddingLeft: 10, color: COLORS.DARK[100] },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subText: { fontSize: 14, fontWeight: '500', color: COLORS.DARK[25] },
    safeView: { backgroundColor: COLORS.LIGHT[100], flex: 1 }
})

export default styles