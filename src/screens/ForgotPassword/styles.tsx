import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';

const styles = StyleSheet.create({
  safeView: {flex: 1, backgroundColor: COLORS.PRIMARY.LIGHT},
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  flex: {
    flex: 1,
  },
});
export default styles;
