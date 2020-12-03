import React from 'react';
import {View, Text, ActivityIndicator, Image, Dimensions} from 'react-native';

import AuthLoginScreen from './LoginScreen';
import ProfileScreen from '../ProfileScreen';

import Firebase from '../../config/Firebase';

class AuthVerifyScreen extends React.Component {

    componentDidMount() {
        Firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "HomeLogging" : "HomeNotLogging");
        });
    }

    render() {
        return (
            <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                    <Image style={{
                        height: 50,
                        width: Dimensions.get('window').width / 3}} resizeMode={'contain'} source={require('../../../assets/MWLoading.gif')}/>
                </View>
            </View>
        );
    }
}

export default AuthVerifyScreen;
