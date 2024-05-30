import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/commonStyles";

const styles=StyleSheet.create({
    sheetView:{
        alignItems: 'center',
        paddingTop: 15,
        justifyContent: 'center',
        paddingHorizontal: 20,
      },
      text1:{
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
      },
      text2:{
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.DARK[25],
        textAlign: 'center',
        marginBottom: 20,
      },
      BtnRow:{flexDirection: 'row', flex: 1, columnGap: 20}
})
export default styles