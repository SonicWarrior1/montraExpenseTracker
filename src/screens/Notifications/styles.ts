import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    safeView: { flex: 1, backgroundColor: COLOR.LIGHT[100] },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 15,
    }, headerTitle: { fontSize: 18, fontWeight: '600', color: COLOR.DARK[100], },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NoNotifText: { fontSize: 14, fontWeight: '500', color: COLOR.DARK[25] },
    ctr: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: COLOR.LIGHT[20],
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text1: { fontSize: 16, fontWeight: '500', color: COLOR.DARK[100], },
    text2: {
        fontSize: 13,
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
        right: 15,
        top: 95,
        shadowRadius: 5,
        shadowOffset: {
            height: 2,
            width: 1,
        },
    },
    menuText: { color: COLOR.DARK[100] }
})
export default styles