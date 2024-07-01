import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: { flex: 1 },
    mainView: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    financialBtn: {
        width: '100%',
        height: Dimensions.get('screen').height * 0.06,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: COLOR.SECONDARY.VIOLET,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 15,
        marginBottom: 10
    },
    financialText: { fontSize: RFValue(15), color: COLOR.PRIMARY.VIOLET },
     emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLOR.DARK[25],
        textAlign: 'center',
    },
    sectionHeader: { fontSize: RFValue(18), fontWeight: '600', padding: 8, color: COLOR.DARK[100] },
});

export default styles;
