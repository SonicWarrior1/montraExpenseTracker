import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";
import { RFValue } from "react-native-responsive-fontsize";

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: COLOR.LIGHT[100],
    },
    mainView: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 25,
        justifyContent: 'space-between',
    },
    text: { fontSize: RFValue(16), fontWeight: '500', marginVertical: 20, color: COLOR.DARK[100], }
})

export default styles