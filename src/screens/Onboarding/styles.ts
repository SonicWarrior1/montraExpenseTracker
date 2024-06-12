import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: COLOR.LIGHT[100]
    },
    mainView: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        flex: 1,
    },
    text1: {
        fontSize: RFValue(32),
        textAlign: 'center',
        fontWeight: 'bold',
        color: COLOR.DARK[100],
        lineHeight: RFValue(39)
    },
    text2: {
        fontSize: RFValue(16),
        textAlign: 'center',
        color: 'grey',
        lineHeight: RFValue(19)
    },
    carouselCtr: { paddingHorizontal: 10, justifyContent: "space-between", flex: 1 },
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
