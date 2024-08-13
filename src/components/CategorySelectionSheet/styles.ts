import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {RFValue} from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    filterBtn: {
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: COLOR.LIGHT[20],
    },
    filterBtnText: {
      fontWeight: '500',
      fontSize: RFValue(14),
      color: COLOR.DARK[100],
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: 10,
      rowGap: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sheetBack: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: COLOR.LIGHT[100],
    },
    text1: {
      fontSize: RFValue(15),
      fontWeight: '600',
      color: COLOR.DARK[100],
      marginBottom: 10,
    },
    sheet: {
      paddingHorizontal: 20,
      flex: 1,
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    scrollview: {maxHeight: '72%', marginBottom: 15},
  });
export default styles;
