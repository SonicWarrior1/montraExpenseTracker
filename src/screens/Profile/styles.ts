import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";
import { RFValue } from "react-native-responsive-fontsize";

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    colorBox: {
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        width: 52,
        height: 52, backgroundColor: COLOR.VIOLET[20],
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 15,
        paddingHorizontal: 15,
        paddingVertical: 25,
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHT[20],
    },
    safeView: { flex: 1, backgroundColor: COLOR.LIGHT[40] },
    mainView: { paddingHorizontal: 20, paddingVertical: 10 },
    nameRow: {
        paddingTop:15,
        paddingBottom:25,
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
        backgroundColor: COLOR.LIGHT[100],
        padding: 5,
        borderWidth: 1,
        borderColor: COLOR.VIOLET[100],
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
        height: 90,
        width: 90,
    },
    img: { height: 80, width: 80, borderRadius: 80 },
    text1: {
        fontSize: RFValue(14),
        fontWeight: '500',
        color: COLOR.DARK[25],
        marginBottom: 10,
    },
    text2: { fontSize: RFValue(24), fontWeight: '600', color: COLOR.DARK[100] },
    card: {
        backgroundColor: COLOR.LIGHT[100],
        borderRadius: 24,
        marginTop: 30,
    },
    btnText: { fontSize: RFValue(16), fontWeight: '500', color: COLOR.DARK[100] }
})

export default styles