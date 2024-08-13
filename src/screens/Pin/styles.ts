import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import {RFValue} from 'react-native-responsive-fontsize';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight =
  screenHeight - windowHeight - (StatusBar?.currentHeight ?? 0);
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
    height: RFValue(28),
    width: RFValue(28),
    borderRadius: 200,
    borderColor: COLORS.VIOLET[20],
  },
  text: {
    color: COLORS.LIGHT[80],
    fontSize: RFValue(18),
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
    rowGap: 20,
    backgroundColor: COLORS.LIGHT[100],
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    right: screenWidth / 23,
    top: Platform.OS === 'ios' ? screenHeight / 7.6 : screenHeight / 14,
    shadowRadius: 5,
    shadowOffset: {
      height: 2,
      width: 1,
    },
    elevation: 20,
    borderRadius: 8,
  },
  menuText: {color: COLORS.DARK[100]},
  modalBackground: {
    position: 'absolute',
    height: screenHeight,
    width: screenWidth * 0.9,
    paddingBottom: 50,
  },
  upperView: {
    paddingTop: screenHeight * 0.03,
    rowGap: 100,
    maxHeight:
      Platform.OS === 'ios'
        ? screenHeight / 2.2
        : (screenHeight - navbarHeight * 1.074) / 2.13,
    height: '100%',
  },
  keypad: {
    height: screenHeight / 2,
  },
  modal: {
    // width: '90%',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 16,
  },
});
export default styles;
