import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLOR.LIGHT[100] },
    mainView: {
        flex: 1,
        paddingTop: Dimensions.get('screen').height * 0.085,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    orText: {
        fontWeight: 'bold',
        color: COLOR.DARK[25],
        fontSize: RFValue(14)
    },
    text: { fontWeight: 'bold', fontSize: RFValue(16), color: COLOR.DARK[100] },
    btn: {
        width: '100%',
        height: Dimensions.get('screen').height * 0.066,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLOR.LIGHT[20],
    },
    flex: { flex: 1 },
    googleRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    forgotText: {
        color: COLOR.PRIMARY.VIOLET,
        fontSize: RFValue(18),
        fontWeight: '600',
    },
    signupText: {
        color: COLOR.PRIMARY.VIOLET,
        textDecorationLine: 'underline',
        fontSize: RFValue(16),
        fontWeight: "500"
    },
    dontHaveAcc: { color: COLORS.DARK[25], fontSize: RFValue(16), fontWeight: "500" }
});
export default styles;
