import React from 'react';
import {Pressable, SafeAreaView, ScrollView, Text, View} from 'react-native';
import styles from './styles';
import {ICONS} from '../../constants/icons';
import {COLORS} from '../../constants/commonStyles';
import CustomButton from '../../components/CustomButton';
import Sapcer from '../../components/Spacer';
import {BudgetScreenProps} from '../../defs/navigation';
import {NAVIGATION} from '../../constants/strings';
import {useAppSelector} from '../../redux/store';
import {Bar} from 'react-native-progress';

function BudgetScreen({navigation}: BudgetScreenProps) {
  const budgets = useAppSelector(state => state.user.currentUser?.budget);
  const spend = useAppSelector(state => state.user.currentUser?.spend);
  console.log(budgets);
  return (
    <View style={styles.safeView}>
      <SafeAreaView style={styles.safeView}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {ICONS.ArrowLeft2({
            height: 30,
            width: 30,
            color: 'white',
          })}
          <Text style={styles.month}>May</Text>
          {ICONS.ArrowRight({
            height: 30,
            width: 30,
            color: 'white',
            borderColor: 'white',
          })}
        </View>
      </SafeAreaView>
      <View style={styles.mainView}>
        {Object.values(budgets!).length === 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', paddingHorizontal: 50}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.DARK[25],
                textAlign: 'center',
              }}>
              You don't have a budget.
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.DARK[25],
                textAlign: 'center',
              }}>
              Let's make one so you are in control.
            </Text>
          </View>
        ) : (
          <ScrollView style={{flex: 1, marginTop: 10}}>
            {Object.entries(budgets!).map(([key, val]) => {
              return (
                <Pressable
                  key={key}
                  style={{
                    backgroundColor: COLORS.LIGHT[100],
                    marginVertical: 10,
                    borderRadius: 16,
                    padding: 16,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: COLORS.LIGHT[20],
                        backgroundColor: COLORS.LIGHT[80],
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 24,
                        columnGap: 7,
                      }}>
                      <View
                        style={{
                          height: 14,
                          width: 14,
                          borderRadius: 10,
                          backgroundColor: COLORS.BLUE[100],
                        }}></View>
                      <Text style={{fontSize: 14, fontWeight: '500'}}>
                        {key[0].toUpperCase() + key.slice(1)}
                      </Text>
                    </View>
                    {(spend![key] ?? 0) >= val.limit &&
                      ICONS.Alert({height: 20, width: 20})}
                  </View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: '600',
                      marginTop: 5,
                      marginBottom: 5,
                    }}>
                    Remaining $0
                  </Text>
                  <Bar
                    progress={(spend![key] ?? 0) / val.limit}
                    height={8}
                    width={null}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      marginTop: 5,
                      color: COLORS.DARK[25],
                    }}>
                    ${spend![key] ?? 0} of ${val.limit}
                  </Text>
                  {(spend![key] ?? 0) >= val.limit && (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '400',
                        marginTop: 10,
                        color: COLORS.PRIMARY.RED,
                      }}>
                      You've exceed the limit!
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        )}
        <CustomButton
          title="Create a Budget"
          onPress={() => {
            navigation.push(NAVIGATION.CreateBudget);
          }}
        />
        <Sapcer height={20} />
      </View>
    </View>
  );
}

export default BudgetScreen;
