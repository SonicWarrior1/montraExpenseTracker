import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    ctr: {
        width: 100,
        justifyContent: 'center',
    },
    text1: {
        color: COLOR.DARK[100],
        fontSize: 14,
        marginBottom: 6,
        textAlign: 'center',
    },
    amtCtr: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: COLOR.VIOLET[20],
    },
    amt: { fontWeight: 'bold', textAlign: 'center' },
});

export default styles;
