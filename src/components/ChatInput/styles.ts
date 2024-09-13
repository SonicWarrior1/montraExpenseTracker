import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    view: {
      borderTopWidth: 1,
      borderColor: COLOR.DARK[25],
      paddingHorizontal: 15,
      paddingBottom: 10,
      paddingTop: 10,
    },
    inputView: {
      // backgroundColor: COLOR.GREEN[60],
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 5,
    },
    input: {
      borderWidth: 1,
      borderRadius: 16,
      height: 50,
      flex: 1,
      paddingHorizontal: 10,
      fontSize: 16,
    },
    closeIcon: {
      position: 'absolute',
      top: -8,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
      zIndex: 10,
    },
  });

export default styles;
