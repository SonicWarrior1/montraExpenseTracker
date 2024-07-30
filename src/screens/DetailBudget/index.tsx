import React, {useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import style from './styles';
import {Pressable, Text, View} from 'react-native';
import {catIcons, ICONS} from '../../constants/icons';
import {DetailBudgetScreenProps} from '../../defs/navigation';
import {useAppSelector} from '../../redux/store';
import {Bar} from 'react-native-progress';
import CustomButton from '../../components/CustomButton';
import {currencies, NAVIGATION, STRINGS} from '../../constants/strings';
import DeleteBudgetSheet from '../../components/DeleteBudgetSheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {COLORS} from '../../constants/commonStyles';
import {useAppTheme} from '../../hooks/themeHook';
import CustomHeader from '../../components/CustomHeader';
import {formatWithCommas} from '../../utils/commonFuncs';

function DetailBudget({navigation, route}: Readonly<DetailBudgetScreenProps>) {
  const month = route.params.month;
  // redux
  const currency = useAppSelector(state => state.user.currentUser?.currency);
  const budgets = useAppSelector(
    state => state.user.currentUser?.budget[month],
  );
  const spends = useAppSelector(state => state.user.currentUser?.spend[month]);
  // constants
  const COLOR = useAppTheme();
  const styles = style(COLOR);
  const selectedCategory = route.params.category;
  const budget = budgets?.[selectedCategory];
  //ref
  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
  // functions
  const headerRight = () => {
    return (
      <Pressable
        onPress={() => {
          bottomSheetModalRef.current?.present();
        }}
        style={styles.marginRight}>
        {ICONS.Trash({height: 25, width: 25, color: COLOR.DARK[100]})}
      </Pressable>
    );
  };

  return (
    <>
      {budget && (
        <SafeAreaView style={styles.safeView}>
          <CustomHeader
            backgroundColor={COLOR.LIGHT[100]}
            title={STRINGS.DetailBudget}
            navigation={navigation}
            HeaderRight={headerRight}
            color={COLOR.DARK[100]}
          />
          <View style={styles.mainView}>
            <View style={styles.catCtr}>
              <View
                style={[
                  styles.colorBox,
                  {
                    backgroundColor:
                      catIcons[selectedCategory]?.color ?? COLORS.LIGHT[20],
                  },
                ]}>
                {catIcons[selectedCategory]?.icon({height: 20, width: 20}) ??
                  ICONS.Money({height: 20, width: 20})}
              </View>
              <Text style={styles.catText}>
                {selectedCategory[0].toUpperCase() + selectedCategory.slice(1)}
              </Text>
            </View>
            <Text style={styles.remainText}>{STRINGS.Remaining}</Text>
            <Text style={styles.amtText} numberOfLines={1} >
              {currencies[currency!].symbol}
              {budget.limit - (spends?.[selectedCategory]?.USD ?? 0) < 0
                ? '0'
                : formatWithCommas(
                    Number(
                      (
                        budget.conversion.usd[
                          currency?.toLowerCase() ?? 'usd'
                        ] *
                          Number(budget.limit) -
                        Number(
                          spends?.[selectedCategory]?.[
                            currency?.toUpperCase() ?? 'USD'
                          ] ?? 0,
                        )
                      ).toFixed(2),
                    ).toString(),
                  )}
            </Text>
            <View style={styles.progressbar}>
              <Bar
                progress={
                  (spends?.[selectedCategory]?.[
                    currency?.toUpperCase() ?? 'USD'
                  ] ?? 0) / budget.limit
                }
                height={10}
                borderRadius={10}
                width={null}
              />
            </View>
            {(spends?.[selectedCategory]?.[currency?.toUpperCase() ?? 'USD'] ??
              0) >= budget.limit && (
              <View style={styles.limitCtr}>
                {ICONS.Alert({height: 20, width: 20, color: COLOR.LIGHT[100]})}
                <Text style={styles.limitText}>{STRINGS.LimitExceeded}</Text>
              </View>
            )}
          </View>
          <View style={{paddingHorizontal: 30, paddingBottom: 10}}>
            <CustomButton
              title={STRINGS.Edit}
              onPress={() => {
                navigation.push(NAVIGATION.CreateBudget, {
                  isEdit: true,
                  category: selectedCategory,
                });
              }}
            />
          </View>
        </SafeAreaView>
      )}
      <DeleteBudgetSheet
        budget={
          budget ?? {
            alert: false,
            limit: 0,
            percentage: 0,
            conversion: {},
          }
        }
        category={selectedCategory}
        navigation={navigation}
        bottomSheetModalRef={bottomSheetModalRef}
        month={month}
      />
    </>
  );
}

export default DetailBudget;
