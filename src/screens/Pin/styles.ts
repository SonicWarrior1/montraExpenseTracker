import {Dimensions, Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY.VIOLET,
    paddingTop: 10,
  },
  mainView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressDotCtr: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    height: 32,
    width: 32,
    borderRadius: 20,
    borderColor: COLORS.VIOLET[20],
  },
  text: {
    color: COLORS.LIGHT[80],
    fontSize: 18,
    fontWeight: '600',
  },
  flexRow: {flexDirection: 'row'},
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth / 3,
    height: 100,
  },
  number: {
    fontSize: 48,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Inter-Regular',
  },
  menu: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    rowGap: 30,
    backgroundColor: COLORS.LIGHT[100],
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    right: screenWidth / 11,
    top: Platform.OS === 'ios' ? screenHeight / 8.5 : screenHeight / 12,
    shadowRadius: 5,
    shadowOffset: {
      height: 2,
      width: 1,
    },
    elevation: 20,
  },
  menuText: {color: COLORS.DARK[100]},
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  upperView: {
    paddingTop: screenHeight * 0.03,
    rowGap: 100,
  },
  modal: {
    width: '90%',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 16,
  },
});
export default styles;
