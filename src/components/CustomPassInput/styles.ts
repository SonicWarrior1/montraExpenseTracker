import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
    passInputContainer: {
        borderWidth: 1,
        borderRadius: 20,
        height: 60,
        paddingLeft: 20,
        borderColor: COLORS.LIGHT[20],
        color: COLORS.LIGHT[100],
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
    },
    passInput: {
        color: COLORS.PRIMARY.DARK,
        flex: 1,
        fontSize: RFValue(14)
    },
})

export default styles