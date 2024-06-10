import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = StyleSheet.create({
    success: {
        borderRadius: 40,
        borderLeftWidth: 0,
        backgroundColor: COLORS.DARK[100],
        height: 40,
        width: '90%',
    },
    customBack: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: '100%',
        height: Dimensions.get('window').height + 150,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: 100 }],
    },
    customToast: {
        backgroundColor: COLORS.LIGHT[100],
        padding: 10,
        borderRadius: 10,
        zIndex: 100,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 50,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 20,
    },
});
export default styles;
