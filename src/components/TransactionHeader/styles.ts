import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";
const screenHeight = Dimensions.get('screen').height;
const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        height: screenHeight * 0.06,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 10,
        marginTop: 10
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 20,
        height: 40,
        paddingHorizontal: 20,
        borderColor: COLORS.LIGHT[20],
        width: 120,
    },
    filterBtn: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.LIGHT[20],
    }
})

export default styles;