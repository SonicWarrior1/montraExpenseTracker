import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
const screenHeight=Dimensions.get('screen').height
const styles = StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLORS.PRIMARY.RED },
    mainView: {
        flex: 1,
        justifyContent: 'center'
    },
    text1: {
        opacity: 0.64,
        alignSelf: "flex-start",
        fontWeight: "600",
        color: COLORS.LIGHT[80],
        fontSize: 18, paddingHorizontal: 30,
    },
    text2: { color: 'white', fontSize: 64, fontWeight: '600' },
    input: {
        flex: 1,
        fontSize: 64,
        color: 'white',
        fontWeight: '600',
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 20,
        height: 60,
        paddingHorizontal: 20,
        borderColor: COLORS.LIGHT[20],
        width: '100%',
    },
    moneyCtr: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems:"center",
        paddingHorizontal: 30,
    },
    detailsCtr: {
        // flex: screenHeight * 0.003,
        backgroundColor: 'white',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    attachementCtr: {
        height: 60,
        width: '100%',
        borderWidth: 1,
        borderRadius: 20,
        borderStyle: 'dashed',
        borderColor: COLORS.LIGHT[20],
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    attachementText: { color: COLORS.DARK[25], fontSize: 16 },
    displayImg: {
        position: 'absolute',
        left: 90,
        top: -5,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    sheetBtn: {
        paddingVertical: 20,
        width: 120,
        borderRadius: 24,
        alignItems: 'center',
        backgroundColor: COLORS.VIOLET[20],
    },
    sheetBtnText: {
        fontSize: 16,
        color: COLORS.PRIMARY.VIOLET,
        marginTop: 10,
    },
    closeIcon: {
        position: 'absolute',

        top: -5,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexRowText1: { fontWeight: '500', fontSize: 16 },
    flexRowText2: {
        fontWeight: '500',
        fontSize: 13,
        color: COLORS.DARK[25],
    },
    editBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.VIOLET[20],
        borderRadius: 40,
    },
    editBtnText: {
        fontWeight: '500',
        fontSize: 14,
        color: COLORS.PRIMARY.VIOLET,
    }
});
export default styles;
