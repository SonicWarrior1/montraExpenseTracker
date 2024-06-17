import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = (COLOR: typeof COLORS) => StyleSheet.create({
    tabCtr: {
        height: 100,
        backgroundColor: COLOR.LIGHT[80],
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    animatedBtnOuter: {
        width: 82,
        height: 82,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.PRIMARY.VIOLET,
        width: 70,
        height: 70,
        borderRadius: 40,
        margin: 10,
    },
    filterBtn: {
        paddingVertical: 12,
        paddingHorizontal: 26,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: COLOR.LIGHT[20],
    },
    filterBtnText: {
        fontWeight: '500',
        fontSize: 14,
    },
    editBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLOR.VIOLET[20],
        borderRadius: 40,
    },
    editBtnText: {
        fontWeight: '500',
        fontSize: 14,
        color: COLOR.PRIMARY.VIOLET,
    },
    tabBtn:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
      },
      btnText:{
        fontSize: RFValue(9),
        fontWeight: '500',
      },
});

export default styles;
