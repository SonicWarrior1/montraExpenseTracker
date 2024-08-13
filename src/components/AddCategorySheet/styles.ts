import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {RFValue} from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    sheetView: {
      alignItems: 'center',
      paddingTop: 15,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    input: {
      color: COLOR.DARK[100],
      borderWidth: 1,
      borderRadius: 20,
      // height: 60,
      fontSize:RFValue(14),
      paddingHorizontal: 20,
      borderColor: COLORS.LIGHT[20],
      width: '100%',
      height: Dimensions.get('screen').width * 0.15,
    },
    sheetBack: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: COLOR.LIGHT[100],
    },
    btn: {
      width: '100%',
      height: Dimensions.get('screen').width * 0.15,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      backgroundColor: COLORS.PRIMARY.VIOLET,
    },
    btnText: {
      fontWeight: 'bold',
      fontSize: RFValue(16),
      color: COLOR.LIGHT[100],
    },
    btnCtr: {width: '100%'},
  });

export default styles;
