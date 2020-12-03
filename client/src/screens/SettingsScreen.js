import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Switch, Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Icon, ListItem} from 'react-native-elements';
import OneSignal from 'react-native-onesignal';
import VersionCheck from 'react-native-version-check';
import Firebase from '../config/Firebase';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux'

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

class SettingsScreen extends React.Component {

    constructor() {
        super();

        this.state = {
            switchValue: false,
            switchDarkMode: false,
            currentUser: null,
            lol: '',
            rev: 4
        };
    }

    toggleSwitch = (value) => {
        this._checkPermissionNotification();
    };

    signOutUser = () => {
        Firebase.auth().signOut();
        this.props.navigation.navigate('HomeNotLogging')
    };

    async componentDidMount() {

        Firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({ currentUser: user })
            }
        });

        const { currentUser } = Firebase.auth()
        if(currentUser) {
            this.setState({ currentUser })
        }

        OneSignal.getPermissionSubscriptionState((status) => {
            if (status.subscriptionEnabled == 1) {
                this.setState({switchValue: true});
            } else {
                this.setState({switchValue: false});
            }

        });

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
        const { themeMode } = this.props;

        return (
            <View style={{backgroundColor: themeMode == 'dark' ? '#2a292a' : '#f0f0f0', height: '100%', }}>
            <View style={{marginTop: Platform.OS === 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? 46 : 30 : 25, marginBottom: 15}}>
                <View style={{marginLeft: 25, flexDirection: 'row'}}>
                    <Text style={{color: themeMode == 'dark' ? '#fff' : '#000', fontWeight: '600', fontSize: 27}}>Paramètres</Text>
                </View>
                <View style={{
                    marginBottom: 35,
                    width: 55,
                    marginTop: 5,
                    height: 3,
                    backgroundColor: themeMode == 'dark' ? '#fff' : '#000',
                    marginLeft: 25,
                    borderRadius: 5,
                }}></View>
                <View style={{marginLeft: 25, marginBottom: 8}}>
                    <Text style={{color: themeMode == 'dark' ? '#fff' : '#000', fontWeight: 'bold', fontSize: 16}}>Général</Text>
                </View>
                <View style={{
                    marginBottom: 6,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,

                    elevation: 7,
                }}>
                    <View style={{marginLeft: 25, marginRight: 25, borderRadius: 10}}>
                        <ListItem
                            containerStyle={{backgroundColor: themeMode == 'dark' ? 'rgba(68, 68, 68, 0.58)' : 'rgba(40, 40, 40, 0.9)', borderRadius: 10}}
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
                    </View>
                </View>
                {this.state.currentUser &&
                <View style={{marginTop: 10}}>
                    <TouchableOpacity onPress={() => this.signOutUser()}>
                        <Text style={{color: '#0096ff', fontWeight: '500', fontSize: 16, textAlign: 'center'}}>Déconnexion</Text>
                    </TouchableOpacity>
                </View>
                }
                <View style={{marginTop: 15}}><Text style={{
                    color: themeMode == 'dark' ? '#fff' : '#000',
                    textAlign: 'center',
                }}>v.{VersionCheck.getCurrentVersion()} rev.{this.state.rev}</Text></View>
            </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeMode: state.themeMode
    }
  }

export default connect(mapStateToProps)(SettingsScreen);
