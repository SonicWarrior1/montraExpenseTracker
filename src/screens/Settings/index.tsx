import React from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import style from './styles';
import {SettingsScreenProps} from '../../defs/navigation';
import {NAVIGATION, STRINGS} from '../../constants/strings';
import {ICONS} from '../../constants/icons';
import {useAppSelector} from '../../redux/store';
import {useAppTheme} from '../../hooks/themeHook';
import CustomHeader from '../../components/CustomHeader';

function SettingsScreen({navigation}: Readonly<SettingsScreenProps>) {
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const COLORS = useAppTheme();
  const styles = style(COLORS);
  return (
    <SafeAreaView style={styles.safeView}>
      <CustomHeader
        backgroundColor={COLORS.LIGHT[100]}
        navigation={navigation}
        title="Settings"
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
    </SafeAreaView>
  );
}

export default SettingsScreen;

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
