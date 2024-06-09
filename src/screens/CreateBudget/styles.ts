import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
const styles = StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLORS.PRIMARY.VIOLET },
    mainView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    text1: {
        opacity: 0.64,
        alignSelf: 'flex-start',
        fontWeight: '600',
        color: COLORS.LIGHT[80],
        fontSize: 18, paddingHorizontal: 30,
    },
    text2: { color: 'white', fontSize: 64, fontWeight: '600' },
    input: {
        flex: 1,
        fontSize: 64,
        color: 'white',
        fontWeight: '600',
    },
    moneyCtr: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    detailsCtr: {
        backgroundColor: 'white',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    flexRowText1: { fontWeight: '500', fontSize: 16 },
    flexRowText2: {
        fontWeight: '500',
        fontSize: 13,
        color: COLORS.DARK[25],
    },
    sliderTrack:{flex: 1, marginTop: 10, width: '100%'},
    thumb:{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 24,
        backgroundColor: COLORS.VIOLET[100],
      },
      thumbText:{
        fontSize: 14,
        color: COLORS.LIGHT[100],
        fontWeight: '500',
      },
});
export default styles;
