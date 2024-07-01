import { Dimensions, StyleSheet } from 'react-native';
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const styles = StyleSheet.create({
    pressable: {
        height: screenHeight,
        width: screenWidth,
        position: 'absolute',
    },
    backdrop: {
        height: screenHeight,
        width: screenWidth,
    },
});
export default styles;
