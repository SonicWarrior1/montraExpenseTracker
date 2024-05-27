import React from 'react';
import {SafeAreaView, View} from 'react-native';
import CustomButton from '../../components/CustomButton';
import auth from '@react-native-firebase/auth';
import {useAppDispatch} from '../../redux/store';
import {userLoggedIn} from '../../redux/reducers/userSlice';

function Home() {
  const dispatch = useAppDispatch();
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <CustomButton
          title="Signout"
          onPress={async () => {
            await auth().signOut();
            dispatch(userLoggedIn(undefined));
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default Home;
