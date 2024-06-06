import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({

    moneyCtr: {
        height: 80,
        borderRadius: 28,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 18,
        columnGap: 10,
        alignItems: 'center',
    },
    iconCtr: {
        backgroundColor: COLORS.LIGHT[100],
        justifyContent: 'center',
        padding: 8,
        borderRadius: 16,
    },
    text1: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.LIGHT[100],
    },
    text2: {
        fontSize: 22,
        fontWeight: '600',
        color: COLORS.LIGHT[100],
    },
    filterBtn: {
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 40,
    },
    filterBtnText: {
        fontSize: 14,
        color: COLORS.YELLOW[100]
    }, listItemCtr: {
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
    listtext1: { fontSize: 16, fontWeight: '500' },
    listtext2: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.DARK[25],
    }, editBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.VIOLET[20],
        borderRadius: 40,
    },
    editBtnText: {
        fontWeight: '500',
        fontSize: 14,
        color: COLORS.PRIMARY.VIOLET,
    },
    mainView: { backgroundColor: 'white', flex: 1 },
    gradient: {
        flex: 1,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingTop: 10,
    },
    safeView: {
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        alignItems: 'center',
    }, actText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.DARK[25],
        marginTop: 10,
    },
    amt: { fontSize: 40, fontWeight: '600', marginTop: 7 },
    transRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
        columnGap: 15,
        marginTop: 12,
    },
    graphTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 20 },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    flexRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    text3: { fontSize: 18, fontWeight: '600' },
    column: { alignItems: 'flex-end', rowGap: 5 }
})

export default styles