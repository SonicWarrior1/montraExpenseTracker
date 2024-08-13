import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    dropdown: {
      borderWidth: 1,
      borderRadius: 20,
      height: 40,
      paddingHorizontal: 12,
      width: 140,
      borderColor: COLOR.LIGHT[20],
    },
    ctr: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    imgCtr: {
      backgroundColor: COLOR.LIGHT[100],
      padding: 2,
      borderWidth: 1,
      borderColor: COLOR.VIOLET[100],
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    img: {height: 32, width: 32, borderRadius: 30},
    notifCount: {
      padding: 1,
      height: 20,
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: COLOR.LIGHT[100],
      position: 'absolute',
      top: 15,
      left: -5,
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
