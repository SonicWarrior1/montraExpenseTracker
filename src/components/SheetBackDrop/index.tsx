import React from 'react';
import {Pressable, useColorScheme} from 'react-native';
import {useAppSelector} from '../../redux/store';
import {
  DarkBackDropColor,
  LightBackDropColor,
} from '../../constants/commonStyles';
// Third party Libraries
import {useBottomSheetModal} from '@gorhom/bottom-sheet';

function SheetBackdrop() {
  const sheet = useBottomSheetModal();
  const scheme = useColorScheme();
  const theme = useAppSelector(state => state.user.currentUser?.theme);
  const finalTheme = theme === 'device' ? scheme : theme;
  return (
    <Pressable
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor:
          finalTheme === 'dark' ? DarkBackDropColor : LightBackDropColor,
        position: 'absolute',
      }}
      onPress={() => {
        sheet.dismissAll();
      }}
    />
  );
}

export default SheetBackdrop;
