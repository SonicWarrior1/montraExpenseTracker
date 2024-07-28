import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {RFValue} from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    safeView: {
      flex: 1,
      backgroundColor: COLOR.LIGHT[100],
      paddingBottom: 20,
    },
    mainView: {
      paddingHorizontal: 30,
      flex: 1,
      backgroundColor: COLOR.LIGHT[100],
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    catCtr: {
      marginTop: 40,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLOR.LIGHT[20],
      backgroundColor: COLOR.LIGHT[80],
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 24,
      columnGap: 7,
      marginBottom: 20,
    },
    colorBox: {
      padding: 8,
      borderRadius: 10,
    },
    catText: {fontSize: RFValue(18), fontWeight: '600', color: COLOR.DARK[100]},
    remainText: {
      fontSize: RFValue(24),
      fontWeight: '600',
      color: COLOR.DARK[100],
    },
    amtText: {
      fontSize: RFValue(40),
      fontWeight: '600',
      marginBottom: 20,
      color: COLOR.DARK[100],
      maxWidth: '95%',
      textAlign: 'center',
    },
    limitCtr: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.RED[100],
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 24,
      columnGap: 7,
      marginTop: 40,
    },
    limitText: {
      fontSize: RFValue(14),
      fontWeight: '600',
      color: COLOR.LIGHT[100],
    },
    progressbar: {width: '100%'},
    marginRight: {marginRight: 15},
  });

export default styles;
