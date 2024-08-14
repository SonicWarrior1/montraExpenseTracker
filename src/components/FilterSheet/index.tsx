import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, Pressable, Text, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import CustomButton from '../CustomButton';
import style from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  clearCatFilter,
  openCatSheet,
  openFilterSheet,
  setCatFilter,
  setFilters,
  setSortFilter,
} from '../../redux/reducers/transactionSlice';
import SheetBackdrop from '../SheetBackDrop';
import {useAppTheme} from '../../hooks/themeHook';
// Third Party Libraries
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import CategorySelectionSheet from '../CategorySelectionSheet';
import { STRINGS } from '../../localization';

function FilterSheet() {
  // constants
  const snapPoints = useMemo(() => ['64%'], []);
  const dispatch = useAppDispatch();
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  // ref
  const ref = useRef<BottomSheetModal>(null);
  // redux
  const isOpen = useAppSelector(state => state.transaction.isFilterOpen);
  const filters = useAppSelector(state => state.transaction.filters);
  // state
  const [filter, setFilter] = useState<number>(-1);
  const [sort, setSort] = useState<number>(-1);
  const [category, setCategory] = useState<string[]>([]);
  useEffect(() => {
    if (isOpen === true) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [isOpen]);
  const backAction = () => {
    dispatch(openFilterSheet(false));
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if (filters.filter === 'income') {
      setFilter(0);
    } else if (filters.filter === 'expense') {
      setFilter(1);
    } else if (filters.filter === 'transfer') {
      setFilter(2);
    } else {
      setFilter(-1);
    }
    if (filters.sort === 'highest') {
      setSort(0);
    } else if (filters.sort === 'lowest') {
      setSort(1);
    } else if (filters.sort === 'newest') {
      setSort(2);
    } else if (filters.sort === 'oldest') {
      setSort(3);
    } else {
      setSort(-1);
    }
    setCategory(filters.cat);
  }, [isOpen, filters]);
  return (
    <>
      <BottomSheetModalProvider>
        <BottomSheetModal
          enablePanDownToClose
          index={0}
          snapPoints={snapPoints}
          ref={ref}
          backdropComponent={SheetBackdrop}
          backgroundStyle={styles.sheetBack}
          handleIndicatorStyle={{backgroundColor: COLOR.VIOLET[40]}}
          onDismiss={() => {
            dispatch(openFilterSheet(false));
          }}>
          <BottomSheetView style={styles.sheet}>
            <View>
              <View style={styles.sheetView}>
                <Text style={styles.text1}>{STRINGS.FilterTransaction}</Text>
                <Pressable
                  style={styles.editBtn}
                  onPress={() => {
                    setFilter(-1);
                    setSort(-1);
                    dispatch(setFilters(-1));
                    dispatch(setSortFilter(-1));
                    dispatch(clearCatFilter());
                  }}>
                  <Text style={styles.editBtnText}>{STRINGS.Reset}</Text>
                </Pressable>
              </View>
              <Text style={[styles.text1, {marginBottom: 15}]}>
                {STRINGS.FilterBy}
              </Text>
              <View style={styles.flexRow}>
                <Pressable
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor:
                        filter === 0 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                    },
                  ]}
                  onPress={() => {
                    if (filter === 0) {
                      setFilter(-1);
                    } else {
                      setFilter(0);
                    }
                  }}>
                  <Text
                    style={[
                      styles.filterBtnText,
                      {
                        color:
                          filter === 0 ? COLOR.VIOLET[100] : COLOR.DARK[100],
                      },
                    ]}>
                    {STRINGS.Income}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor:
                        filter === 1 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                    },
                  ]}
                  onPress={() => {
                    if (filter === 1) {
                      setFilter(-1);
                    } else {
                      setFilter(1);
                    }
                  }}>
                  <Text
                    style={[
                      styles.filterBtnText,
                      {
                        color:
                          filter === 1 ? COLOR.VIOLET[100] : COLOR.DARK[100],
                      },
                    ]}>
                    {STRINGS.Expense}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor:
                        filter === 2 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                    },
                  ]}
                  onPress={() => {
                    if (filter === 2) {
                      setFilter(-1);
                    } else {
                      setFilter(2);
                    }
                  }}>
                  <Text
                    style={[
                      styles.filterBtnText,
                      {
                        color:
                          filter === 2 ? COLOR.VIOLET[100] : COLOR.DARK[100],
                      },
                    ]}>
                    {STRINGS.Transfer}
                  </Text>
                </Pressable>
              </View>
              <Text
                style={[
                  styles.text1,
                  {
                    marginVertical: 15,
                  },
                ]}>
                {STRINGS.SortBy}
              </Text>
              <View style={styles.wrapRow}>
                <Pressable
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor:
                        sort === 0 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                    },
                  ]}
                  onPress={() => {
                    if (sort === 0) {
                      setSort(-1);
                    } else {
                      setSort(0);
                    }
                  }}>
                  <Text
                    style={[
                      styles.filterBtnText,
                      {color: sort === 0 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                    ]}>
                    {STRINGS.Highest}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor:
                        sort === 1 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                    },
                  ]}
                  onPress={() => {
                    if (sort === 1) {
                      setSort(-1);
                    } else {
                      setSort(1);
                    }
                  }}>
                  <Text
                    style={[
                      styles.filterBtnText,
                      {color: sort === 1 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                    ]}>
                    {STRINGS.Lowest}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor:
                        sort === 2 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                    },
                  ]}
                  onPress={() => {
                    if (sort === 2) {
                      setSort(-1);
                    } else {
                      setSort(2);
                    }
                  }}>
                  <Text
                    style={[
                      styles.filterBtnText,
                      {color: sort === 2 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                    ]}>
                    {STRINGS.Newest}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor:
                        sort === 3 ? COLOR.VIOLET[20] : COLOR.LIGHT[100],
                    },
                  ]}
                  onPress={() => {
                    if (sort === 3) {
                      setSort(-1);
                    } else {
                      setSort(3);
                    }
                  }}>
                  <Text
                    style={[
                      styles.filterBtnText,
                      {color: sort === 3 ? COLOR.VIOLET[100] : COLOR.DARK[100]},
                    ]}>
                    {STRINGS.Oldest}
                  </Text>
                </Pressable>
              </View>
              <Text
                style={[
                  styles.text1,
                  {
                    marginBottom: 25,
                    marginTop: 15,
                  },
                ]}>
                {STRINGS.Category}
              </Text>
              <View style={styles.catRow}>
                <Text style={[styles.text1, {fontWeight: '500'}]}>
                  {STRINGS.ChooseCategory}
                </Text>
                <Pressable
                  onPress={() => {
                    dispatch(openCatSheet(true));
                  }}
                  style={styles.pressable}>
                  <Text style={styles.text2}>
                    {category?.length ?? 0} {STRINGS.Selected}
                  </Text>
                  {ICONS.ArrowRight({
                    height: 25,
                    width: 25,
                    color: COLOR.VIOLET[100],
                    borderColor: COLOR.VIOLET[100],
                  })}
                </Pressable>
              </View>
            </View>
            <CustomButton
              title={STRINGS.Apply}
              onPress={() => {
                dispatch(setFilters(filter));
                dispatch(setSortFilter(sort));
                dispatch(setCatFilter(category));
              }}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <CategorySelectionSheet
        filterCategory={category}
        setFilterCategory={setCategory}
      />
    </>
  );
}

export default React.memo(FilterSheet);
