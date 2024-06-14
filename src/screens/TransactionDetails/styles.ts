import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: {
        flex: 1,
        alignItems: 'center',
        // justifyContent:"center",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    mainView: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    amt: { fontSize: RFValue(48), fontWeight: '700', color: COLOR.LIGHT[100] },
    desc: { fontSize: (16), fontWeight: '500', color: COLOR.LIGHT[80], marginTop: 10 ,maxWidth:250},
    time: { fontSize: (13), fontWeight: '500', color: COLOR.LIGHT[80], marginTop: 10 },
    text1: { color: COLOR.DARK[25], fontSize: RFValue(13), fontWeight: '500' },
    text2: { fontSize: RFValue(15), fontWeight: '600', color: COLOR.DARK[100] },
    descTitle: {
        fontSize: RFValue(16),
        fontWeight: '600',
        color: COLOR.DARK[25],
        marginBottom: 10,
    },
    descText: {
        fontSize: RFValue(16), fontWeight: '600', marginBottom: 20, color: COLOR.DARK[100]
    },
    bottomView: {
        flex: 2,
        backgroundColor: COLOR.LIGHT[100],
        width: '100%',
        paddingHorizontal: 20,
    },
    ctr: {
        flexDirection: 'row',
        backgroundColor: COLOR.LIGHT[100],
        paddingVertical: 15,
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLOR.LIGHT[20],
        transform: [{ translateY: -40 }],

    },
    ctrColumn: { alignItems: 'center', rowGap: 8 },
    descCtr: { flex: 1, transform: [{ translateY: -20 }] },
    btnView: { transform: [{ translateY: -40 }] },
    img: { width: '100%', height: 150, borderRadius: 8 },
});

export default styles;
