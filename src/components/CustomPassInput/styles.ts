import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    passInputContainer: {
        borderWidth: 1,
        borderRadius: 20,
        height: 60,
        paddingLeft: 20,
        borderColor: COLORS.LIGHT[20],
        color: COLORS.PRIMARY.LIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
    },
    passInput: {
        color: COLORS.PRIMARY.DARK,
        flex: 1,
    },
})

export default styles