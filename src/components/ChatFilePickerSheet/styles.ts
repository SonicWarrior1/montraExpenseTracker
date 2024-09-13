import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {RFValue} from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    sheetBtn: {
      paddingVertical: 20,
      width: 70,
      height: 70,
      borderRadius: 200,
      alignItems: 'center',
      backgroundColor: COLORS.VIOLET[20],
    },
    sheetBtnText: {
      fontSize: RFValue(14),
      color: COLORS.PRIMARY.VIOLET,
      fontWeight: '500',
      marginTop: 10,
    },
    sheetView: {
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // flexWrap:'wrap',
      paddingHorizontal: 20,
      alignItems: 'center',
      rowGap:20,
      // gap: 10,
      marginTop: 20,
    },
    sheetBack: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: COLOR.LIGHT[100],
    },
  });
export default styles;
