import { Dimensions, Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLORS.PRIMARY.VIOLET, paddingTop: 30 },
    mainView: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    progressDotCtr: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressDot: {
        height: 32,
        width: 32,
        borderRadius: 20,
        borderColor: COLORS.VIOLET[20],
    },
    text: {
        color: COLORS.LIGHT[80],
        fontSize: 18,
        fontWeight: '600',
    },
    flexRow: { flexDirection: 'row' },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: screenWidth / 3,
        height: 100,
    },
    number: {
        fontSize: 48,
        fontWeight: '500',
        color: 'white',
        fontFamily: 'Inter-Regular'
    },
    menu: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        rowGap: 30,
        backgroundColor: COLORS.LIGHT[100],
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        right: Dimensions.get('screen').width / 12,
        top: Platform.OS === 'ios' ? Dimensions.get('screen').height / 18 : Dimensions.get('screen').height / 15,
        shadowRadius: 5,
        shadowOffset: {
            height: 2,
            width: 1,
        },
        elevation: 20
    },
    menuText: { color: COLORS.DARK[100] }, modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
});
export default styles;
