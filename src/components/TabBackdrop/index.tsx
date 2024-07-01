import React from 'react';
import {Pressable, useColorScheme} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constants/commonStyles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {setTabButton} from '../../redux/reducers/transactionSlice';
import styles from './styles';

function TabBackdrop() {
  const isOpen = useAppSelector(state => state.transaction.isTabButtonOpen);
  const dispatch = useAppDispatch();
  const scheme = useColorScheme();
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const finalTheme = theme === 'device' ? scheme : theme;
  return (
    <Pressable
      onPress={() => {
        dispatch(setTabButton(false));
      }}
      style={[
        styles.pressable,
        {
          zIndex: isOpen ? 1 : -1,
        },
      ]}>
      <LinearGradient
        colors={
          finalTheme === 'dark'
            ? ['#00000000', COLORS.VIOLET[40]]
            : ['#ffffff00', COLORS.VIOLET[40]]
        }
        style={styles.backdrop}
      />
    </Pressable>
  );
}

export default TabBackdrop;
