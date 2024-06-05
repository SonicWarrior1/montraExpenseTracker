import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: COLORS.LIGHT[100],
    },
    mainView: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'space-between',
    },
    text:{fontSize: 16, fontWeight: '500', marginVertical: 10}
})

export default styles