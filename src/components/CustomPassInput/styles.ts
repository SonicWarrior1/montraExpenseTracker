import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
    passInputContainer: {
        borderWidth: 1,
        borderRadius: 20,
        height: Dimensions.get('screen').width * 0.15,
        paddingLeft: 20,
        borderColor: COLORS.LIGHT[40],
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