import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";
import { RFValue } from "react-native-responsive-fontsize";

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    listItemCtr: {
        marginVertical: 5,
        flexDirection: 'row',
        borderRadius: 16,
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        columnGap: 5,
    }, icon: {
        padding: 10,
        backgroundColor: COLOR.DARK[25],
        borderRadius: 16,
    },
    catCtr: {
        flex: 1,
        paddingHorizontal: 10,
        rowGap: 5,
    },
    text1: { fontSize: RFValue(16), fontWeight: '500', color: COLOR.DARK[100] },
    text2: {
        fontSize: RFValue(13),
        fontWeight: '500',
        color: COLOR.DARK[25],
    },
})
export default styles