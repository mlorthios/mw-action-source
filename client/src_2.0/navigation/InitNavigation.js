import React from 'react';
import {createAppContainer, NavigationAction} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {View, Text, TouchableOpacity, StatusBar, TextInput, Dimensions, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { store, persistor } from '..//store/config';

import HomeScreen from '../screens/HomeScreen';
import TournamentScreen from '../screens/Tournament/TournamentScreen';
import MessagingChatRoomScreen from '../screens/Messaging/ChatRoomScreen';
import NewsDetailScreen from '../screens/News/DetailScreen';
import NewsListScreen from '../screens/News/ListScreen';
import ContextScreen from '../screens/Context/ContextScreen';

import SettingsHomeScreen from '../screens/Settings/HomeScreen';

import AuthLoginScreen from '../screens/Auth/LoginScreen';
import AuthRegisterScreen from '../screens/Auth/RegisterScreen';

import ProfileMyProfileScreen from '../screens/Profile/MyProfileScreen';
import VerifyLogging from '../screens/VerifyLogging';

import Ionicons from 'react-native-vector-icons/Ionicons';

console.log(store.getState().authReducer.loggedIn)

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

const AuthNavigation = createStackNavigator({
    Login: {
        screen: AuthLoginScreen,
    },
}, {
    initialRouteName: 'Login',
    headerMode: 'none',
    cardStyle: {backgroundColor: '#f0f0f0'},
    navigationOptions: {
        headerVisible: false,
    },
});

const ProfileNavigation = createStackNavigator({
    MyProfile: {
        screen: ProfileMyProfileScreen,
    },
    SettingsL: {
        screen: SettingsHomeScreen
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
    HomeL: {
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
    /*Tournament: {
        screen: TournamentScreen,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <FontAwesome5 name="award" solid size={22} color={tintColor}/>
            ),
        },
    },*/
    Auth: {
        screen: ProfileNavigation,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (
                <FontAwesome5 name="user" type="font-awesome" regular size={22} color={tintColor}/>
            ),
        },
    }
}, {
    initialRouteName: 'HomeL',
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
        HomeNL: {
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
        },
        Settings: {
            screen: SettingsHomeScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <FontAwesome5 name="cog" size={22} color={tintColor}/>
                ),
            },
        }
    }, {
        initialRouteName: 'HomeNL',
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
    HomeNotLogging: {
        screen: BottomBarNotLogging,
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
    HomeLogging: {
        screen: BottomBarLogging,
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
    Register: {
        screen: AuthRegisterScreen
    },
    VerifyLogging: {
        screen: VerifyLogging,
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
    NewsDetail: {
        screen: NewsDetailScreen
    },
    NewsList: {
        screen: NewsListScreen
    },
    Context: {
        screen: ContextScreen
    }
}, {
    initialRouteName: 'VerifyLogging',
    headerMode: 'none',
    cardStyle: {backgroundColor: '#f0f0f0'},
    navigationOptions: {
        headerVisible: false,
    },
    cardStack: {
        gesturesEnabled: false,
    },
    transitionConfig: () => ({
        transitionSpec: {
          duration: 0,
        },
      }),
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
