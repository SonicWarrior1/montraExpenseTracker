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
    btn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLOR.DARK[25],
    },
    text: { fontWeight: 'bold', fontSize: 16,color:COLOR.DARK[100] },
    googleBtn: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    flex:{flex: 1},
});
export default styles;
