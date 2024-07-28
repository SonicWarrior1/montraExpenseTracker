import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {RFValue} from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    catCtr: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLOR.LIGHT[20],
      backgroundColor: COLOR.LIGHT[80],
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 24,
      columnGap: 7,
      marginBottom: 20,
    },
    colorBox: {
      padding: 8,
      borderRadius: 10,
    },
    catText: {
      fontSize: RFValue(16),
      fontWeight: '600',
      color: COLOR.DARK[100],
      maxWidth: Dimensions.get('screen').width / 2,
    },
    safeView: {
      flex: 1,
      paddingBottom: 30,
    },
    progressRow: {
      flexDirection: 'row',
      width: '100%',
      columnGap: 4,
      paddingHorizontal: 15,
      marginTop: 20,
    },
    progressIndicator: {
      height: 5,
      flex: 1,
      backgroundColor: COLOR.LIGHT[100],
      borderRadius: 10,
    },
    mainView: {
      flex: 1,
      paddingTop: 40,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    title: {
      fontSize: RFValue(24),
      fontWeight: '600',
      color: COLOR.LIGHT[100],
      opacity: 0.72,
    },
    text1: {
      fontSize: RFValue(32),
      fontWeight: '600',
      color: COLOR.LIGHT[100],
    },
    text2: {
      fontSize: RFValue(24),
      fontWeight: '600',
      color: COLOR.LIGHT[100],
      alignSelf: 'flex-start',
    },
    catRow: {
      flexDirection: 'row',
      columnGap: 15,
      marginTop: 30,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    amt: {
      fontSize: RFValue(40),
      fontWeight: '700',
      color: COLOR.LIGHT[100],
    },
    card: {
      backgroundColor: COLOR.LIGHT[100],
      marginBottom: 10,
      paddingVertical: 15,
      paddingHorizontal: 10,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
    },
    cardText: {
      fontSize: RFValue(24),
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 30,
      color: COLOR.DARK[100],
    },
    amt2: {
      fontSize: RFValue(36),
      fontWeight: '500',
      color: COLOR.DARK[100],
    },
    buttons: {flex: 1, flexDirection: 'row', position: 'absolute'},
    wrapCtr: {
      flexDirection: 'row',
      columnGap: 10,
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
export default styles;
