import React from 'react';
import {createAppContainer, NavigationAction} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {View, Text, TouchableOpacity, StatusBar, TextInput, Dimensions, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from '../screens/HomeScreen';
import TournamentScreen from '../screens/Tournament/TournamentScreen';
import MessagingChatRoomScreen from '../screens/Messaging/ChatRoomScreen';
import NewsDetailScreen from '../screens/News/DetailScreen';

import AuthLoginScreen from '../screens/Auth/LoginScreen';
import AuthRegisterScreen from '../screens/Auth/RegisterScreen';

import ProfileMyProfileScreen from '../screens/Profile/MyProfileScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { store } from '../store/config';

let currentLogging;
function handleChange() {
    let previousValue = currentLogging
    currentLogging = store.getState();
  
    if (previousValue !== currentLogging) {
      console.log(
        'Some deep nested property changed from',
        previousValue,
        'to',
        currentLogging
      )
    }
  }

console.log(currentLogging);

store.subscribe(handleChange);



let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

const AuthNavigation = createStackNavigator({
    MyProfile: {
        screen: ProfileMyProfileScreen
    },
    Login: {
        screen: AuthLoginScreen,
    },
    Register: {
        screen: AuthRegisterScreen
    }
}, {
    initialRouteName: 'MyProfile',
    headerMode: 'none',
    cardStyle: {backgroundColor: '#f0f0f0'},
    navigationOptions: {
        headerVisible: false,
    },
});

const BottomBarLogging = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <Icon name="home-variant-outline" size={28} type={'material-community'} color={tintColor}/>
            ),
        },
    },
    ChatGroup: {
        screen: MessagingChatRoomScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <FontAwesome5 name="comments" regular size={22} color={tintColor}/>
            ),
        },
    },
    Tournament: {
        screen: TournamentScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <FontAwesome5 name="award" solid size={22} color={tintColor}/>
            ),
        },
    },
    Auth: {
        screen: AuthNavigation,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <FontAwesome5 name="user" type="font-awesome" regular size={22} color={tintColor}/>
            ),
        },
    }
}, {
    initialRouteName: 'Home',
    tabBarOptions: {
        activeTintColor: '#000',
        showLabel: false,
        showIcon: true,
        style: {
            marginBottom: Platform.OS == 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? -13 : 0 : 0,
            backgroundColor: '#ffffff',
            borderTopColor: '#d1d1d1',
        },
    },
});

const BottomBarNotLogging = createBottomTabNavigator({
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <Icon name="home-variant-outline" size={28} type={'material-community'} color={tintColor}/>
                ),
            },
        },
        Auth: {
            screen: AuthNavigation,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <FontAwesome5 name="user" type="font-awesome" regular size={22} color={tintColor}/>
                ),
            },
        }
    }, {
        initialRouteName: 'Home',
        tabBarOptions: {
            activeTintColor: '#000',
            showLabel: false,
            showIcon: true,
            style: {
                marginBottom: Platform.OS == 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? -13 : 0 : 0,
                backgroundColor: '#ffffff',
                borderTopColor: '#d1d1d1',
            },
        },
    },
);

const AppNavigation = createStackNavigator({
    Home: {
        screen: currentLogging == true ? BottomBarLogging : BottomBarNotLogging,
    },
    NewsDetail: {
        screen: NewsDetailScreen
    }
}, {
    initialRouteName: 'Home',
    headerMode: 'none',
    cardStyle: {backgroundColor: '#f0f0f0'},
    navigationOptions: {
        headerVisible: false,
    },
});


const InitNavigation = createStackNavigator({
    HomeInit: {
        screen: AppNavigation,
    },
}, {
    initialRouteName: 'HomeInit',
    headerMode: 'none',
    cardStyle: {backgroundColor: '#f0f0f0'},
    navigationOptions: {
        headerVisible: false,
    },
});

export default createAppContainer(InitNavigation);
