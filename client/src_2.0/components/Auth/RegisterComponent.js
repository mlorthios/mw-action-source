import React from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Modal, TextInput, ActivityIndicator, SafeAreaView, KeyboardAvoidingView} from 'react-native';
import convertSize from '../../utils/convertSize';
import { API_KEY_HTTP } from 'react-native-dotenv';
import DeviceInfo from 'react-native-device-info';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

const marginTopSize = new convertSize().MarginTopResponsive()

function removeEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.replace(regex, '');
}

class AuthRegisterComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pseudonyme: '',
            username: '',
            email: '',
            password: '',
            loading: false,
            errorMessage: '',
            errorType: '',
            cgu_show: false,
            commu_show: false
            
        };
    }

    handleRegister = () => {

        if(this.state.pseudonyme.trim()) {
            if(this.state.username.trim()) {
                if(this.state.username.substr(0,1) != '.') {
                    if(this.state.username.substr(this.state.username.length -1) != '.') {
                        if(this.state.username.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)) {
                            if(this.state.email.trim()) {
                                if(this.state.password) {

                                    this.setState({loading: true})

                                    fetch('https://api.mwaction.app/v1/authentication/register', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                                            'x-api-key': API_KEY_HTTP
                                        },
                                        body: "pseudonyme="+this.state.pseudonyme+"&username="+this.state.username+"&email="+this.state.email+"&password="+this.state.password,
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
                                                this.setState({loading: false, errorMessage: 'Inscription réussi, veuillez patienter', errorType: 'success', pseudonyme: '', username: '', password: '', email: ''})
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
                        } else {
                            this.setState({errorMessage: this.state.username.substr(this.state.username.length -1) + 'Les noms d\'utilisateurs ne peuvent contenir que des lettres, des chiffres, des traits de soulignement et des points.', errorType: 'error'});
                        }
                    } else {
                        this.setState({errorMessage: 'Vous ne pouvez pas terminer votre nom d\'utilisateur par un point.', errorType: 'error'});
                    }
                } else {
                    this.setState({errorMessage: 'Vous ne pouvez pas commencer votre nom d\'utilisateur par un point.', errorType: 'error'});
                }
            } else {
                this.setState({errorMessage: 'Veuillez entrer un nom d\'utilisateur', errorType: 'error'});
            }
        } else {
            this.setState({errorMessage: 'Veuillez entrer un pseudonyme', errorType: 'error'});
        }

    };

    handleRedirectLogin() {
        this.setState({
            email: '',
            username: '',
            pseudonyme: '',
            password: '',
            errorMessage: '',
            errorType: ''
        })
        this.props.navigation.navigate('Login')
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: '#383838', paddingBottom: 30}}>
                    <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 10}}>
                        <View style={{marginLeft: 20, marginRight: 20, marginBottom: 0}}>
                            <View>
                                <Text style={{fontSize: 30, fontWeight: 'bold', color: '#fff'}}>Inscription</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
                <KeyboardAvoidingView style={{justifyContent: 'space-between', flex: 1,backgroundColor: '#f0f0f0', marginTop: -15, borderRadius: 20, paddingTop: 20}} behavior="padding" enabled>
                        <View style={{marginLeft: 20, marginRight: 20}}>
                        {this.state.errorMessage.length != 0 &&
                    <View style={{backgroundColor: this.state.errorType == 'error' ? '#ad0707' : 'green', padding: 12, borderRadius: 10, marginBottom: 15}}>
                        <Text style={{color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '500'}}>{this.state.errorMessage}</Text>
                    </View>
                    }
                        <Text style={{fontSize: 18}}>Nom d'utilisateur</Text>
                            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', paddingTop: 10, paddingBottom: 10, borderRadius: 10, marginTop: 5}}>
                                <TextInput 
                                    autoCapitalize={'none'}
                                    onChangeText={text => this.setState({username: text})}
                                    value={this.state.username}
                                    style={{color: '#000', fontSize: 16, marginLeft: 5}}/>
                            </View>
                            <Text style={{fontSize: 18, marginTop: 23}}>Pseudonyme</Text>
                            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', paddingTop: 10, paddingBottom: 10, borderRadius: 10, marginTop: 5}}>
                                <TextInput 
                                    autoCapitalize={'none'}
                                    onChangeText={text => this.setState({pseudonyme: text})}
                                    value={this.state.pseudonyme}
                                    style={{color: '#000', fontSize: 16, marginLeft: 5}}
                                />
                            </View>
                            <Text style={{fontSize: 18, marginTop: 23}}>E-mail</Text>
                            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', paddingTop: 10, paddingBottom: 10, borderRadius: 10, marginTop: 5}}>
                                <TextInput 
                                    onChangeText={text => this.setState({email: text})}
                                    value={this.state.email}
                                    autoCapitalize={'none'}
                                    style={{color: '#000', fontSize: 16, marginLeft: 5}}/>
                            </View>
                            <Text style={{fontSize: 18, marginTop: 23}}>Mot de passe</Text>
                            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', paddingTop: 10, paddingBottom: 10, borderRadius: 10, marginTop: 5}}>
                                <TextInput 
                                    autoCapitalize={'none'} 
                                    onChangeText={text => this.setState({password: text})}
                                    value={this.state.password}
                                    secureTextEntry={true} style={{color: '#000', fontSize: 16, marginLeft: 5}}/>
                            </View>
                            <View style={{alignItems: 'center', marginTop: 12}}>
                                <Text style={{textAlign: 'center'}}>En vous inscrivant vous acceptez les <Text onPress={() => this.setState({cgu_show: true})} style={{fontWeight: '600'}}>Conditions du Service</Text> et les <Text onPress={() => this.setState({commu_show: true})} style={{fontWeight: '600'}}>Règles communautaires</Text></Text>
                            </View>
                        </View>
                        <View style={{marginLeft: 20, marginRight: 20}}>
                            <SafeAreaView>
                            {this.state.loading ? (
                                <TouchableOpacity style={{marginTop: 20}}>
                                    <View style={{backgroundColor: '#474747', padding: 13, borderRadius: 10}}>
                                        <ActivityIndicator color="#fff"/>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={this.handleRegister} style={{marginTop: 20}}>
                                    <View style={{backgroundColor: '#474747', padding: 13, borderRadius: 10}}>
                                        <Text style={{fontSize: 16, fontWeight: '500', textAlign: 'center', color: '#fff'}}>S'inscrire gratuitement</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={{marginTop: 15}} onPress={() => this.handleRedirectLogin()}>
                                <Text style={{fontSize: 16, fontWeight: '500', textAlign: 'center', color: 'rgba(90, 90, 90, 1)'}}>J'ai déjà un compte</Text>
                            </TouchableOpacity>
                            </SafeAreaView>
                        </View>
                    </KeyboardAvoidingView>
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
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: marginTopSize,
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
})

const mapStateToProps = (state) => {
    return {
      loggedIn: state.authReducer.loggedIn,
    };
  };

export default connect(mapStateToProps)(withNavigation(AuthRegisterComponent));