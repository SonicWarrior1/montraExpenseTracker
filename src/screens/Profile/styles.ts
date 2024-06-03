import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    colorBox: {
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: 52,
        height: 52, backgroundColor: COLORS.VIOLET[20],
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 15,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: COLORS.LIGHT[20],
    },
    safeView: { flex: 1 },
    mainView: { paddingHorizontal: 20, paddingVertical: 10 },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 15,
    },
    imgCtr: {
        backgroundColor: 'white',
        padding: 5,
        borderWidth: 1,
        borderColor: COLORS.VIOLET[100],
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
        height: 90,
        width: 90,
    },
    img: { height: 80, width: 80, borderRadius: 80 },
    text1: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.DARK[25],
        marginBottom: 10,
    },
    text2: { fontSize: 24, fontWeight: '600' },
    card: {
        backgroundColor: COLORS.LIGHT[100],
        borderRadius: 24,
        marginTop: 30,
    },
    btnText: {fontSize: 16, fontWeight: '500'}
})

export default styles