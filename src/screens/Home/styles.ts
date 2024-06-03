import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderRadius: 20,
        height: 40,
        paddingHorizontal: 20,
        borderColor: COLORS.LIGHT[40],
        minWidth: 120,
    },
    moneyCtr: {
        height: 80,
        borderRadius: 28,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        columnGap: 10,
        alignItems: 'center',
    },
    iconCtr: {
        backgroundColor: COLORS.LIGHT[100],
        justifyContent: 'center',
        padding: 8,
        borderRadius: 16,
    },
    text1: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.LIGHT[100],
    },
    text2: {
        fontSize: 22,
        fontWeight: '600',
        color: COLORS.LIGHT[100],
    }
})

export default styles