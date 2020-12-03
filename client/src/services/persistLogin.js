import AsyncStorage from '@react-native-community/async-storage';

async function getToken() {
   try {
       const token = await AsyncStorage.getItem('token')
       if (token !== null) {
           return token;
       }
   } catch (e) {
       return 'error token';
   }
}

const persistLogin = {

   login() {

       return JSON.stringify(getToken());

   }

}

export default persistLogin;