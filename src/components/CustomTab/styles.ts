import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles = StyleSheet.create({
    tabCtr: {
        height: 90,
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
    }
})

export default styles