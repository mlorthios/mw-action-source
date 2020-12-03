import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, Image, ActivityIndicator, FlatList, SafeAreaView, Switch, Animated, Modal } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Icon } from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import { WebView } from 'react-native-webview';

class GlobalNotConnectComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.open,
            bounceValue: new Animated.Value(Dimensions.get('window').height),
            cgu_show: false,
            commu_show: false
        };
    }

    render() {
        return (
            <View style={{ marginLeft: 20, marginRight: 20, justifyContent: 'space-between', flex: 1}} accessible="false">
                <View>
                    <Text style={{color: '#f2f2f2', textAlign: 'center', fontSize: 23, fontWeight: '600', marginBottom: 20}}>Inscription à MW Action</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={{color: '#f2f2f2', paddingVertical: 15, backgroundColor: 'rgba(0, 0, 0, 0.5)', textAlign: 'center', fontWeight: '500', fontSize: 16}}>
                            S'inscrire sur MW Action
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)'}}></View>
                <View style={{marginBottom: 50}}>
                    <Text style={{textAlign: 'center', marginBottom: 20, color: '#f2f2f2'}}>En continuant vous acceptez les <Text onPress={() => this.setState({cgu_show: true})} style={{fontWeight: '600'}}>Conditions du Service</Text> et les <Text onPress={() => this.setState({commu_show: true})} style={{fontWeight: '600'}}>Règles communautaires</Text></Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{color: '#f2f2f2', fontWeight: '600', fontSize: 16}}>Vous avez déjà un compte ?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}><Text style={{color: '#6ba4ff', fontWeight: '600', fontSize: 16, marginLeft: 6}}>Connexion</Text></TouchableOpacity>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.cgu_show}>
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
                        <WebView useWebKit={true} sharedCookiesEnabled={true} style={{marginTop: -40}} source={{ uri: 'https://mwaction.app/terms/' }} />
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.commu_show}>
                    <View style={{backgroundColor: '#383838', paddingBottom: 30}}>
                        <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 10}}>
                            <View style={{marginLeft: 20, marginRight: 20, marginBottom: 0}}>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.setState({commu_show: false})}>
                                        <Text style={{backgroundColor: 'rgba(0,0,0,0.3)', color: 'rgba(255, 255, 255,0.8)', padding: 8, fontWeight: '600', borderRadius: 10, overflow: 'hidden', marginBottom: 5}}>Fermer</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 25, fontWeight: 'bold', color: '#fff'}}>Règles Communautaires</Text>
                                </View>
                            </View>
                        </SafeAreaView>
                    </View>
                    <View style={{backgroundColor: '#fff', marginTop: -15, borderRadius: 20, paddingTop: 20, flex: 1}}>
                        <WebView useWebKit={true} sharedCookiesEnabled={true} style={{marginTop: -40}} source={{ uri: 'https://mwaction.app/guidelines/' }} />
                    </View>
                </Modal>
            </View>
              
        )
    }

}

export default withNavigation(GlobalNotConnectComponent);