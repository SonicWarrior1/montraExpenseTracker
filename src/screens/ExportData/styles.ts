import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: COLOR.LIGHT[100],
    },
    mainView: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'space-between',
    },
    text: { fontSize: 16, fontWeight: '500', marginVertical: 10, color: COLOR.DARK[100] }
})

export default styles