import {Dimensions, StyleSheet} from 'react-native';
import {COLORS, InputBorderColor} from '../../constants/commonStyles';
import {RFValue} from 'react-native-responsive-fontsize';
const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    safeView: {backgroundColor: COLOR.PRIMARY.RED},
    mainView: {
      justifyContent: 'flex-end',
    },
    text1: {
      opacity: 0.64,
      alignSelf: 'flex-start',
      fontWeight: '600',
      color: COLOR.LIGHT[80],
      fontSize: RFValue(20),
      paddingHorizontal: 30,
    },
    text2: {color: COLOR.LIGHT[100], fontSize: RFValue(64), fontWeight: '600'},
    input: {
      flex: 1,
      fontSize: RFValue(64),
      color: COLOR.LIGHT[100],
      fontWeight: '600',
    },
    amtError: {left: 20, paddingBottom: 10},
    dropdown: {
      borderWidth: 1,
      borderRadius: 20,
      height: 60,
      paddingHorizontal: 20,
      borderColor: COLOR.LIGHT[20],
      width: '100%',
    },
    moneyCtr: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 30,
    },
    detailsCtr: {
      backgroundColor: COLOR.LIGHT[100],
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 25,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
    },
    attachementCtr: {
      height: Dimensions.get('screen').width * 0.15,
      width: '100%',
      borderWidth: 1,
      borderRadius: 20,
      borderStyle: 'dashed',
      borderColor: COLOR.LIGHT[20],
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    attachementText: {color: COLOR.DARK[25], fontSize: RFValue(14)},
    displayImg: {
      position: 'absolute',
      left: 90,
      top: -5,
      zIndex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
    },
    sheetBtn: {
      paddingVertical: 20,
      width: 120,
      borderRadius: 24,
      alignItems: 'center',
      backgroundColor: COLOR.VIOLET[20],
    },
    sheetBtnText: {
      fontSize: RFValue(16),
      color: COLOR.PRIMARY.VIOLET,
      marginTop: 10,
    },
    closeIcon: {
      position: 'absolute',
      top: -5,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      columnGap: 8,
    },
    flexRowText1: {
      fontWeight: '500',
      fontSize: RFValue(16),
      color: COLOR.DARK[100],
    },
    flexRowText2: {
      fontWeight: '500',
      fontSize: RFValue(13),
      color: COLOR.DARK[25],
    },
    editBtn: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: COLOR.VIOLET[20],
      borderRadius: 40,
    },
    editBtnText: {
      fontWeight: '500',
      fontSize: RFValue(14),
      color: COLOR.PRIMARY.VIOLET,
    },
    transferRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 30,
    },
    transferIcon: {
      backgroundColor: COLOR.LIGHT[100],
      padding: 8,
      borderWidth: 1,
      borderRadius: 30,
      position: 'absolute',
      left: '44%',
      borderColor: InputBorderColor,
    },
    flex: {flex: 1},
  });
export default styles;
