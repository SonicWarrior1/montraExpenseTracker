import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
const screenHeight = Dimensions.get('screen').height;
const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    header: {
      backgroundColor: 'transparent',
      height: screenHeight * 0.06,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 20,
      marginTop: 20,
    },
    dropdown: {
      borderWidth: 1,
      borderRadius: 20,
      height: 40,
      paddingHorizontal: 12,
      width: 140,
      borderColor: COLOR.LIGHT[20],
    },
    filterBtn: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: COLOR.LIGHT[20],
    },
    notifCount: {
      height: 25,
      width: 25,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: COLOR.VIOLET[100],
      position: 'absolute',
      right: 0,
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
