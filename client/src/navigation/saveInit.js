import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {View, Text, TouchableOpacity, StatusBar, TextInput, Dimensions, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FeedLikeScreen from '../screens/FeedLike';
import SettingsScreen from '../screens/SettingsScreen';

import ForumScreen from '../screens/ForumScreen';
import ForumCategoryScreen from '../screens/ForumsCategory';

import NewsDetailScreen from '../screens/NewsDetailScreen';
import NewsAllScreen from '../screens/NewsAllScreen';
import UpdateScreen from '../warning/UpdateScreen';
import ChangelogScreen from '../screens/Changelog';

import AuthLoginScreen from '../screens/Auth/LoginScreen';
import AuthRegisterScreen from '../screens/Auth/RegisterScreen';
import AuthForgotScreen from '../screens/Auth/ForgotScreen';
import AuthVerifyScreen from '../screens/Auth/VerifyScreen';

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

const Forums = createStackNavigator({
    Forum: {
        screen: ForumScreen,
        navigationOptions: ({ navigation }) => ({
            title: `Instadev`,
            headerBackTitle: null,
            headerLeft: null,
        }),
    },
    ForumsCategory: {
        screen: ForumCategoryScreen
    }
}, {
    initialRouteName: "Forum",
    headerMode: 'none',
    cardStyle: { backgroundColor: '#212121' },
    navigationOptions: {
        headerVisible: false,
    }
});

const Settings = createStackNavigator({
    SettingsPage: {
        screen: SettingsScreen
    },
    ChangelogPage: {
        screen: ChangelogScreen
    }
}, {
    initialRouteName: "SettingsPage",
    headerMode: 'none',
    cardStyle: { backgroundColor: '#212121' },
    navigationOptions: {
        headerVisible: false,
    }
});

const Users = createStackNavigator({
    ProfilePage: {
        screen: ProfileScreen
    },
    LoginPage: {
        screen: AuthLoginScreen
    },
    RegisterPage: {
        screen: AuthRegisterScreen
    },
    ForgotPage: {
        screen: AuthForgotScreen
    }
}, {
    initialRouteName: "SettingsPage",
    headerMode: 'none',
    cardStyle: { backgroundColor: '#212121' },
    navigationOptions: {
        headerVisible: false,
    }
});

const BottomBar = createBottomTabNavigator({
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="home"  size={28} color={tintColor} />
                )
            }
        },
        Forum: {
            screen: Forums,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="comments" type="font-awesome" size={25} color={tintColor} />
                )
            }
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="user" type="font-awesome" size={25} color={tintColor} />
                )
            }
        },
        Settings: {
            screen: Settings,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="settings" size={25} color={tintColor} />
                )
            }
        },
    },{
        initialRouteName: "Home",
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
    }
);

const InitNavigation = createStackNavigator({
    Home: {
        screen: BottomBar,
        navigationOptions: ({ navigation }) => ({
            title: `Instadev`,
            headerBackTitle: null,
            headerLeft: null,
        }),
    },
    NewsDetail: {
        screen: NewsDetailScreen,
    },
    NewsAll: {
        screen: NewsAllScreen
    },
    Update: {
        screen: UpdateScreen
    }
}, {
    initialRouteName: "Home",
    headerMode: 'none',
    cardStyle: { backgroundColor: '#212121' },
    navigationOptions: {
        headerVisible: false,
    }
});

export default createAppContainer(InitNavigation);
