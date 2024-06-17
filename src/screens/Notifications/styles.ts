import { Dimensions, Platform, StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";
import { RFValue } from "react-native-responsive-fontsize";

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLOR.LIGHT[100] },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 15,
    }, headerTitle: { fontSize: RFValue(18), fontWeight: '600', color: COLOR.DARK[100], },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NoNotifText: { fontSize: RFValue(14), fontWeight: '500', color: COLOR.DARK[25] },
    ctr: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHT[20],
        backgroundColor: COLOR.LIGHT[100],
        paddingVertical: 10,
        // columnGap:10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text1: { fontSize: RFValue(16), fontWeight: '500', color: COLOR.DARK[100], marginBottom: 5 },
    text2: {
        fontSize: RFValue(13),
        fontWeight: '500',
        color: COLOR.DARK[25],
        marginTop: 5,
    },
    menu: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        rowGap: 30,
        backgroundColor: COLOR.LIGHT[100],
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        right: Dimensions.get('screen').width / 20,
        top: Platform.OS === 'ios' ? Dimensions.get('screen').height / 9 : Dimensions.get('screen').height / 22,
        shadowRadius: 5,
        shadowOffset: {
            height: 2,
            width: 1,
        },
        elevation:20
    },
    menuText: { color: COLOR.DARK[100] },
    delete: {
        backgroundColor: 'red',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
export default styles