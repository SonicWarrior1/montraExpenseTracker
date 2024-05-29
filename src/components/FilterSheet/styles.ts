import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
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