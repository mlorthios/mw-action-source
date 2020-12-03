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
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import CachedImage from 'react-native-image-cache-wrapper';
import uri from 'rn-fetch-blob/utils/uri';
import TouchableScale from 'react-native-touchable-scale';
import Firebase, {db} from '../../config/Firebase';

function removeEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.replace(regex, '');
}

class AuthRegisterScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            loading: false,
            errorMessage: '',
            errorType: ''
        };
    }

    componentDidMount() {
        
    }



    handleLogin = () => {

        if(this.state.username.trim()) {
            if(this.state.email.trim()) {
                if(this.state.password) {

                    this.setState({loading: true})

                    fetch('http://localhost:4001/api/authentication/register', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        },
                        body: "username="+this.state.username+"&email="+this.state.email+"&password="+this.state.password,
                    })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if(result['status'] === 'success') {
                                this.setState({loading: false, errorMessage: 'Inscription réussi, veuillez patienter', errorType: 'success'})
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
        } else {
            this.setState({errorMessage: 'Veuillez entrer un nom d\'utilisateur', errorType: 'error'});
        }

    };

    render() {
        return (
            <View style={{marginTop: 56, marginBottom: 15}}>
                <View style={{marginLeft: 25, flexDirection: 'row'}}>
                    <Text style={{color: '#fff', fontWeight: '600', fontSize: 27}}>Inscription</Text>
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
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 5}}>Nom
                            d'utilisateur</Text>
                        <View style={{backgroundColor: 'rgba(255,255,255,0.17)', borderRadius: 10}}>
                            <TextInput
                                autoCapitalize={'none'}
                                style={{height: 45, borderWidth: 0, paddingLeft: 10, fontSize: 16, color: '#fff'}}
                                onChangeText={text => this.setState({username: text})}
                                value={this.state.username}
                            />
                        </View>
                    </View>
                    <View style={{marginBottom: 15}}>
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 5}}>E-mail</Text>
                        <View style={{backgroundColor: 'rgba(255,255,255,0.17)', borderRadius: 10}}>
                            <TextInput
                                autoCapitalize={'none'}
                                style={{height: 45, borderWidth: 0, paddingLeft: 10, fontSize: 16, color: '#fff'}}
                                onChangeText={text => this.setState({email: text})}
                                value={this.state.email}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 5}}>Mot de
                            passe</Text>
                        <View style={{backgroundColor: 'rgba(255,255,255,0.17)', borderRadius: 10}}>
                            <TextInput
                                secureTextEntry={true}
                                autoCapitalize={'none'}
                                style={{height: 45, borderWidth: 0, paddingLeft: 10, fontSize: 16, color: '#fff'}}
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
                                <Text style={{
                                    color: '#fff',
                                    backgroundColor: '#0e5fd4',
                                    padding: 15,
                                    fontSize: 17,
                                    fontWeight: '500',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    textAlign: 'center',
                                }}>S'inscrire gratuitement</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{marginTop: 12}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                            <Text style={{color: '#fff', fontSize: 15, textAlign: 'center', fontWeight: '500'}}>J'ai
                                déjà un compte</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default AuthRegisterScreen;
