import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    catCtr: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLOR.LIGHT[20],
        backgroundColor: COLOR.LIGHT[80],
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 24,
        columnGap: 7,
        marginBottom: 20,
    },
    colorBox: {
        padding: 8,
        borderRadius: 10,
    },
    catText: { fontSize: 18, fontWeight: '600', color: COLOR.DARK[100] },
    safeView: {
        flex: 1,
        paddingBottom: 30,
    },
    progressRow: {
        flexDirection: 'row',
        width: '100%',
        columnGap: 10,
        paddingHorizontal: 15,
        marginTop: 20,
    },
    progressIndicator: {
        height: 5,
        flex: 1,
        backgroundColor: COLOR.LIGHT[100],
        borderRadius: 10,
    },
    mainView: {
        flex: 1,
        paddingTop: 35,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: COLOR.LIGHT[100],
        opacity: 0.72,
    },
    text1: {
        fontSize: 32,
        fontWeight: '600',
        color: COLOR.LIGHT[100],
    },
    text2: {
        fontSize: 24,
        fontWeight: '600',
        color: COLOR.LIGHT[100],
        alignSelf: 'flex-start',
    },
    catRow: { flexDirection: 'row', columnGap: 15, marginTop: 30 },
    amt: {
        fontSize: 64,
        fontWeight: '700',
        color: COLOR.LIGHT[100],
        
    },
    card: {
        backgroundColor: COLOR.LIGHT[100],
        marginBottom: 60,
        paddingVertical: 30,
        paddingHorizontal: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    cardText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 60,
        color: COLOR.DARK[100]
    },
    amt2: {
        fontSize: 36,
        fontWeight: '500',
        color: COLOR.DARK[100]
    },
    buttons: { flex: 1, flexDirection: 'row', position: 'absolute' },
});
export default styles;
