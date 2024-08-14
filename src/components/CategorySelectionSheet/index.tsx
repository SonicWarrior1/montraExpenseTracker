import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import style from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {openCatSheet} from '../../redux/reducers/transactionSlice';
import SheetBackdrop from '../SheetBackDrop';
import CustomButton from '../CustomButton';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {ScrollView} from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {convertCatLang, STRINGS} from '../../localization';

function CategorySelectionSheet({
  filterCategory,
  setFilterCategory,
}: Readonly<{
  filterCategory: string[];
  setFilterCategory: React.Dispatch<React.SetStateAction<string[]>>;
}>) {
  // constants
  const dispatch = useAppDispatch();
  const snapPoints = useMemo(() => ['40%'], []);
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // ref
  const ref = useRef<BottomSheetModal>(null);
  // redux
  const isOpen = useAppSelector(state => state.transaction.isCatOpen);
  const selected = useAppSelector(state => state.transaction.filters.cat);
  const incomeCats = useAppSelector(
    state => state.user.currentUser?.incomeCategory,
  );
  const expenseCats = useAppSelector(
    state => state.user.currentUser?.expenseCategory,
  );

  // state
  const [category, setCategory] = useState<string[]>([]);
  useEffect(() => {
    setCategory(filterCategory);
    if (isOpen === true) {
      ref.current?.present();
    } else {
      ref.current?.close();
    }
  }, [filterCategory, isOpen, selected, setCategory]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        index={0}
        snapPoints={snapPoints}
        ref={ref}
        onDismiss={() => {
          dispatch(openCatSheet(false));
        }}
        backdropComponent={SheetBackdrop}
        backgroundStyle={styles.sheetBack}
        handleIndicatorStyle={{backgroundColor: COLOR.VIOLET[40]}}>
        <BottomSheetView style={styles.sheet}>
          <ScrollView style={styles.scrollview}>
            {['expense', 'income'].map(catTypes => (
              <View key={catTypes}>
                <Text style={styles.text1}>
                  {convertCatLang(
                    STRINGS,
                    catTypes[0].toUpperCase() + catTypes.slice(1),
                  )}
                </Text>
                <View style={styles.row}>
                  {(catTypes === 'income' ? incomeCats : expenseCats)
                    ?.slice(1)
                    ?.map(item => (
                      <Pressable
                        key={item}
                        style={[
                          styles.filterBtn,
                          {
                            backgroundColor: category.includes(item)
                              ? COLOR.VIOLET[20]
                              : COLOR.LIGHT[100],
                          },
                        ]}
                        onPress={() => {
                          setCategory(cat => {
                            if (cat.includes(item)) {
                              return cat.filter(i => i !== item);
                            }
                            return [...cat, item];
                          });
                        }}>
                        <Text
                          style={[
                            styles.filterBtnText,
                            {
                              color: category.includes(item)
                                ? COLOR.VIOLET[100]
                                : COLOR.DARK[100],
                            },
                          ]}>
                          {convertCatLang(STRINGS, item)}
                        </Text>
                      </Pressable>
                    ))}
                </View>
              </View>
            ))}
          </ScrollView>
          <CustomButton
            title={STRINGS.Continue}
            onPress={() => {
              setFilterCategory(category);
              dispatch(openCatSheet(false));
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export default React.memo(CategorySelectionSheet);
