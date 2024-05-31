import React, {useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {Pressable, Text, View} from 'react-native';
import {ICONS} from '../../constants/icons';
import {DetailBudgetScreenProps} from '../../defs/navigation';
import {useAppSelector} from '../../redux/store';
import {Bar} from 'react-native-progress';
import CustomButton from '../../components/CustomButton';
import {NAVIGATION} from '../../constants/strings';
import DeleteBudgetSheet from '../../components/DeleteBudgetSheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

function DetailBudget({navigation, route}: DetailBudgetScreenProps) {
  const month = new Date().getMonth();
  const budgets = useAppSelector(
    state => state.user.currentUser?.budget[month],
  );
  const spends = useAppSelector(state => state.user.currentUser?.spend[month]);
  const cat = route.params.category;
  const budget = budgets![cat] ?? {
    alert: false,
    limit: 0,
    percentage: 0,
  };
  const spend = spends![cat] ?? 0;
  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
  const headerRight = () => {
    return (
      <Pressable
        onPress={() => {
          bottomSheetModalRef.current?.present();
        }} style={{marginRight:15}}>
        {ICONS.Trash({height: 25, width: 25, color: 'black'})}
      </Pressable>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainView}>
        <View style={styles.catCtr}>
          <View style={styles.colorBox}>
            {ICONS.Camera({height: 20, width: 20})}
          </View>
          <Text style={styles.catText}>
            {cat[0].toUpperCase() + cat.slice(1)}
          </Text>
        </View>
        <Text style={styles.remainText}>Remaining</Text>
        <Text style={styles.amtText}>
          $
          {budget.limit - spend < 0 || spend === undefined
            ? '0'
            : budget.limit - spend}
        </Text>
        <View style={{width: '100%'}}>
          <Bar progress={(spend ?? 0) / budget.limit} height={8} width={null} />
        </View>
        {(spend ?? 0) >= budget.limit && (
          <View style={styles.limitCtr}>
            {ICONS.Alert({height: 20, width: 20, color: 'white'})}
            <Text style={styles.limitText}>You've exceed the limit</Text>
          </View>
        )}
      </View>
      <CustomButton
        title="Edit"
        onPress={() => {
          navigation.push(NAVIGATION.CreateBudget, {
            isEdit: true,
            category: cat,
          });
        }}
      />
      <DeleteBudgetSheet
        category={cat}
        navigation={navigation}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </SafeAreaView>
  );
}

export default DetailBudget;
