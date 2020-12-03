import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Switch,
    Alert,
    Dimensions,
    TextInput,
    ActivityIndicator
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import CachedImage from 'react-native-image-cache-wrapper';
import TouchableScale from 'react-native-touchable-scale';
import AsyncStorage from '@react-native-community/async-storage';

import persistLogin from '../../services/persistLogin';

class AuthLoginScreen extends React.Component {

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

    componentDidMount() {
        console.log('test : ' + persistLogin.login());
    }

    storeData = async (data) => {
        try {
          await AsyncStorage.setItem('token', data)
        } catch (e) {
            this.setState({
                loading: false,
                errorMessage: 'Impossible d\'établir une connexion à notre serveur',
                errorType: 'error'
            });
        }
    }

    handleLogin = () => {

        if(this.state.email.trim()) {
            if(this.state.password) {

                this.setState({loading: true})

                fetch('http://localhost:4001/api/authentication/login', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                    body: "email="+this.state.email+"&password="+this.state.password,
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result['status'] === 'success') {

                            this.storeData(result['token']);
                            this.setState({loading: false, errorMessage: 'Connexion réussi, veuillez patienter', errorType: 'success'})
                        
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

    render() {
        return (
            <View style={{marginTop: 56, marginBottom: 15}}>
                <View style={{marginLeft: 25, flexDirection: 'row'}}>
                    <Text style={{color: '#fff', fontWeight: '600', fontSize: 27}}>Connexion</Text>
                </View>
                <View style={{
                    marginBottom: 35,
                    width: 55,
                    marginTop: 5,
                    height: 3,
                    backgroundColor: '#fff',
                    marginLeft: 25,
                    borderRadius: 5,
                }}></View>
                <View style={{marginLeft: 25, marginRight: 25}}>
                    {this.state.errorMessage.length != 0 &&
                    <View style={{backgroundColor: this.state.errorType == 'error' ? '#ad0707' : 'green', padding: 12, borderRadius: 10, marginBottom: 15}}>
                        <Text style={{color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '500'}}>{this.state.errorMessage}</Text>
                    </View>
                    }
                    <View style={{marginBottom: 15}}>
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 5}}>E-mail lol</Text>
                        <View style={{backgroundColor: 'rgba(255,255,255,0.17)', borderRadius: 10}}>
                            <TextInput
                                autoCapitalize={'none'}
                                style={{ height: 45, borderWidth: 0, paddingLeft: 10, fontSize: 16, color: '#fff'}}
                                onChangeText={text => this.setState({email: text})}
                                value={this.state.email}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 5}}>Mot de passe</Text>
                        <View style={{backgroundColor: 'rgba(255,255,255,0.17)', borderRadius: 10}}>
                            <TextInput
                                secureTextEntry={true}
                                autoCapitalize={'none'}
                                style={{ height: 45, borderWidth: 0, paddingLeft: 10, fontSize: 16, color: '#fff'}}
                                onChangeText={text => this.setState({password: text})}
                                value={this.state.password}
                            />
                        </View>
                    </View>
                    <View style={{marginTop: 20}}>
                        {this.state.loading ? (
                            <ActivityIndicator color={'#fff'}/>
                        ) : (
                            <TouchableOpacity onPress={this.handleLogin}>
                                <Text style={{color: '#fff', backgroundColor: '#0e5fd4', padding: 15, fontSize: 17, fontWeight: '500', borderRadius: 10, overflow: 'hidden', textAlign: 'center'}}>Se connecter</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{marginTop: 12}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={{color: '#fff', fontSize: 15, textAlign: 'center', fontWeight: '500'}}>Créer un compte gratuitement</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 9}}>
                        <TouchableOpacity>
                            <Text style={{color: '#fff', fontSize: 11, textAlign: 'center', fontWeight: '500'}}>OU</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 9}}>
                        <TouchableOpacity>
                            <Text style={{color: '#fff', fontSize: 15, textAlign: 'center', fontWeight: '500'}}>Mot de passe oublié ?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default AuthLoginScreen;
