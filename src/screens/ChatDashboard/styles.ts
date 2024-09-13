import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/commonStyles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const styles = (COLOR: typeof COLORS) =>
  StyleSheet.create({
    safeView: {
      flex: 1,
      backgroundColor: COLOR.LIGHT[40],
    },
    newBtn: {
      position: 'absolute',
      bottom: 50,
      right: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLOR.PRIMARY.GREEN,
      width: 60,
      height: 60,
      borderRadius: 40,
      transform: [{rotateZ: '45deg'}],
    },
    modalBackground: {
      position: 'absolute',
      height: screenHeight,
      width: screenWidth * 0.9,
      paddingBottom: 50,
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
    imgCtr: {
      width: 50,
      height: 50,
      backgroundColor: 'red',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: COLOR.LIGHT[100],
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginHorizontal: 15,
      marginVertical: 10,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    photoText: {color: 'white', fontSize: 24, fontWeight: '600'},
    name: {
      color: COLOR.DARK[100],
      fontSize: 24,
      fontWeight: '500',
      marginLeft: 10,
    },
  });

export default styles;
