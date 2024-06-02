/* eslint-disable react-native/no-inline-styles */
import {Dimensions, SafeAreaView, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from '../../constants/commonStyles';
import styles from './styles';
import {ICONS} from '../../constants/icons';
import CustomButton from '../../components/CustomButton';
import {StoryScreenProps} from '../../defs/navigation';

export default function StoryScreen({navigation}: StoryScreenProps) {
  const screenHeight = Dimensions.get('screen').height;
  const screenWidth = Dimensions.get('screen').width;
  const [index, setIndex] = useState(0);
  return (
    <SafeAreaView
      style={[
        styles.safeView,
        {
          backgroundColor:
            index === 0
              ? COLORS.RED[100]
              : index === 1
              ? COLORS.GREEN[100]
              : COLORS.VIOLET[100],
        },
      ]}>
      <View style={styles.progressRow}>
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 0 ? 1 : 0.6,
            },
          ]}
        />
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 1 ? 1 : 0.6,
            },
          ]}
        />
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 2 ? 1 : 0.6,
            },
          ]}
        />
        <View
          style={[
            styles.progressIndicator,
            {
              opacity: index === 3 ? 1 : 0.6,
            },
          ]}
        />
      </View>
      <View style={styles.mainView}>
        {index !== 3 && <Text style={styles.title}>This Month</Text>}
        <View style={{alignItems: 'center'}}>
          <Text
            style={[
              styles.text1,
              {
                paddingHorizontal: index === 3 ? 0 : 40,
                marginTop: index === 3 ? 150 : 0,
              },
            ]}>
            {index === 0
              ? 'You Spend 💸'
              : index === 1
              ? 'You Earned 💰'
              : index === 2
              ? '2 of 12 Budget is exceeds the limit'
              : '“Financial freedom is freedom from fear.”'}
          </Text>
          {index === 3 && <Text style={styles.text2}>-Robert Kiyosaki</Text>}
          {index === 2 && (
            <View style={styles.catRow}>
              <View style={styles.catCtr}>
                <View style={styles.colorBox}>
                  {ICONS.Camera({height: 20, width: 20})}
                </View>
                <Text style={styles.catText}>Shopping</Text>
              </View>
              <View style={styles.catCtr}>
                <View style={styles.colorBox}>
                  {ICONS.Camera({height: 20, width: 20})}
                </View>
                <Text style={styles.catText}>Shopping</Text>
              </View>
            </View>
          )}
          {(index === 0 || index === 1) && <Text style={styles.amt}>$000</Text>}
        </View>
        {(index === 0 || index === 1) && (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {index === 0
                ? 'and your biggest spending is from'
                : 'your biggest Income is from'}
            </Text>
            <View style={styles.catCtr}>
              <View style={styles.colorBox}>
                {ICONS.Camera({height: 20, width: 20})}
              </View>
              <Text style={styles.catText}>Shopping</Text>
            </View>
            <Text style={styles.amt2}>$000</Text>
          </View>
        )}
        {index === 2 && <View />}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={{
            height: screenHeight,
            width: screenWidth / 2,
          }}
          onPress={() => {
            console.log('left');
            if (index > 0) {
              setIndex(index => index - 1);
            }
          }}
        />
        <TouchableOpacity
          style={{
            height: screenHeight,
            width: screenWidth / 2,
          }}
          onPress={() => {
            console.log('right');
            if (index < 3) {
              setIndex(index => index + 1);
            }
          }}
        />
      </View>
      {index === 3 && (
        <View style={{paddingHorizontal: 16}}>
          <CustomButton
            title="See the full detail"
            onPress={() => {}}
            backgroundColor={COLORS.LIGHT[100]}
            textColor={COLORS.VIOLET[100]}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
