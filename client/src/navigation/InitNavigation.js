import React from 'react';
import {createAppContainer, NavigationAction} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {View, Text, TouchableOpacity, StatusBar, TextInput, Dimensions, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

import NewsDetailScreen from '../screens/NewsDetailScreen';
import NewsAllScreen from '../screens/NewsAllScreen';
import UpdateScreen from '../warning/UpdateScreen';
import ChangelogScreen from '../screens/Changelog';

import ChatScreen from '../screens/ChatScreen';

import AuthLoginScreen from '../screens/Auth/LoginScreen';
import AuthRegisterScreen from '../screens/Auth/RegisterScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingScreen from '../screens/LoadingScreen';

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

const AuthNavigator = createStackNavigator({
    Login: {
        screen: AuthLoginScreen,
    },
    Register: {
        screen: AuthRegisterScreen,
    }
}, {
    initialRouteName: 'Login',
    headerMode: 'none',
    cardStyle: {backgroundColor: '#212121'},
    navigationOptions: {
        headerVisible: false,
    },
});

const BottomLoggingBar = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <Icon name="home" size={28} color={tintColor}/>
            ),
        },
    },
    Chat: {
        screen: ChatScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <Icon name="person" size={28} color={tintColor}/>
            ),
        },
    },
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <Icon name="settings" size={25} color={tintColor}/>
            ),
        },
    },
}, {
    initialRouteName: 'Home',
    tabBarOptions: {
        activeTintColor: '#FFF',
        showLabel: false,
        showIcon: true,
        style: {
            marginBottom: Platform.OS == 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? -13 : 0 : 0,
            backgroundColor: '#1f1f1f',
            borderTopColor: '#4b4b4b',
        },
    },
},
);

const BottomBar = createBottomTabNavigator({
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <Icon name="home" size={28} color={tintColor}/>
                ),
            },
        },
        /*Auth: {
            screen: AuthNavigator,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <Icon name="person" size={28} color={tintColor}/>
                ),
            },
        },*/
        Settings: {
            screen: SettingsScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <Icon name="settings" size={25} color={tintColor}/>
                ),
            },
        },
    }, {
        initialRouteName: 'Home',
        defaultNavigationOptions: ({navigation, screenProps}) => ({
            tabBarOptions: {
                activeTintColor: screenProps.themeMode == 'dark' ? '#FFF' : '#000',
                showLabel: false,
                showIcon: true,
                style: {
                    marginBottom: Platform.OS == 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? -13 : 0 : 0,
                    borderTopColor: screenProps.themeMode == 'dark' ? '#4b4b4b' : '#c7c7c7',
                    backgroundColor: screenProps.themeMode == 'dark' ? '#1f1f1f' : '#fff',
                },
            }
        })
    },
);

const AppRoute = createStackNavigator({
    Home: {
        screen: BottomBar
    }, 
    NewsDetail: {
        screen: NewsDetailScreen,
    },
    NewsAll: {
        screen: NewsAllScreen,
    },
    Update: {
        screen: UpdateScreen,
    },
}, {
    initialRouteName: 'Home',
    headerMode: 'none',
    cardStyle: {backgroundColor: 'transparent'},
    navigationOptions: {
        headerVisible: false,
    },
});

const InitNavigation = createStackNavigator({
    HomeInit: {
        screen: AppRoute
    }, 
    Loading: {
        screen: LoadingScreen
    }

}, {
    initialRouteName: 'Loading',
    headerMode: 'none',
    cardStyle: {backgroundColor: '#212121'},
    navigationOptions: {
        headerVisible: false,
    },
});

export default createAppContainer(InitNavigation);
