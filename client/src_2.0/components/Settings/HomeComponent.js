import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, Image, ActivityIndicator, FlatList, SafeAreaView, Switch, Alert, Modal, } from 'react-native';
import { withNavigation } from 'react-navigation';
import SkeletonLoader from "react-native-skeleton-loader";
import VersionCheck from 'react-native-version-check';
import OneSignal from 'react-native-onesignal';
import { WebView } from 'react-native-webview';
import Rate, { AndroidMarket } from 'react-native-rate'

import { ListItem } from 'react-native-elements'
import { Icon } from 'react-native-elements'
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
TimeAgo.addLocale(fr);

import DeviceInfo from 'react-native-device-info';
import utilSubCategory from '../../utils/color';
import CachedImage from 'react-native-image-cache-wrapper';
import { API_KEY_HTTP } from 'react-native-dotenv';

import CGUComponent from '../CGU/CGU';

class HomeNewsMultiplayerComponent extends React.Component {

    constructor() {
        super();

        this.state = {
            switchValue: false,
            switchDarkMode: false,
            currentUser: null,
            lol: '',
            rev: 1,
            cgu_show: false
        };
    }

    toggleSwitch = (value) => {
        this._checkPermissionNotification();
    };

    async componentDidMount() {

        OneSignal.getPermissionSubscriptionState((status) => {
            if (status.subscriptionEnabled == 1) {
                this.setState({switchValue: true});
            } else {
                this.setState({switchValue: false});
            }

        });

    }

    _rateApp() {
        const options = {
            AppleAppID:"1486772141",
            GooglePackageName:"com.mwactudev",
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp:true,
            openAppStoreIfInAppFails:true,
            fallbackPlatformURL:"https://mwaction.app",
          }
          Rate.rate(options, success=>{
            
          })
    }

    _checkPermissionNotification() {
        OneSignal.getPermissionSubscriptionState((status) => {
            if (status.subscriptionEnabled == 1) {
                OneSignal.setSubscription(false);
                this.setState({switchValue: false});
            } else {
                OneSignal.setSubscription(true);
                this.setState({switchValue: true});
            }
        });
    }

    render() {
        return (
            <View>
                <View style={{backgroundColor: '#383838', paddingBottom: 30}}>
                    <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 10}}>
                        <View style={{marginLeft: 20, marginRight: 20, marginBottom: 0}}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Text style={{backgroundColor: 'rgba(0,0,0,0.3)', color: 'rgba(255, 255, 255,0.8)', padding: 8, fontWeight: '600', borderRadius: 10, overflow: 'hidden', marginBottom: 5}}>Fermer</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 25, fontWeight: 'bold', color: '#fff'}}>Paramètres</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
                <View style={{backgroundColor: '#f0f0f0', marginTop: -15, borderRadius: 20, paddingTop: 20}}>
                    <View style={{marginLeft: 20, marginRight: 20}}>
                        <Text style={{fontSize: 17, fontWeight: '600', marginBottom: 5}}>Mon compte</Text>
                        <ListItem
                                containerStyle={{backgroundColor: 'rgba(40, 40, 40, 0.9)', borderRadius: 10}}
                                leftElement={
                                    (
                                        <View>
                                            <Text style={{
                                                color: 'rgb(255,255,255)',
                                                fontSize: 20,
                                                fontWeight: '500',
                                            }}>Notifications</Text>
                                            <Text style={{color: 'rgb(255,255,255)', fontSize: 14, fontWeight: '400'}}>
                                                {this.state.switchValue ? (
                                                    <Text>Activé</Text>
                                                ) : (
                                                    <Text>Désactivé</Text>
                                                )}
                                            </Text>
                                        </View>
                                    )
                                }
                                rightElement={
                                    (
                                        <Switch
                                            onValueChange={this.toggleSwitch}
                                            value={this.state.switchValue}/>
                                    )
                                }
                            />
                        <Text style={{fontSize: 17, fontWeight: '600', marginBottom: 5, marginTop: 15}}>À propos de MW Action</Text>
                        <ListItem
                                Component={TouchableOpacity}
                                onPress={() => this._rateApp()}
                                containerStyle={{backgroundColor: 'rgba(40, 40, 40, 0.9)', borderRadius: 10}}
                                leftElement={
                                    (
                                        <View>
                                            <Text style={{
                                                color: 'rgb(255,255,255)',
                                                fontSize: 20,
                                                fontWeight: '500',
                                            }}>Donner 5 étoiles</Text>
                                        </View>
                                    )
                                }
                                rightElement={
                                    (
                                        <Icon name="ios-arrow-forward" type="ionicon" color="#fff"/>
                                    )
                                }
                            />
                            <ListItem
                                style={{marginTop: 4}}
                                Component={TouchableOpacity}
                                onPress={() => this.setState({cgu_show: true})}
                                containerStyle={{backgroundColor: 'rgba(40, 40, 40, 0.9)', borderRadius: 10}}
                                leftElement={
                                    (
                                        <View>
                                            <Text style={{
                                                color: 'rgb(255,255,255)',
                                                fontSize: 20,
                                                fontWeight: '500',
                                            }}>Conditions du Service</Text>
                                        </View>
                                    )
                                }
                                rightElement={
                                    (
                                        <Icon name="ios-arrow-forward" type="ionicon" color="#fff"/>
                                    )
                                }
                            />
                            <View style={{marginTop: 15}}><Text style={{
                                color: '#000',
                                textAlign: 'center',
                            }}>v.{VersionCheck.getCurrentVersion()} rev.{this.state.rev}</Text>
                        </View>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.cgu_show}
                >
                    <View style={{backgroundColor: '#383838', paddingBottom: 30}}>
                        <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 10}}>
                            <View style={{marginLeft: 20, marginRight: 20, marginBottom: 0}}>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.setState({cgu_show: false})}>
                                        <Text style={{backgroundColor: 'rgba(0,0,0,0.3)', color: 'rgba(255, 255, 255,0.8)', padding: 8, fontWeight: '600', borderRadius: 10, overflow: 'hidden', marginBottom: 5}}>Fermer</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 25, fontWeight: 'bold', color: '#fff'}}>Conditions du Service</Text>
                                </View>
                            </View>
                        </SafeAreaView>
                    </View>
                    <View style={{backgroundColor: '#fff', marginTop: -15, borderRadius: 20, paddingTop: 20, flex: 1}}>
                        <WebView useWebKit={true} sharedCookiesEnabled={true} style={{marginTop: -20}} source={{ uri: 'https://mwaction.app/terms/' }} />
                    </View>
                </Modal>
            </View>
                
        )
    }

}

export default withNavigation(HomeNewsMultiplayerComponent);