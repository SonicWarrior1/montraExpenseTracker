import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";
import { RFValue } from "react-native-responsive-fontsize";

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: { fontSize: RFValue(14), fontWeight: '500', color: COLOR.DARK[100] },
    safeView: { flex: 1, backgroundColor: COLOR.LIGHT[100] }
})

export default styles