import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLOR.PRIMARY.LIGHT },
    mainView: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    financialBtn: {
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: COLOR.SECONDARY.VIOLET,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    financialText: { fontSize: 18, color: COLOR.PRIMARY.VIOLET },
    editBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLOR.VIOLET[20],
        borderRadius: 40,
    },
    editBtnText: {
        fontWeight: '500',
        fontSize: 14,
        color: COLOR.PRIMARY.VIOLET,
    },
    filterBtn: {
        paddingVertical: 12,
        paddingHorizontal: 26,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: COLOR.LIGHT[20],
    },
    filterBtnText: {
        fontWeight: '500',
        fontSize: 14,
    },
    listItemCtr: {
        marginVertical: 5,
        flexDirection: 'row',
        borderRadius: 16,
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        columnGap: 5,
    }, icon: {
        padding: 10,
        backgroundColor: COLOR.DARK[25],
        borderRadius: 16,
    },
    catCtr: {
        flex: 1,
        paddingHorizontal: 10,
        rowGap: 5,
    },
    text1: { fontSize: 16, fontWeight: '500',color:COLOR.DARK[100] },
    text2: {
        fontSize: 13,
        fontWeight: '500',
        color: COLOR.DARK[25],
    },
    sectionHeader: { fontSize: 18, fontWeight: '600', padding: 8,color:COLOR.DARK[100]  },
});

export default styles;
