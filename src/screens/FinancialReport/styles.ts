import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderRadius: 20,
        height: 40,
        fontSize: 14,
        paddingHorizontal: 20,
        borderColor: COLORS.LIGHT[20],
        width: 120,
    },
    listItemCtr: {
        marginVertical: 5,
        flexDirection: 'row',
        backgroundColor: COLORS.LIGHT[60],
        borderRadius: 16,
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        columnGap: 5,
    }, icon: {
        padding: 10,
        backgroundColor: COLORS.DARK[25],
        borderRadius: 16,
    },
    catCtr: {
        flex: 1,
        paddingHorizontal: 10,
        rowGap: 5,
    },
    text1: { fontSize: 16, fontWeight: '500' },
    text2: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.DARK[25],
    }, filterBtn: {
        padding: 3,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.LIGHT[20],
    }, colorBox: {
        height: 14,
        width: 14,
        borderRadius: 10,
    },
    catCtr2: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.LIGHT[20],
        backgroundColor: COLORS.LIGHT[100],
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 24,
        columnGap: 7,
    },
    catText: { fontSize: 14, fontWeight: '500' },
    catAmt: { fontSize: 24, fontWeight: "500" },
    safeView: { flex: 1, backgroundColor: COLORS.LIGHT[100] },
    monthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    graphBtnCtr: { flexDirection: 'row', borderWidth: 1, borderRadius: 8 },
    graphBtn: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    amt: { fontSize: 32, fontWeight: '700', paddingLeft: 20 },
    graphView: { transform: [{ translateX: -10 }] },
    pieView: {
        alignItems: 'center',
        paddingVertical: 20,
        justifyContent: 'center',
    },
    typeRow: {
        alignSelf: 'center',
        justifyContent: 'center',
    },
    innerTypeRow: {
        flexDirection: 'row',
        backgroundColor: COLORS.LIGHT[60],
        justifyContent: 'center',
        padding: 5,
        borderRadius: 32,
    },
    typeBtn: {
        width: 160,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 32,
    },
    typeText: {
        fontSize: 16,
        fontWeight: '500',
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    catRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})

export default styles