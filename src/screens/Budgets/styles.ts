import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = StyleSheet.create({
    scrollView: { flex: 1, marginTop: 10, width: '100%' },
    safeView: {
        flex: 1,
        backgroundColor: COLORS.PRIMARY.VIOLET,
    },
    mainView: {
        flex: 9,
        backgroundColor: COLORS.LIGHT[80],
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    month: {
        fontSize: 24,
        color: COLORS.LIGHT[100],
        fontWeight: '500',
    },
    monthRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    centerCtr: { flex: 1, justifyContent: 'center', paddingHorizontal: 50 },
    centerText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.DARK[25],
        textAlign: 'center',
    },
    listItemCtr: {
        backgroundColor: COLORS.LIGHT[100],
        marginVertical: 10,
        borderRadius: 16,
        padding: 16,
    },
    catRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    catCtr: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.LIGHT[20],
        backgroundColor: COLORS.LIGHT[80],
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 24,
        columnGap: 7,
    },
    colorBox: {
        height: 14,
        width: 14,
        borderRadius: 10,
        backgroundColor: COLORS.BLUE[100],
    },
    catText: { fontSize: 14, fontWeight: '500' },
    text1: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 5,
        marginBottom: 5,
    },
    text2: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 5,
        color: COLORS.DARK[25],
    },
    limitText: {
        fontSize: 14,
        fontWeight: '400',
        marginTop: 10,
        color: COLORS.PRIMARY.RED,
    },
});
export default styles;
