import React from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Image, SafeAreaView, Alert} from 'react-native';
import { withNavigation } from 'react-navigation';

import convertSize from '../utils/convertSize';

import HomeNewsMultiplayerComponent from '../components/Home/NewsMultiplayerComponent';
import HomeNewsCoopComponent from '../components/Home/NewsCoopComponent';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';

import colorSubCategory from '../utils/color';
import FastImage from 'react-native-fast-image'
import { API_KEY_HTTP} from 'react-native-dotenv'

import byteSize from "byte-size";

import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
  } from 'react-native-admob'

import AnimatedEllipsis from 'react-native-animated-ellipsis';

const marginTopSize = new convertSize().MarginTopResponsive()

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newActive: 'multiplayer',
            loading: true,
            new_version: false,
            discover: false,
            ad_error: false,
            ad_loaded: false
        }
        this.newsmultiplayercomponent = <HomeNewsMultiplayerComponent/>;
        this.newscoopcomponent = <HomeNewsCoopComponent/>;
    }

    componentDidMount() {

        AdMobRewarded.setTestDevices([AdMobRewarded.simulatorId]);
        AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917');
    
        AdMobRewarded.addEventListener('rewarded', reward =>
          console.log('AdMobRewarded => rewarded', reward),
        );
        AdMobRewarded.addEventListener('adLoaded', () =>
          console.log('AdMobRewarded => adLoaded'),
        );
        AdMobRewarded.addEventListener('adFailedToLoad', error =>
          console.warn(error),
        );
        AdMobRewarded.addEventListener('adOpened', () =>
          console.log('AdMobRewarded => adOpened'),
        );
        AdMobRewarded.addEventListener('videoStarted', () =>
          console.log('AdMobRewarded => videoStarted'),
        );
        AdMobRewarded.addEventListener('adClosed', () => {
          console.log('AdMobRewarded => adClosed');
          AdMobRewarded.requestAd().catch(error => console.warn(error));
        });
        AdMobRewarded.addEventListener('adLeftApplication', () =>
          console.log('AdMobRewarded => adLeftApplication'),
        );
    
        AdMobRewarded.requestAd().catch(error => console.warn(error));

    }

    componentWillUnmount() {
        AdMobRewarded.removeAllListeners();
        AdMobInterstitial.removeAllListeners();
    }

    handleChangeNew(value) {
        this.setState({newActive: value})
    }

    render() {
        const fullHeight = Dimensions.get('window').height;
        return (
            <View>
                    {this.props.screenProps.receivedBytes != 0 &&
                    <View style={{position: 'absolute', zIndex: 999999, width: '100%', marginTop: marginTopSize}}>
                        <View style={{
                            shadowColor: "#a8ffb0",
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            
                            elevation: 5,
                        }}>
                            <View style={{marginLeft: 20, marginRight: 20, backgroundColor: 'green', padding: 8, borderRadius: 10}}>
                            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                            <Text style={{color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '400', marginRight: 5}}>Téléchargement d'une mise à jour</Text>
                            <AnimatedEllipsis animationDelay={100} style={{
                    color: '#fff',
                    fontSize: 16,
                    letterSpacing: -5,
                  }} />
                                </View>
                            <Text style={{color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: '600'}}>{byteSize(this.props.screenProps.receivedBytes).value}{byteSize(this.props.screenProps.receivedBytes).unit} sur {byteSize(this.props.screenProps.totalBytes).value}{byteSize(this.props.screenProps.totalBytes).unit}</Text>
                        </View>
                            </View>
                
                    </View>
                    }
                    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{backgroundColor: '#f0f0f0', height: '100%'}} showsVerticalScrollIndicator={false}>
                    <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 10}}>
                        <StatusBar barStyle="light-content"/>
                        <View>
                        <View style={{backgroundColor: '#383838', height: fullHeight, position: 'absolute', top: -fullHeight, left: 0, right: 0}} />
                        {this.props.loggedIn.isLogged ? (
                            <View style={{backgroundColor: '#383838', paddingBottom: 17}}>
                                <View style={{marginLeft: 20, marginRight: 20, marginBottom: 15, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                                    <View>
                                        <Text style={{fontSize: 15, fontWeight: '500', color: 'rgba(255,255,255,0.7)'}}>Bonjour,</Text>
                                        <Text style={{fontSize: 18, color: '#fff', fontWeight: '600'}}>{this.props.loggedIn.pseudonyme}</Text>
                                    </View>
                                    <View>
                                        <FastImage style={{height: 32, width: 32, borderRadius: 10}} source={{uri: this.props.loggedIn.avatar}}/>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={{backgroundColor: '#383838', paddingBottom: 20, marginTop: -10, alignItems: 'center'}}>
                                <Image style={{height: 50, width: Dimensions.get('window').width / 3}} resizeMode="contain" source={require('../../assets/logo.png')}/>
                            </View>
                        )}
                        
                        <View style={{backgroundColor: '#f0f0f0', marginTop: -15, borderRadius: 20, paddingTop: 20}}>
                            {this.state.new_version &&
                            <View style={{marginLeft: 20, marginRight: 20, marginBottom: 15, borderRadius: 10, overflow: 'hidden'}}>
                                <View style={{paddingTop: 15, paddingBottom: 15, backgroundColor: '#383838'}}>
                                    <View style={{width: '100%', paddingLeft: 20, paddingRight: 20}}>
                                        <Text style={{color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 23}}>Bienvenue sur la nouvelle version de l'application</Text>
                                        <View style={{marginTop: 10}}>
                                            <TouchableOpacity>
                                                <Text style={{color: '#fff', fontSize: 17, textAlign: 'center', fontWeight: '600'}}>En savoir plus</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            }
                            <View style={styles.headerH1View}>
                                <Text style={styles.headerH1Text}>Actualités</Text>
                            </View>
                            <ScrollView horizontal style={{marginBottom: 15}} contentContainerStyle={{marginLeft: 20}}>
                                <TouchableOpacity onPress={() => this.handleChangeNew('multiplayer')}>
                                    <View style={this.state.newActive == 'multiplayer' ? styles.ongletActiveView : styles.ongletNotActiveView}>
                                        <Text style={this.state.newActive == 'multiplayer' ? styles.ongletActiveText : styles.ongletNotActiveText}>Multijoueur</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handleChangeNew('coop')}>
                                    <View style={this.state.newActive == 'coop' ? styles.ongletActiveView : styles.ongletNotActiveView}>
                                        <Text style={this.state.newActive == 'coop' ? styles.ongletActiveText : styles.ongletNotActiveText}>Coop</Text>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                            {this.state.newActive == 'multiplayer' ? (
                                this.newsmultiplayercomponent
                            ) : (
                                this.newscoopcomponent
                            )}
                            <View style={styles.headerH2View}>
                                <Text style={styles.headerH2Text}>Publicité</Text>
                            </View>
                            <View style={{marginLeft: 20, marginRight: 20,}}>
                            
                                {this.state.ad_error ? (
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 15, borderRadius: 10, flexWrap: 'wrap', flexDirection: 'row'}}>
                                        <Text style={{color: '#fff', fontWeight: '500'}}>Aucune publicité à afficher</Text>
                                    </View>
                                ) : (
                                    
                                    <View style={{width: '100%'}}>
                                        <AdMobBanner
                                        adSize="smartBanner"
                                        adUnitID="ca-app-pub-4228580536802932/3266965391"
                                        testDevices={[AdMobBanner.simulatorId]}
                                        onAdFailedToLoad={error => this.setState({ad_error: true})}
                                        />
                                    </View>
                                )}
                            </View>
                            <View style={styles.headerH2View}>
                                <Text style={styles.headerH2Text}>Découvrir</Text>
                            </View>
                            <ScrollView style={{marginBottom: 20}} showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{marginLeft: 20}}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Context')}>
                                    <View>
                                        <ImageBackground style={{justifyContent: 'center', borderRadius: 10, overflow: 'hidden', height: 130, width: Dimensions.get('window').width - 40}} source={require('../../assets/view1.png')}>
                                            <View style={{}}>
                                                <Text style={{color: '#fff', fontWeight: '600', fontSize: 24, textAlign: 'center'}}>
                                                    Concours de Janvier
                                                </Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                        </View>
                        </SafeAreaView>
                    </ScrollView>
                    
                </View>
          
        );
    }

}

const styles = StyleSheet.create({
    container: {
        paddingTop: marginTopSize
    },
    headerH1View: {
        marginLeft: 20,
        marginRight: 20
    },
    headerH1Text: {
        fontWeight: 'bold',
        fontSize: 34,
        marginBottom: 10
    },
    headerH2View: {
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20
    },
    headerH2Text: {
        fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : null,
        fontWeight: Platform.OS === 'android' ? '500' : '500',
        fontSize: 25,
        marginBottom: 10
    },
    ongletActiveView: {
        backgroundColor: '#fff', 
        marginRight: 5, 
        paddingTop: 6, 
        paddingBottom: 6, 
        paddingLeft: 7, 
        paddingRight: 7, 
        borderRadius: 10
    },
    ongletNotActiveView: {
        marginRight: 5, 
        paddingTop: 6, 
        paddingBottom: 6, 
        paddingLeft: 7, 
        paddingRight: 7, 
        borderRadius: 10
    },
    ongletActiveText: {
        fontSize: 16, 
        fontWeight: '500'
    },
    ongletNotActiveText: {
        fontSize: 16, 
        fontWeight: '500',
        color: '#404040'
    },
    cardBoxShadow: {
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 0,
        },
        shadowOpacity: 0.53,
        shadowRadius: 3.62,
         elevation: 4,
    },
    cardBoxShadowLight: {
        shadowColor: "#FFF",
        shadowOffset: {
	        width: 0,
	        height: 0,
        },
        shadowOpacity: 0.53,
        shadowRadius: 3.62,
         elevation: 4,
    },
    cardBoxImageBackground: {
        height: 230, 
        width: Dimensions.get('window').width / 1.5,
        borderRadius: 10,
        overflow: 'hidden'
    }
})

const mapStateToProps = (state) => {
    return {
      loggedIn: {
        isLogged: state.authReducer.loggedIn,
        pseudonyme: state.authReducer.loggedPseudonyme,
        avatar: state.authReducer.loggedAvatar
      }
    };
  };

export default connect(mapStateToProps)(withNavigation(HomeScreen));