import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    sheetBtn: {
        paddingVertical: 20,
        width: 120,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: COLORS.VIOLET[20],
    },
    sheetBtnText: {
        fontSize: RFValue(16),
        color: COLORS.PRIMARY.VIOLET,
        fontWeight:"500",
        marginTop: 10,
    },
    sheetView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
    },
    sheetBack: { borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: COLOR.LIGHT[100] },
});
export default styles;
