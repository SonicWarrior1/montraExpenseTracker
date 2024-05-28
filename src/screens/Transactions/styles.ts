import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLORS.PRIMARY.LIGHT },
    mainView: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20
    },
    financialBtn: {
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: COLORS.SECONDARY.VIOLET,
        flexDirection: "row",
        paddingHorizontal: 20
    },
    financialText: { fontSize: 18, color: COLORS.PRIMARY.VIOLET }
})

export default styles;