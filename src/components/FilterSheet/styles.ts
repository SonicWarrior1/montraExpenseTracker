import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {RFValue} from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    filterBtn: {
      paddingVertical: 12,
      paddingHorizontal: 26,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: COLOR.LIGHT[20],
    },
    filterBtnText: {
      fontWeight: '500',
      fontSize: RFValue(13),
      color: COLOR.DARK[100],
    },
    editBtn: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: COLOR.VIOLET[20],
      borderRadius: 40,
    },
    editBtnText: {
      fontWeight: '500',
      fontSize: RFValue(13),
      color: COLOR.PRIMARY.VIOLET,
    },
    sheetView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      paddingTop: 10,
    },
    text1: {fontSize: RFValue(15), fontWeight: '600', color: COLOR.DARK[100]},
    flexRow: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      columnGap: 8,
      alignItems: 'center',
    },
    wrapRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      columnGap: 10,
      rowGap: 10,
    },
    catRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    pressable: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text2: {
      fontSize: RFValue(13),
      fontWeight: '500',
      color: COLOR.DARK[25],
    },
    sheetBack: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: COLOR.LIGHT[100],
    },
    sheet: {
      paddingHorizontal: 20,
      flex: 1,
      justifyContent: 'space-between',
      marginBottom: 30,
    },
  });

export default styles;
