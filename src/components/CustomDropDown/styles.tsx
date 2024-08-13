import {Dimensions, StyleSheet} from 'react-native';
import {COLORS, InputBorderColor} from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    dropdown: {
      borderWidth: 1,
      borderRadius: 20,
      height: Dimensions.get('screen').width * 0.15,
      paddingHorizontal: 20,
      borderColor: InputBorderColor,
      width: '100%',
    },
    itemCtr: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      height: 15,
      width: 15,
      borderRadius: 20,
      marginRight: 8,
    },
    text: {
      fontSize: RFValue(14),
      color: COLOR.DARK[100],
    },
  });
export default styles;
