import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';

const styles = (COLOR:typeof COLORS)=> StyleSheet.create({
  safeView: {flex: 1, backgroundColor: COLOR.LIGHT[100]},
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
    color: COLOR.DARK[100],
  },
  flex: {
    flex: 1,
  },
});
export default styles;
