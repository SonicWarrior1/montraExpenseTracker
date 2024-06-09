import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLORS.PRIMARY.LIGHT },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    orText: {
        fontWeight: 'bold',
        color: COLORS.DARK[25],
    },
    text: { fontWeight: 'bold', fontSize: 16 },
    btn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.DARK[25],
    },
    flex: { flex: 1 },
    googleRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    forgotText: {
        color: COLORS.PRIMARY.VIOLET,
        fontSize: 18,
        fontWeight: '600',
    },
    signupText: {
        color: COLORS.PRIMARY.VIOLET,
        textDecorationLine: 'underline',
    },
});
export default styles;
