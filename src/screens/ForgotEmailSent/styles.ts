import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLORS.PRIMARY.LIGHT },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    text1: {
        fontWeight: '600',
        fontSize: 24,
    },
    text2: {
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center',
    },
    flex: {
        flex: 1,
    },
});
export default styles;
