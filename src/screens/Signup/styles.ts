import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLORS.PRIMARY.LIGHT },
    mainView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },
    orText: {
        fontWeight: "bold",
        color: COLORS.DARK[25]
    },
    btn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1, 
        borderColor: COLORS.DARK[25]
    }, text: { fontWeight: 'bold', fontSize: 16 }
})
export default styles