import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLORS.PRIMARY.VIOLET ,paddingTop:30},
    mainView: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20
    },
    progressDotCtr: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressDot: {
        height: 32,
        width: 32,
        borderRadius: 20,
        borderColor: COLORS.VIOLET[20]
    },
    text: {
        color: COLORS.LIGHT[80],
        fontSize: 18,
        fontWeight: "600"
    }
})
export default styles;