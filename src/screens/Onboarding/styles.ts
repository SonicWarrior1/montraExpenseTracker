import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: COLOR.LIGHT[100]
    },
    mainView: {
        // flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        flex: 1,
    },
    text1: {
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
        color: COLOR.DARK[100],
    },
    text2: {
        fontSize: 16,
        textAlign: 'center',
        color: 'grey',
    },
    carouselCtr: { paddingHorizontal: 20 },
    progressDotCtr: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressDot: {

        borderRadius: 10,
    },
});
export default styles;
