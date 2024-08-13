import {Dimensions, Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {RFValue} from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    dropdown: {
      borderWidth: 1,
      borderRadius: 20,
      height: 40,
      fontSize: RFValue(14),
      paddingHorizontal: 20,
      borderColor: COLOR.LIGHT[20],
      width: 160,
    },
    filterBtn: {
      padding: 3,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: COLOR.LIGHT[20],
    },
    colorBox: {
      height: 14,
      width: 14,
      borderRadius: 10,
    },
    catCtr2: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLOR.LIGHT[20],
      backgroundColor: COLOR.LIGHT[100],
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 24,
      columnGap: 7,
    },
    catText: {
      fontSize: RFValue(14),
      fontWeight: '500',
      color: COLOR.DARK[100],
      maxWidth: 180,
    },
    catAmt: {fontSize: RFValue(24), fontWeight: '500'},
    safeView: {backgroundColor: COLOR.LIGHT[100]},
    monthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    graphBtnCtr: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 8,
      borderColor: COLOR.LIGHT[40],
    },
    graphBtn: {
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    amt: {
      fontSize: Platform.OS === 'ios' ? RFValue(28) : RFValue(32),
      fontWeight: '700',
      paddingLeft: 20,
      color: COLOR.DARK[100],
    },
    graphView: {transform: [{translateX: -28}]},
    pieView: {
      alignItems: 'center',
      paddingVertical: 20,
      justifyContent: 'center',
    },
    typeRow: {
      alignSelf: 'center',
      justifyContent: 'center',
    },
    innerTypeRow: {
      flexDirection: 'row',
      // backgroundColor: COLORS.LIGHT[60],
      justifyContent: 'center',
      padding: 5,
      borderRadius: 32,
    },
    typeBtn: {
      width: Dimensions.get('screen').width / 2.35,
      height: Dimensions.get('screen').width / 8,
      maxHeight:60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 32,
    },
    typeText: {
      fontSize: RFValue(14),
      fontWeight: '500',
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    catRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    noDataCtr: {height: 230, justifyContent: 'center'},
    pieCenterText: {fontSize: 28, fontWeight: '700', color: COLOR.DARK[100]},
    emptyText: {fontSize: 16, fontWeight: '500', color: COLOR.DARK[25]},
    emtpyCtr: {
      height: 230,
      transform: [{translateX: 28}],
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemCtr: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontSize: 16,
      color: COLOR.DARK[100],
    },
  });

export default styles;
