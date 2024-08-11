import React from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import style from './styles';
import {SettingsScreenProps} from '../../defs/navigation';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {ICONS} from '../../constants/icons';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {useAppTheme} from '../../hooks/themeHook';
import CustomHeader from '../../components/CustomHeader';
import {Switch} from 'react-native-switch';
import {setBiometrics} from '../../redux/reducers/userSlice';
import ReactNativeBiometrics from 'react-native-biometrics';
import Toast from 'react-native-toast-message';

function SettingsScreen({navigation}: Readonly<SettingsScreenProps>) {
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const biometrics = useAppSelector(state => state.user.biometrics);
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const COLORS = useAppTheme();
  const styles = style(COLORS);
  const dispatch = useAppDispatch();
  const rnBiometrics = new ReactNativeBiometrics();
  return (
    <SafeAreaView style={styles.safeView}>
      <CustomHeader
        backgroundColor={COLORS.LIGHT[100]}
        navigation={navigation}
        title={STRINGS.Settings}
        color={COLORS.DARK[100]}
        bottomBorder={true}
      />
      <ButtonRow
        onPress={() => {
          navigation.navigate(NAVIGATION.Currency);
        }}
        text={STRINGS.Currency}
        subText={currency!}
      />
      <ButtonRow
        onPress={() => {
          navigation.navigate(NAVIGATION.Theme);
        }}
        text={STRINGS.Theme}
        subText={theme?.[0]?.toLocaleUpperCase() + theme?.slice(1)!}
      />
      <Pressable style={styles.btn} onPress={() => {}}>
        <Text style={styles.text}>Biometrics</Text>
        <Switch
          backgroundActive={COLORS.VIOLET[100]}
          backgroundInactive={COLORS.VIOLET[20]}
          activeText=""
          inActiveText=""
          barHeight={30}
          circleSize={24}
          switchBorderRadius={16}
          innerCircleStyle={{width: 24, height: 24}}
          switchLeftPx={5}
          switchRightPx={5}
          circleBorderWidth={0}
          onValueChange={async val => {
            if (val) {
              const sensor = await rnBiometrics.isSensorAvailable();
              if (sensor.available) {
                const {success} = await rnBiometrics.simplePrompt({
                  promptMessage:
                    sensor.biometryType === 'FaceID'
                      ? 'Confirm Face Id'
                      : 'Confirm fingerprint',
                });
                if (success) {
                  dispatch(setBiometrics(true));
                }
              } else {
                Toast.show({text1: sensor.error, type: 'error'});
              }
            } else {
              dispatch(setBiometrics(false));
            }
          }}
          value={biometrics ?? false}
        />
      </Pressable>
    </SafeAreaView>
  );
}

export default React.memo(SettingsScreen);

function ButtonRow({
  text,
  subText,
  onPress,
}: Readonly<{
  text: string;
  subText: string;
  onPress: () => void;
}>): React.JSX.Element {
  const COLORS = useAppTheme();
  const styles = style(COLORS);
  return (
    <Pressable style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.iconRow}>
        <Text style={styles.subText}>{subText}</Text>
        {ICONS.ArrowRight({
          height: 22,
          width: 22,
          color: COLORS.VIOLET[100],
          borderColor: COLORS.VIOLET[100],
        })}
      </View>
    </Pressable>
  );
}
