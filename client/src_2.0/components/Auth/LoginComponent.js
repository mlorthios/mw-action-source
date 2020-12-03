import React from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions, TextInput, ActivityIndicator, Alert, SafeAreaView, Keyboard} from 'react-native';
import convertSize from '../../utils/convertSize';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { API_KEY_HTTP } from 'react-native-dotenv'
import DeviceInfo from 'react-native-device-info';

const marginTopSize = new convertSize().MarginTopResponsive()

class AuthLoginComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
            errorMessage: '',
            errorType: ''
        }
    }

    
    
    handleLogin = () => {
        Keyboard.dismiss();
        if(this.state.email.trim()) {
            if(this.state.password) {

                this.setState({loading: true})

                fetch(`https://api.mwaction.app/v1/authentication/login`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        'x-api-key': API_KEY_HTTP
                    },
                    body: "email="+this.state.email+"&password="+this.state.password,
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result['status'] === 'success') {

                            const action = { 
                                type: "LOGGING", 
                                value: true,
                                Lid: result['user'].id,
                                Lusername: result['user'].username,
                                Lpseudonyme: result['user'].displayUsername,
                                Lavatar: result['user'].avatar,
                                Ltoken: result['token'],
                                Lemail: result['user'].email,
                                Lverified: result['user'].verified,
                                LnotificationActive: result['user'].notification_active,
                                LnotificationId: result['user'].notification_id,
                                LcreatedAt: result['user'].created_at
                            }
                            this.props.dispatch(action);
                            this.setState({loading: false, errorMessage: '', errorType: '', email: '', password: ''});
                            this.props.navigation.navigate('HomeL');
                        } else {
                            this.setState({loading: false, errorMessage: result['response'], errorType: 'error'})
                        }
                    },
                    (error) => {
                        this.setState({
                            loading: false,
                            errorMessage: 'Impossible d\'établir une connexion à notre serveur',
                            errorType: 'error'
                        });
                    })

            } else {
                this.setState({errorMessage: 'Veuillez entrer un mot de passe', errorType: 'error'});
            }

        } else {
            this.setState({errorMessage: 'Veuillez entrer une adresse email', errorType: 'error'});
        }
        
    };

    handleRedirectRegister() {
        this.setState({
            email: '',
            password: '',
            errorMessage: '',
            errorType: ''
        })
        this.props.navigation.navigate('Register')
    }

    render() {
        const fullHeight = Dimensions.get('window').height;
        return (
            <View>
                <View style={{backgroundColor: '#383838', paddingBottom: 30}}>
                <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 10}}>
                    <View style={{marginLeft: 20, marginRight: 20, marginBottom: 0}}>
                        <View>
                            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#fff'}}>Connexion</Text>
                        </View>
                    </View>
                    </SafeAreaView>
                </View>
                <View style={{backgroundColor: '#f0f0f0', marginTop: -15, borderRadius: 20, paddingTop: 20}}>
                    <View style={{marginLeft: 20, marginRight: 20}}>
                        {this.state.errorMessage.length != 0 &&
                        <View style={{backgroundColor: this.state.errorType == 'error' ? '#ad0707' : 'green', padding: 12, borderRadius: 10, marginBottom: 15}}>
                            <Text style={{color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '500'}}>{this.state.errorMessage}</Text>
                        </View>
                        }
                        <Text style={{fontSize: 18}}>E-mail</Text>
                        <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', paddingTop: 10, paddingBottom: 10, borderRadius: 10, marginTop: 5}}>
                            <TextInput 
                                autoCapitalize={'none'}
                                onChangeText={text => this.setState({email: text})}
                                value={this.state.email}
                                style={{color: '#000', fontSize: 16, marginLeft: 5}}
                            />
                        </View>
                        <Text style={{fontSize: 18, marginTop: 23}}>Mot de passe</Text>
                        <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', paddingTop: 10, paddingBottom: 10, borderRadius: 10, marginTop: 5}}>
                            <TextInput 
                                autoCapitalize={'none'}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({password: text})}
                                value={this.state.password} 
                                style={{color: '#000', fontSize: 16, marginLeft: 5}}
                            />
                        </View>
                        {this.state.loading ? (
                            <TouchableOpacity style={{marginTop: 20}}>
                                <View style={{backgroundColor: '#0295c2', padding: 13, borderRadius: 10}}>
                                    <ActivityIndicator color="#fff"/>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={this.handleLogin} style={{marginTop: 20}}>
                                <View style={{backgroundColor: '#0295c2', padding: 13, borderRadius: 10}}>
                                    <Text style={{fontSize: 16, fontWeight: '500', color:'#FFF', textAlign: 'center'}}>Se connecter</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={{marginTop: 7}} onPress={() => this.handleRedirectRegister()}>
                            <View style={{backgroundColor: '#474747', padding: 13, borderRadius: 10}}>
                                <Text style={{fontSize: 16, fontWeight: '500', textAlign: 'center', color: '#fff'}}>Créer un compte</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginTop: 15}} onPress={() => Alert.alert('Contactez-nous à cette adresse mail : support@mwaction.app')}>
                            <Text style={{fontSize: 16, fontWeight: '500', textAlign: 'center', color: 'rgba(90, 90, 90, 1)'}}>Mot de passe oublié ?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        paddingTop: marginTopSize,
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
        fontWeight: '600',
        fontSize: 25,
        marginBottom: 10
    },
});

const mapStateToProps = (state) => {
    return {
      loggedIn: state.authReducer.loggedIn,
    };
  };

export default connect(mapStateToProps)(withNavigation(AuthLoginComponent));