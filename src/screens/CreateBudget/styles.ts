import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';
const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLOR.PRIMARY.VIOLET },
    mainView: {
        flex: 1,
        justifyContent: 'flex-end',

    },
    text1: {
        opacity: 0.64,
        alignSelf: 'flex-start',
        fontWeight: '600',
        color: COLOR.LIGHT[80],
        fontSize: RFValue(18), paddingHorizontal: 30,
    },
    text2: { color: COLOR.LIGHT[100], fontSize: 64, fontWeight: '600' },
    input: {
        flex: 1,
        fontSize: RFValue(64),
        color: COLOR.LIGHT[100],
        fontWeight: '600',
    },
    moneyCtr: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    detailsCtr: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: COLOR.LIGHT[100]
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    flexRowText1: { fontWeight: '500', fontSize: RFValue(16), color: COLOR.DARK[100] },
    flexRowText2: {
        fontWeight: '500',
        fontSize: RFValue(13),
        color: COLOR.DARK[25],
    },
    sliderTrack: { height: 10, width: '100%', borderRadius: 20 },
    thumb: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 24,
        backgroundColor: COLOR.VIOLET[100],
    },
    thumbText: {
        fontSize: RFValue(14),
        color: COLOR.LIGHT[100],
        fontWeight: '500',
    },
});
export default styles;
