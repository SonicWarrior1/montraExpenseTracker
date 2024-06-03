import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    tabCtr: {
        height: 100,
        backgroundColor: COLORS.LIGHT[80],
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    animatedBtnOuter: {
        backgroundColor: COLORS.PRIMARY.LIGHT,
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.PRIMARY.VIOLET,
        width: 70,
        height: 70,
        borderRadius: 40,
        margin: 10,
    },
    filterBtn: {
        paddingVertical: 12,
        paddingHorizontal: 26,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: COLORS.LIGHT[20]
    },
    filterBtnText: {
        fontWeight: '500',
        fontSize: 14,
    },
    editBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.VIOLET[20],
        borderRadius: 40,
    },
    editBtnText: {
        fontWeight: '500',
        fontSize: 14,
        color: COLORS.PRIMARY.VIOLET,
    },
})

export default styles