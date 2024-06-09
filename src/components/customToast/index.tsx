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
        renderLeadingIcon={() => <View style={{width: '8%'}} />}
        text1Props={{style: {color: COLORS.LIGHT[100]}}}
        style={styles.success}
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
