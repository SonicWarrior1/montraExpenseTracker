import {Text, View} from 'react-native';
import {BaseToast, ToastConfig} from 'react-native-toast-message';
import {COLORS} from '../../constants/commonStyles';
import {ICONS} from '../../constants/icons';
import styles from './styles';

export const toastConfig: ToastConfig = {
  success: props => {
    return (
      <BaseToast
        {...props}
        text1NumberOfLines={2}
        text1Props={{
          style: {
            color: COLORS.LIGHT[100],
            alignSelf: 'center',
            fontSize:16
          },
        }}
        style={[styles.success,{backgroundColor:COLORS.BLUE[100]}]}
      />
    );
  },
  error: props => {
    return (
      <BaseToast
        {...props}
        text1NumberOfLines={2}
        text1Props={{
          style: {
            color: COLORS.LIGHT[100],
            alignSelf: 'center',
            fontSize:16
          },
        }}
        style={[styles.success,{backgroundColor:COLORS.RED[100]}]}
      />
    );
  },
  custom: ({text1}) => (
    <View style={styles.customBack}>
      <View style={styles.customToast}>
        {ICONS.Success({height: 70, width: 70})}
        <Text style={styles.text}>{text1}</Text>
      </View>
    </View>
  ),
};
