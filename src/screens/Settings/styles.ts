import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";
import { RFValue } from "react-native-responsive-fontsize";

const styles = (COLOR:typeof COLORS) => StyleSheet.create({
    btn: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: { fontSize: RFValue(16), fontWeight: '500', paddingLeft: 10, color: COLOR.DARK[100] },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subText: { fontSize: RFValue(14), fontWeight: '500', color: COLOR.DARK[25] },
    safeView: { backgroundColor: COLOR.LIGHT[100], flex: 1 }
})

export default styles