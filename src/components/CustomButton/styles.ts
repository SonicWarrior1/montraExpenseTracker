import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    btn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

    }, text: { fontWeight: 'bold', fontSize: 18 },
    btnCtr: { flexDirection: 'row', columnGap: 10, alignItems: 'center' },
});
export default styles;
