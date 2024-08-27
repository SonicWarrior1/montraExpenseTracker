import React, {useEffect, useRef, useState} from 'react';
import {AppState, Pressable, SafeAreaView, Text, View} from 'react-native';
import style from './styles';
import {SettingsScreenProps} from '../../defs/navigation';
import {languages, NAVIGATION} from '../../constants/strings';
import {ICONS} from '../../constants/icons';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {useAppTheme} from '../../hooks/themeHook';
import CustomHeader from '../../components/CustomHeader';
import {Switch} from 'react-native-switch';
import {setBiometrics} from '../../redux/reducers/userSlice';
import ReactNativeBiometrics from 'react-native-biometrics';
import Toast from 'react-native-toast-message';
import {STRINGS} from '../../localization';

function SettingsScreen({navigation}: Readonly<SettingsScreenProps>) {
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const biometrics = useAppSelector(state => state.user.biometrics);
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const COLORS = useAppTheme();
  const styles = style(COLORS);
  const dispatch = useAppDispatch();
  const rnBiometrics = new ReactNativeBiometrics();
  const [checked, setChecked] = useState<boolean>(biometrics ?? false);
  const appState = useRef(AppState.currentState);
  const lang = useAppSelector(state => state.user.currentUser?.lang);

  useEffect(() => {
    rnBiometrics.isSensorAvailable().then(sensor => {
      if (sensor.error) {
        setChecked(false);
        dispatch(setBiometrics(false));
      }
    });
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      appState.current = nextAppState;
      rnBiometrics.isSensorAvailable().then(sensor => {
        if (sensor.error) {
          setChecked(false);
          dispatch(setBiometrics(false));
        }
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);
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
        subText={
          theme !== undefined
            ? STRINGS[theme[0].toUpperCase() + theme.slice(1)]
            : ''
        }
      />
      <View style={styles.btn}>
        <Text style={styles.text}>{STRINGS.Biometrics}</Text>
        <Pressable
          onPress={async () => {
            if (!checked) {
              try {
                const sensor = await rnBiometrics.isSensorAvailable();
                if (sensor.available) {
                  const {success, error} = await rnBiometrics.simplePrompt({
                    promptMessage:
                      sensor.biometryType === 'FaceID'
                        ? 'Confirm Face Id'
                        : 'Confirm fingerprint',
                  });
                  if (success) {
                    dispatch(setBiometrics(true));
                    setChecked(true);
                  } else {
                    console.log(error);
                    setChecked(false);
                  }
                } else {
                  console.log(sensor.error);
                  if (sensor.error === 'BIOMETRIC_ERROR_NO_HARDWARE') {
                    Toast.show({
                      text1: 'Biometric hardware not detected on this device.',
                      type: 'error',
                    });
                  } else if (sensor.error === 'BIOMETRIC_ERROR_NONE_ENROLLED') {
                    Toast.show({
                      text1: 'No Fingerprints are enrolled',
                      type: 'error',
                    });
                  } else if (
                    sensor.error ===
                    'Error Domain=com.apple.LocalAuthentication Code=-6 "User has denied the use of biometry for this app." UserInfo={NSDebugDescription=User has denied the use of biometry for this app., NSLocalizedDescription=Biometry is not available.}'
                  ) {
                    Toast.show({
                      text1:
                        'User has denied the use of biometry for this app.',
                      type: 'error',
                    });
                  } else if (
                    sensor.error ===
                    'Error Domain=com.apple.LocalAuthentication Code=-7 "No identities are enrolled." UserInfo={NSDebugDescription=No identities are enrolled., NSLocalizedDescription=Biometry is not enrolled.}'
                  ) {
                    Toast.show({
                      text1: 'No identities are enrolled',
                      type: 'error',
                    });
                  } else {
                    Toast.show({
                      text1: `Unexpected Biometric Error ${sensor.error}`,
                      type: 'error',
                    });
                  }
                  // Toast.show({
                  //   text1: sensor.biometryType === 'FaceID'
                  //       ? 'No Face ID registered.'
                  //       : 'No fingerprints enrolled.',
                  //   type: 'error',
                  // });
                  setChecked(false);
                }
              } catch (e) {
                if (e.code === 'Too many attempts. Use screen lock instead.') {
                  Toast.show({
                    text1: 'Too many attempts. Try again after some time',
                    type: 'error',
                  });
                }
                console.log(e);
                setChecked(false);
              }
            }
          }}>
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
            disabled={!checked}
            onValueChange={async val => {
              if (!val) {
                setChecked(false);
                dispatch(setBiometrics(false));
              }
            }}
            value={checked}
          />
        </Pressable>
      </View>
      <ButtonRow
        onPress={() => {
          navigation.navigate(NAVIGATION.Language);
        }}
        text={STRINGS.Language}
        subText={languages[lang ?? 'en-US'].language}
      />
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
