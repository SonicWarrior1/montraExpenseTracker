import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {COLORS} from '../../constants/commonStyles';
import CustomButton from '../CustomButton';
import SheetBackdrop from '../SheetBackDrop';
import {useAppTheme} from '../../hooks/themeHook';
import style from './styles';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import { STRINGS } from '../../localization';

function DeleteSheet({
  text1,
  text2,
  bottomSheetModalRef,
  handleDelete,
}: Readonly<{
  text1: string;
  text2: string;
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  handleDelete: () => Promise<void>;
}>) {
  const snapPoints = useMemo(() => ['30%'], []);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={SheetBackdrop}
        backgroundStyle={styles.sheetBack}
        handleIndicatorStyle={{backgroundColor: COLOR.VIOLET[40]}}>
        <BottomSheetView style={styles.sheetView}>
          <Text style={styles.text1}>{text1}</Text>
          <Text style={styles.text2}>{text2}</Text>
          <View style={styles.BtnRow}>
            <View style={styles.flex}>
              <CustomButton
                title={STRINGS.No}
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                }}
                backgroundColor={COLORS.VIOLET[20]}
                textColor={COLORS.VIOLET[100]}
              />
            </View>
            <View style={styles.flex}>
              <CustomButton title={STRINGS.Yes} onPress={handleDelete} />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export default DeleteSheet;
