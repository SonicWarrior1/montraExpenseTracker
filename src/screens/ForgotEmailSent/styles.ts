import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLOR.LIGHT[100] },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    text1: {
        fontWeight: '600',
        fontSize: 24,
        color: COLOR.DARK[100],
    },
    text2: {
        fontWeight: '500',
        fontSize: 16,
        color: COLOR.DARK[100],
        textAlign: 'center',
    },
    flex: {
        flex: 1,
    },
});
export default styles;
