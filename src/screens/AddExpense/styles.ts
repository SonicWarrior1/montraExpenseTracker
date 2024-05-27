import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLORS.PRIMARY.RED },
    mainView: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    text1: {
        opacity: 0.64,
        alignSelf: "flex-start",
        fontWeight: "600",
        color: COLORS.LIGHT[80],
        fontSize: 18, paddingHorizontal: 30,
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 20,
        height: 60,
        paddingHorizontal: 20,
        borderColor: COLORS.LIGHT[20],
        width: '100%',
    }
});
export default styles;
