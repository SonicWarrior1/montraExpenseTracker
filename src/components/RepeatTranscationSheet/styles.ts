import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    sheetView:{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
        paddingHorizontal: 15,
      },
      flexRow:{flexDirection: 'row', columnGap: 10},
      sheetBack:{borderTopLeftRadius: 32, borderTopRightRadius: 32},
      flex:{flex: 1},
});
export default styles;
