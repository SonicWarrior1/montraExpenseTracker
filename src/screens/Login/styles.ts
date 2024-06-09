import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLOR.LIGHT[100] },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    orText: {
        fontWeight: 'bold',
        color: COLOR.DARK[25],
    },
    text: { fontWeight: 'bold', fontSize: 16,color:COLOR.DARK[100] },
    btn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLOR.DARK[25],
    },
    flex: { flex: 1 },
    googleRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    forgotText: {
        color: COLOR.PRIMARY.VIOLET,
        fontSize: 18,
        fontWeight: '600',
    },
    signupText: {
        color: COLOR.PRIMARY.VIOLET,
        textDecorationLine: 'underline',
    },
});
export default styles;
