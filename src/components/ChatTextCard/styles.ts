import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 5,
      //   flexDirection: 'row',
      //   justifyContent: 'flex-start',
      alignItems: 'flex-end',
      marginVertical: 5,
      maxWidth: '90%',
    },
    msg: {fontSize: 18},
    time: {fontSize: 12, color: COLOR.DARK[50]},
  });

export default styles;
