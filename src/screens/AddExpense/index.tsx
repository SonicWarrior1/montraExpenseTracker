import React from 'react';
import {SafeAreaView, Text, TextInput, View} from 'react-native';
import styles from './styles';
import CustomInput from '../../components/CustomInput';
import {COLORS} from '../../constants/commonStyles';
import {Dropdown} from 'react-native-element-dropdown';
import Sapcer from '../../components/Spacer';
import CustomDropdown from '../../components/CustomDropDown';
import {ICONS} from '../../constants/icons';

function AddExpense() {
  return (
    <View style={{flex: 1, backgroundColor: COLORS.PRIMARY.RED}}>
      <SafeAreaView style={styles.safeView}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={styles.text1}>How much?</Text>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              paddingHorizontal: 30,
            }}>
            <Text style={{color: 'white', fontSize: 64, fontWeight: '600'}}>
              $
            </Text>
            <TextInput
              style={{
                flex: 1,
                fontSize: 64,
                color: 'white',
                fontWeight: '600',
              }}
              maxLength={8}
            />
          </View>
        </View>
      </SafeAreaView>
      <View
        style={{
          flex: 2,
          backgroundColor: 'white',
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}>
        <CustomDropdown
          data={[
            {label: 'Food', value: 'food'},
            {label: 'Bill', value: 'bill'},
            {label: 'Shopping', value: 'Shopping'},
          ]}
          onChange={val => {
            console.log(val.value);
          }}
          value={''}
          placeholder="Category"
        />

        <Sapcer height={10} />
        <CustomInput
          placeholderText="Description"
          onChangeText={(str: string) => {}}
          type="name"
          value=""
        />
        <Sapcer height={10} />
        <CustomDropdown
          data={[
            {label: 'Paypal', value: 'paypal'},
            {label: 'Chase', value: 'chase'},
          ]}
          onChange={val => {
            console.log(val.value);
          }}
          value={''}
          placeholder="Wallet"
        />
        <Sapcer height={10} />
        <View
          style={{
            height: 60,
            width: '100%',
            borderWidth: 1,
            borderRadius: 20,
            borderStyle: 'dashed',
            borderColor: COLORS.LIGHT[20],
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}>
          {ICONS.Attachment({
            height: 20,
            width: 20,
          })}
          <Text style={{color: COLORS.DARK[25], fontSize: 16}}>
            Add Attachement
          </Text>
        </View>
      </View>
    </View>
  );
}

export default AddExpense;
