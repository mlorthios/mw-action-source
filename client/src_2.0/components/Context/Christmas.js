import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, Image, ActivityIndicator, FlatList, SafeAreaView, Switch } from 'react-native';
import { withNavigation } from 'react-navigation';
import SkeletonLoader from "react-native-skeleton-loader";

import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
TimeAgo.addLocale(fr);

import DeviceInfo from 'react-native-device-info';
import utilSubCategory from '../../utils/color';
import CachedImage from 'react-native-image-cache-wrapper';
import { API_KEY_HTTP } from 'react-native-dotenv';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import Snow from 'react-native-snow';

class ContextChristmasComponent extends React.Component {

    constructor() {
        super();

        this.state = {
            isLoaded: false
        };
    }

    render() {
        return (
            <View>
                <Snow />
                <View style={{backgroundColor: '#b31307', paddingBottom: 30}}>
                    <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 10}}>
                        <View style={{marginLeft: 20, marginRight: 20, marginBottom: 0}}>
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                        <Text style={{backgroundColor: 'rgba(0,0,0,0.3)', color: 'rgba(255, 255, 255,0.8)', padding: 8, fontWeight: '600', borderRadius: 10, overflow: 'hidden', marginBottom: 5}}>Fermer</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{fontSize: 25, fontWeight: 'bold', color: '#fff'}}>Concours de Nöel</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
                <View style={{backgroundColor: '#ffdedb', marginTop: -15, borderRadius: 20, paddingTop: 20, height: '100%'}}>
                    {this.state.isLoaded ? (
                        <View style={{marginLeft: 20, marginRight: 20}}>

                        </View>
                    ) : (
                        <View style={{marginLeft: 20, marginRight: 20, justifyContent: 'center', flexDirection: 'row'}}>
                            <View>
                                <View style={{flexDirection: 'row', backgroundColor: '#5c0b04', padding: 18, borderRadius: 10}}>
                                    <Text style={{fontSize: 16, color: '#fff', fontWeight: '500'}}>Disponible le 23 décembre 2019</Text>
                                    <AnimatedEllipsis animationDelay={100} style={{
                                        color: '#fff',
                                        fontSize: 16,
                                        letterSpacing: -5,
                                    }} />
                                    </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
                
        )
    }

}

export default withNavigation(ContextChristmasComponent);