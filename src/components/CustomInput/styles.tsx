import {Dimensions, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import { InputBorderColor } from '../../constants/commonStyles';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 20,
    height: Dimensions.get('screen').width * 0.15,
    paddingHorizontal: 20,
    borderColor: InputBorderColor,
    width: '100%',
    fontSize: RFValue(14),
  },
});
export default styles;
