import { Dimensions, Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    view: {
        width: Dimensions.get('screen').width,
        paddingTop: Platform.OS === 'ios' ? 10 : 20,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: COLOR.LIGHT[40],
    },
    text: {
        fontSize: RFValue(18),
        fontWeight: '600',
    },
});

export default styles;
