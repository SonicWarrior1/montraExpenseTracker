import React from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {SettingsScreenProps} from '../../defs/navigation';
import {NAVIGATION} from '../../constants/strings';
import {ICONS} from '../../constants/icons';
import {useAppSelector} from '../../redux/store';
import style from './styles';
import {useAppTheme} from '../../hooks/themeHook';

function SettingsScreen({navigation}: Readonly<SettingsScreenProps>) {
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const COLORS = useAppTheme();
  const styles = style(COLORS);
  return (
    <SafeAreaView style={styles.safeView}>
      <ButtonRow
        onPress={() => {
          navigation.navigate(NAVIGATION.Currency);
        }}
        text="Currency"
        subText={currency!}
      />
      <ButtonRow
        onPress={() => {
          navigation.navigate(NAVIGATION.Theme);
        }}
        text="Theme"
        subText={theme?.toLocaleUpperCase()!}
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
