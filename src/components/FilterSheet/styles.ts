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
    sheetView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
      },
      text1:{fontSize: 16, fontWeight: '600'},
      flexRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      wrapRow:{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: 10,
        rowGap: 10,
      },
      catRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
      },
      pressable:{
        flexDirection: 'row',
        alignItems: 'center',
      },
      text2:{
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.DARK[25],
      }
})

export default styles