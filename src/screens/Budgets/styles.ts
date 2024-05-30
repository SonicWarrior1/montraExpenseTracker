import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: COLORS.PRIMARY.VIOLET,
    },
    mainView: {
        flex: 9,
        backgroundColor: COLORS.LIGHT[80],
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10
    },
    month: {
        fontSize: 24,
        color: COLORS.LIGHT[100],
        fontWeight: "500"
    }
})
export default styles