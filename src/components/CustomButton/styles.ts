import { Dimensions, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = StyleSheet.create({
    btn: {
        width: '100%',
        height: Dimensions.get('screen').height*0.066,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,

    }, text: { fontWeight: 'bold', fontSize: RFValue(16) },
    btnCtr: { flexDirection: 'row', columnGap: 10, alignItems: 'center' },
});
export default styles;
