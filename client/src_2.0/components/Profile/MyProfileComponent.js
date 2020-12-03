import React from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions, TextInput, ActivityIndicator, SafeAreaView, ActionSheetIOS, Modal, Alert} from 'react-native';
import convertSize from '../../utils/convertSize';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import { Icon } from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker';

const marginTopSize = new convertSize().MarginTopResponsive()

class ProfileMyProfileComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            edit_show: false,
            avatar_edit: {
                uri: '',
                type: '',
                name: ''
            },
            submitStart: false
        }
    }

    handleDisconnect() {
        const action = { 
            type: "LOGGING", 
            value: false,
            Lusername: '',
            Lpseudonyme: '',
            Lavatar: '',
            Ltoken: '',
            Lemail: '',
            Lverified: '',
            LnotificationActive: '',
            LnotificationId: '',
            LcreatedAt: ''
        }
        this.props.dispatch(action);
        this.props.navigation.navigate('HomeNL');
    }

    _actionProfile() {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ['Annuler', 'Paramètres', 'Déconnexion'],
              destructiveButtonIndex: 2,
              cancelButtonIndex: 0
            },
            (buttonIndex) => {
              if (buttonIndex === 2) {
                this.handleDisconnect();
              }
              if(buttonIndex === 1) {
                  this.props.navigation.navigate('SettingsL')
              }
            },
          );
    }

    _changeAvatar() {
        this._actionAvatar();
    }

    _chooseGallery() {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            cropperChooseText: 'Choisir',
            cropperCancelText: 'Annuler'
          }).then(image => {
            const data = {
                uri: image.path,
                type: image.mime,
                name: image.filename
            }
              this.setState({avatar_edit: data})
          });
    }

    _chooseCamera() {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
            cropperChooseText: 'Choisir',
            cropperCancelText: 'Annuler'
          }).then(image => {
                const data = {
                    uri: image.path,
                    type: image.mime,
                    name: 'NEW_AVATAR.jpg'
                }
                this.setState({avatar_edit: data})
          });
    }

    _actionAvatar() {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              title: 'Modifier l\'avatar',
              options: ['Annuler', 'Choisir dans la bibliothèque', 'Prendre une photo', 'Retirer l\'avatar actuel'],
              destructiveButtonIndex: 3,
              cancelButtonIndex: 0
            },
            (buttonIndex) => {
              if (buttonIndex === 1) {
                this._chooseGallery();
              }
              if(buttonIndex === 2) {
                  this._chooseCamera();
              }
            },
          );
    }

    handleChange = () => {

        this.setState({submitStart: true})

        if(this.state.avatar_edit.uri) {
            const data = new FormData();

            data.append('avatar', {
                uri: this.state.avatar_edit.uri,
                type: this.state.avatar_edit.type,
                name: this.state.avatar_edit.name
            });

            fetch("https://s3.mwaction.app/v1/upload", {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: data
            })
            .then(response => response.json())
            .then(response => {
                this.setState({submitStart: false, edit_show: false})
            })
            .catch(error => {
                console.log("upload error", error);
                Alert.alert("Un problème est survenue pendant l\'importation");
            });
        } else {
            this.setState({submitStart: false, edit_show: false})
        }
    };

    render() {
        return (
            <View>
                <View style={{
                    paddingBottom: 23,
                    backgroundColor: '#06497d'
                }}>
                    <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? -8 : 10}}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row',alignItems: 'center', marginLeft: 20, marginRight: 20}}>
                            <View>
                                <View style={{marginRight: 15}}></View>
                            </View>
                            <View>
                                <Text style={{color: '#fff', fontWeight: '500', fontSize: 18}}>{this.props.loggedIn.pseudonyme}</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={{paddingBottom:10, marginTop: 12}} onPress={() => this._actionProfile()}>
                                    <Icon color="#fff" type="ionicon" name="ios-more"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={{paddingTop: marginTopSize - 15, height: '100%'}}>
                    <View style={{alignItems: 'center', flexDirection: 'column'}}>
                        <View>
                            <FastImage 
                                style={{height: 90, width: 90, borderRadius: 10}} 
                                source={{
                                    uri: this.props.loggedIn.avatar
                                }}
                            />
                        </View>
                        <View style={{marginBottom: 25}}>
                            <Text style={{marginTop: 7, fontSize: 16, fontWeight: '500' }}>@{this.props.loggedIn.username}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 23, marginLeft: 10, marginRight: 10}}>
                            <View style={{flex: 1}}>
                                <Text style={{
                                    color: '#000',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    fontSize: 17,
                                }}>0</Text>
                                <Text style={{color: 'rgba(0,0,0,0.6)', textAlign: 'center'}}>Abonnements</Text>
                            </View>
                            <View style={{alignContent: 'center', flex: 1}}>
                                <Text style={{
                                    color: '#000',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    fontSize: 17,
                                }}>
                                    0
                                </Text>
                                <Text style={{color: 'rgba(0,0,0,0.6)', textAlign: 'center'}}>Abonnés</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{
                                    color: '#000',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    fontSize: 17,
                                }}>0</Text>
                                <Text style={{color: 'rgba(0,0,0,0.6)', textAlign: 'center'}}>J'aime</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row'}}>
                            <View>
                                <TouchableOpacity onPress={() => this.setState({edit_show: true})}>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 40,
                                        backgroundColor: '#fff',
                                        paddingRight: 14,
                                        paddingLeft: 14,
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                    }}>
                                        <Text style={{fontWeight: '500', fontSize: 15}}>Modifier le profil</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    </ScrollView>
                </View>
                <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.edit_show}
                >
                    <View style={{
                    paddingBottom: 35,
                    backgroundColor: '#06497d'
                    }}>
                        <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 25}}>
                            <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginRight: 20}}>
                                <View>
                                    <TouchableOpacity onPress={() => this.setState({edit_show: false})}>
                                        <Text style={{color: '#fff', fontWeight: '400', fontSize: 18, width: 70}}>Annuler</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={{color: '#fff', fontWeight: '500', fontSize: 18}}>Modifier le profil</Text>
                                </View>
                                <View>
                                    {this.state.submitStart ? (
                                        <ActivityIndicator style={{width: 70}} color="#fff"/>
                                    ) : (
                                        <TouchableOpacity onPress={() => this.handleChange()}>
                                            <Text style={{color: '#3099fc', fontWeight: '600', fontSize: 18, width: 70}}>Terminé</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </SafeAreaView>
                    </View>
                    <KeyboardAwareScrollView extraScrollHeight={15} contentContainerStyle={{paddingTop: 15, paddingBottom: 15, marginLeft: 20, marginRight: 20}} style={styles.container}>
                            <View style={{alignItems: 'center', marginBottom: 20}}>
                                <FastImage style={{height: 75, width: 75, borderRadius: 75/2, borderWidth: 1, borderColor: '#06497d'}} source={{uri: this.state.avatar_edit.uri ? this.state.avatar_edit.uri : this.props.loggedIn.avatar}}/>
                                <TouchableOpacity onPress={() => this._changeAvatar()} style={{marginTop: 10}}>
                                    <Text style={{color: '#06497d', fontWeight: '600'}}>Modifier l'avatar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{backgroundColor: '#06497d', color: '#fff', padding: 7, fontWeight: '600', marginBottom: 8, borderRadius: 10, overflow: 'hidden'}}>Informations publiques</Text>
                            </View>
                            <View>
                                <Text style={{fontWeight: '500'}}>Nom d'utilisateur <Text style={{lineHeight: 14}}>*</Text></Text>
                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 10, marginTop: 5}}>
                                    <TextInput 
                                        placeholder="Nom d'utilisateur"
                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                        autoCapitalize={'none'}
                                        style={{color: '#000', fontSize: 16, marginLeft: 5, paddingTop: 10, paddingBottom: 10,}}
                                    />
                                </View>
                            </View>
                            <View style={{marginTop: 10}}>
                                <Text style={{fontWeight: '500'}}>Pseudonyme <Text style={{lineHeight: 14}}>*</Text></Text>
                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 10, marginTop: 5}}>
                                    <TextInput 
                                        placeholder="Pseudonyme"
                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                        autoCapitalize={'none'}
                                        onChangeText={text => this.setState({password: text})}
                                        value={this.props.loggedIn.pseudonyme} 
                                        style={{color: '#000', fontSize: 16, marginLeft: 5, paddingTop: 10, paddingBottom: 10}}
                                    />
                                </View>
                            </View>
                            <View style={{marginTop: 10}}>
                                <Text style={{fontWeight: '500'}}>Biographie</Text>
                                <View style={{flexGrow: 1, backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 10, marginTop: 5}}>
                                    <TextInput 
                                        onChangeText={() => console.log('ok')}
                                        blurOnSubmit={false}
                                        multiline={true}
                                        placeholder={'Biographie'}
                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                        autoCapitalize={'none'}
                                        maxHeight={23*3}
                                        style={{color: '#000', fontSize: 16, marginLeft: 5, width: '100%', paddingTop: 10, paddingBottom: 10, maxHeight: 23 *3}}
                                    />
                                </View>
                            </View>
                            <View style={{marginTop: 10}}>
                                <Text style={{fontWeight: '500'}}>PSN</Text>
                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)',borderRadius: 10, marginTop: 5}}>
                                    <TextInput 
                                        placeholder="PSN"
                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                        autoCapitalize={'none'}
                                        style={{color: '#000', fontSize: 16, marginLeft: 5, paddingTop: 6, paddingBottom: 10,}}
                                    />
                                </View>
                            </View>
                            <View style={{marginTop: 10}}>
                                <Text style={{fontWeight: '500'}}>Xbox Live</Text>
                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 10, marginTop: 5}}>
                                    <TextInput 
                                        placeholder="Xbox Live"
                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                        autoCapitalize={'none'}
                                        style={{color: '#000', fontSize: 16, marginLeft: 5, paddingTop: 6, paddingBottom: 10,}}
                                    />
                                </View>
                            </View>
                            <View style={{marginTop: 10, marginBottom: 25}}>
                                <Text style={{fontWeight: '500'}}>Battle.net</Text>
                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 10, marginTop: 5}}>
                                    <TextInput 
                                        placeholder="Battle.net"
                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                        autoCapitalize={'none'}
                                        style={{color: '#000', fontSize: 16, marginLeft: 5, paddingTop: 6, paddingBottom: 10,}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{backgroundColor: '#06497d', color: '#fff', padding: 7, fontWeight: '600', marginBottom: 8, borderRadius: 10, overflow: 'hidden'}}>Informations privées</Text>
                            </View>
                            <View style={{}}>
                                <Text style={{fontWeight: '500'}}>E-mail</Text>
                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 10, marginTop: 5}}>
                                    <TextInput 
                                        placeholder="E-mail"
                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                        autoCapitalize={'none'}
                                        style={{color: '#000', fontSize: 16, marginLeft: 5, paddingTop: 6, paddingBottom: 10,}}
                                    />
                                </View>
                            </View>
                            <View style={{marginTop: 10, marginBottom: 0}}>
                                <Text style={{fontWeight: '500'}}>Téléphone</Text>
                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 10, marginTop: 5}}>
                                    <TextInput 
                                        placeholder="Téléphone"
                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                        autoCapitalize={'none'}
                                        style={{color: '#000', fontSize: 16, marginLeft: 5, paddingTop: 10, paddingBottom: 10,}}
                                    />
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
         
                </Modal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: -16,
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        loggedIn: {
            isLogged: state.authReducer.loggedIn,
            username: state.authReducer.loggedUsername,
            pseudonyme: state.authReducer.loggedPseudonyme,
            avatar: state.authReducer.loggedAvatar
          }
    };
  };

export default connect(mapStateToProps)(withNavigation(ProfileMyProfileComponent));