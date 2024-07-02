import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';
const screenWidth=Dimensions.get('screen').width
const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    moneyCtr: {
        height: 80,
        borderRadius: 28,
        flexDirection: 'row',
        paddingHorizontal: 15,
        columnGap: 10,
        alignItems: 'center',
        width: screenWidth/2.2,
    },
    iconCtr: {
        backgroundColor: COLOR.LIGHT[100],
        justifyContent: 'center',
        padding: 8,
        borderRadius: 16,
    },
    text1: {
        fontSize: RFValue(14),
        fontWeight: '500',
        color: COLOR.LIGHT[100],
    },
    text2: {
        fontSize: RFValue(18),
        fontWeight: '600',
        color: COLOR.LIGHT[100],
        maxWidth: 100,
    },
    filterBtn: {
        paddingVertical: 10,
        // paddingHorizontal: 22,
        alignItems: "center",
        borderRadius: 40,
    },
    filterBtnText: {
        fontSize: RFValue(14),
        color: COLOR.YELLOW[100],
    }, 
    editBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLOR.VIOLET[20],
        borderRadius: 40,
    },
    editBtnText: {
        fontWeight: '500',
        fontSize: RFValue(14),
        color: COLOR.PRIMARY.VIOLET,
    },
    mainView: { flex: 1 },
    gradient: {
        flex: 1,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingTop: 10,
        paddingBottom: 20
    },
    safeView: {
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        alignItems: 'center',
    }, actText: {
        fontSize: RFValue(14),
        fontWeight: '500',
        color: COLOR.DARK[25],
        marginTop: 18,
    },
    amt: { fontSize: RFValue(40), fontWeight: '600', marginTop: 10, color: COLOR.DARK[100] },
    transRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
        columnGap: 15,
        marginTop: 18,
    },
    graphTitle: { fontSize: RFValue(18), fontWeight: '600', paddingHorizontal: 20, color: COLOR.DARK[100], paddingVertical: 12 },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    flexRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,

        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    text3: { fontSize: 18, fontWeight: '600', color: COLOR.DARK[100] },
    column: { alignItems: 'flex-end', rowGap: 5 },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLOR.DARK[25],
        textAlign: 'center',
    },
    emptyCtr: { height: 210, alignItems: 'center', justifyContent: 'center' },
});

export default styles;
