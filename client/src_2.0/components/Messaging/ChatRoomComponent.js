import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Platform, KeyboardAvoidingView, TextInput, TouchableOpacity, FlatList, Alert, ActionSheetIOS, ActionSheetIOSOptions } from 'react-native';
import { API_KEY_HTTP } from 'react-native-dotenv'
import DeviceInfo from 'react-native-device-info';
import {Icon, Overlay} from 'react-native-elements';
import SocketIOClient from 'socket.io-client/dist/socket.io.js'
import convertSize from '../../utils/convertSize';
import { connect } from 'react-redux';
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
import FastImage from 'react-native-fast-image';
import UUID from 'uuid/v1';
import { NavigationEvents } from "react-navigation";

const marginTopSize = new convertSize().MarginTopResponsive()

class MessagingChatRoomComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            chat_status: {
                connected: false,
                error: null,
                loaded: false
            },
            chat_message: [],
            chat_send_message: '',
            ReconnectOverlay: false
        }
        this.socket = SocketIOClient('http://localhost:4001?app_name='+DeviceInfo.getBundleId()+'&api_key='+API_KEY_HTTP+'&token='+this.props.loggedIn.token, 
        { autoConnect: true, reconnectionDelay: 5000, reconnection: true, transports: ['websocket'], agent: false, rejectUnauthorized: false });

        this._getReplyloginSocket = this._getReplyloginSocket.bind(this);
        this._isReconnected = this._isReconnected.bind(this);

        this.socket.on('chat receive', (data) => {
            this._receiveMessage(data);
        })

        this.socket.on('connect', this._getReplyloginSocket);

        this.socket.on('reconnect', () => {
            this._isReconnected();
        });

        this.socket.on('clean chat', () => {
            this._cleanChat()
        });

        this.socket.on('load message', (data) => {
            this._receiveLoadMessage(data);
        })

        this.socket.on('delete specific message', (data) => {
            this._deleteSpecificMessage(data);
        })

        this.socket.on('reconnect_attempt', (error) => {
            this._setError('Reconnexion en cours');
        });

        this.socket.on('connect_error', (error) => {
            this._setError('Reconnexion en cours');
            console.log(error)
        });

        this.socket.on('reconnection', (error) => {
            const status = {
                loaded: true,
                connected: true,
                error: null,
            }
            this.setState({chat_status: status});
        });

        this.socket.on('error', (error) => {
            this._setError('Problème de connexion, veuillez patienter ...');
        });

        this.socket.on('disconnect', () => {
            const data = {
                connected: false,
                loaded: false
            }
            this.setState({chat_status: data});
            console.log('deconnected state')
        });

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loggedIn.isLogged == false) {
            this._setDisconnect();
        }
    }

    _setOpen() {
        this.socket.open();
    }

    _isReconnected() {
        console.log('reconnect')
        const data = {
            connected: true,
            error: null,
            loaded: true
        }
        this.setState({chat_status: data});
    }

    _getReplyloginSocket() {
        console.log('connect')
        const status = {
            loaded: true,
            connected: true,
            error: null,
        }
        this.setState({chat_status: status});
        this._loadMessage();
    }

    _setDisconnect() {
        
    }

    _setError(error) {
        const data = {
            connected: false,
            error: error,
            loaded: false
        }
        this.setState({chat_status: data});
    }

    _scrollEnd() {
        this.refs.flatList1.scrollToEnd();
    }

    _cleanChat() {
        this.setState({chat_message: []});
    }

    _receiveLoadMessage(data) {
        var messages = [];
        for (k in data) {
            const msg = {
                id: data[k].message_id,
                text: data[k].text,
                user_id: data[k].user_id,
                user: {
                    id: data[k].user[0]._id,
                    username: data[k].user[0].username,
                    pseudonyme: data[k].user[0].display_username,
                    avatar: data[k].user[0].avatar
                },
                createdAt: data[k].created_at
            }
            messages.push(msg)
        }

        const status = {
            loaded: true,
            connected: true,
            error: null,
        }

        this.setState({chat_message: messages, chat_status: status})
    }

    _loadMessage() {
        this.socket.emit('load message', null);
    }

    _actionUser(username, message_id, text, user_id) {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              message: ''+username,
              options: this.props.loggedIn.username == 'arwantys' ? ['Annuler', 'Voir le profil', 'Demander en ami', 'Signaler', 'Supprimer'] : ['Annuler', 'Signaler'],
              destructiveButtonIndex: 1,
              cancelButtonIndex: 0
            },
            (buttonIndex) => {
              if (buttonIndex === 9) {
                Alert.alert('profil');
              }
              if(buttonIndex === 2) {
                  this._sendRequestFriend(username);
              }
              if(buttonIndex === 1) {
                  this._reportUser(user_id, message_id, text);
              }
              if(this.props.loggedIn.username == 'arwantys') {
                if(buttonIndex === 4) {
                    this._sendDeleteSpecificMessage(message_id)
                }
              }
            },
          );
    }

    _sendRequestFriend(username) {
        const data = {
            from: this.props.loggedIn.username,
            to: username
        }
        this.socket.emit('friend request user', data)
        Alert.alert('Demande envoyé')
    }

    _reportUser(username, message_id, text) {
        const data = {
            username: username,
            message_id: message_id,
            text: text
        }
        this.socket.emit('report user', data);
        Alert.alert('Votre signalement a bien été pris en compte, nous analyserons celui-ci le plus rapidement possible.')
    }

    _BulleChat(item, index) {
        const timeAgo = new TimeAgo('fr');
        const index_plus = this.state.chat_message[index+1];
        const index_moins = this.state.chat_message[index-1];
        const index_init = this.state.chat_message[index];
        if(item.user.username == this.props.loggedIn.username) {
            return(
                <View style={{marginTop: index == 0 ? 10 : 0}}>
                    {index_moins && index_moins.user.username == item.user.username ||
                    <View style={{marginTop: index_moins && index_moins.user.username != item.user.username ? 10 : 0}}></View>
                    }
                    <View style={{flexDirection: 'row-reverse'}}>
                        <View style={styles.BulleItMy}><Text style={{color: '#fff'}}>{item.text}</Text></View>
                    </View>
                    {index_plus && index_plus.user.username == item.user.username ||
                    <View style={{flexDirection: 'row-reverse'}}>
                        <View style={{marginTop: 4}}><Text style={{
                            color: 'rgba(0,0,0,0.7)',
                            fontSize: 11
                        }}>{timeAgo.format(new Date(item.createdAt))}</Text></View>
                    </View>
                    }
                </View>
            )
        } else {
            return(
                    <View style={{flexDirection: 'row', marginTop: index == 0 ? 10 : 0, marginRight: 20}}>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => this._actionUser(item.user.pseudonyme, item.id, item.text, item.user.id)}>
                        {index_plus && index_plus.user.username == item.user.username ? (
                            <View style={{marginRight: 6, width: 25}}>
                                
                            </View>
                        ) : (
                            <View style={{marginRight: 6}}>
                                <FastImage style={{height: 25, width: 25, borderRadius: 10}} source={{uri: item.user.avatar}}/>
                            </View>
                        )}
                        <View>
                            {index_moins && index_moins.user.username == item.user.username ||
                            <View>
                                <Text style={{color: 'rgba(0,0,0,0.8)', fontWeight: '500', marginTop: index_moins && index_moins.user.username != item.user.username ? 10 : 0}}>
                                    {item.user.pseudonyme}
                                </Text>
                            </View>
                            }
                            <View style={{flexDirection: 'row'}}>
                                <View style={styles.BulleNotMy}><Text style={{color: '#fff'}}>{item.text}</Text></View>
                            </View>
                            {index_plus && index_plus.user.username == item.user.username ||
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginTop: 4}}><Text style={{
                                    color: 'rgba(0,0,0,0.7)',
                                    fontSize: 11
                                }}>{timeAgo.format(new Date(item.createdAt))}</Text></View>
                            </View>
                            }
                        </View>
                        </TouchableOpacity>
                    </View>
                
            )
        }
    }

    _receiveMessage(data) {

        this.setState({chat_message: [...this.state.chat_message, data]})
        console.log(data)
    }

    _sendMessage() {
        if(!this.state.chat_send_message || this.state.chat_send_message.trim().length == 0) {
            Alert.alert('Veuillez entrer un message')
        } else {
            const idsend = this.props.loggedIn.username + '-'+UUID();
            const data = {
                id: idsend,
                token: this.props.loggedIn.token,
                message: this.state.chat_send_message.trim()
            }
            const data_local = {
                id: idsend,
                text: data.message,
                createdAt: new Date(Date.now()),
                user: {
                    id: this.props.loggedIn.id,
                    username: this.props.loggedIn.username,
                    pseudonyme: this.props.loggedIn.pseudonyme,
                    avatar: this.props.loggedIn.avatar
                }
            };
            this.socket.emit('chat message', data);
            this.setState({chat_send_message: '', chat_message: [...this.state.chat_message, data_local]})
        }
    }

    _sendDeleteSpecificMessage(id) {
        this.socket.emit('delete specific message', id);
    }

    _deleteSpecificMessage(id) {
        const data = this.state.chat_message;

        var messages = [];
        for (k in data) {
            if(data[k].id == id) {
                
            } else {
                const msg = {
                    id: data[k].id,
                    text: data[k].text,
                    user_id: data[k].user_id,
                    user: {
                        id: data[k].user._id,
                        username: data[k].user.username,
                        pseudonyme: data[k].user.pseudonyme,
                        avatar: data[k].user.avatar
                    },
                    createdAt: data[k].createdAt
                }
                messages.push(msg)
            }
        }

        this.setState({chat_message: messages})
    }

    render() {
        return(
            <KeyboardAvoidingView behavior= {(Platform.OS === 'ios')? "padding" : null} style={{flex: 1}}>
                {this.state.ReconnectOverlay &&
                <Overlay
                isVisible
                height={150}
                containerStyle={{flex: 1}}
                >
                    <View style={{justifyContent: 'center', flexDirection: 'column', alignContent: 'center', alignItems: 'center', flex: 1}}>
                        <Text style={{fontSize: 19, fontWeight: '500', marginBottom: 15}}>Vous êtes encore là ?</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this._setOpen()}>
                                <Text style={{
                                    backgroundColor: '#1376bd', 
                                    fontSize: 20, 
                                    fontWeight: '600', 
                                    color: '#fff', 
                                    paddingHorizontal: 20,
                                    paddingVertical: 8,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    margin: 5

                                }}
                                >
                                    Oui !
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{
                                    backgroundColor: '#e33b3b', 
                                    fontSize: 20, 
                                    fontWeight: '600', 
                                    color: '#fff', 
                                    paddingHorizontal: 20,
                                    paddingVertical: 8,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    margin: 5

                                }}
                                >
                                    Non :(
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Overlay>
                }
                <View style={{backgroundColor: '#383838', paddingBottom: 30}}>
                    <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 23}}>
                        <View style={{marginLeft: 20, marginRight: 20, marginBottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View>
                                <Text style={{fontSize: 30, fontWeight: 'bold', color: '#fff'}}>Discussions</Text>
                            </View> 
                        </View>
                    </SafeAreaView>
                </View>
                <View style={{backgroundColor: '#f0f0f0', marginTop: -15, borderRadius: 20, flex: 1}}>
                    {this.state.chat_status.error &&
                    <View style={{
                       shadowColor: "#000",
                         shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                                
                        elevation: 5,
                        marginBottom: 7
                    }}>
                        <View style={{marginLeft: 20, marginRight: 20, backgroundColor: '#bd1e13', padding: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                                <Text style={{color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '400', marginRight: 5}}>{this.state.chat_status.error}</Text>
                            </View>
                        </View>
                    </View>
                    }
                    {this.state.chat_status.loaded == false && this.state.chat_status.error == null &&
                    <View style={{
                       shadowColor: "#000",
                         shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                                
                        elevation: 5,
                        marginBottom: 7
                    }}>
                        <View style={{marginLeft: 20, marginRight: 20, backgroundColor: '#007ba1', padding: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                                <Text style={{color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '400', marginRight: 5}}>Chargement en cours</Text>
                            </View>
                        </View>
                    </View>
                    }
                    <FlatList
                            contentContainerStyle={{marginRight: 25, marginLeft: 25}}
                            showsVerticalScrollIndicator={false}
                            data={this.state.chat_message}
                            renderItem={({ item, index }) => this._BulleChat(item, index)}
                            keyExtractor={(item, index) => item.id}
                            scrollEnabled={true}
                            ref="flatList1"
                            onContentSizeChange={() => this._scrollEnd()}
                            onLayout={() => this._scrollEnd()}
                        /> 
                    {this.state.chat_status.loaded &&
                    <View style={{marginLeft: 25, marginRight: 25, flexDirection: 'row', marginBottom: 10, marginTop: 10}}>
                        <View style={Platform.OS == 'ios' ? styles.ViewTextInputiOS : styles.ViewTextInputAndroid}>
                            <TextInput value={this.state.chat_send_message} onChangeText={text => this.setState({chat_send_message: text})} multiline={true} blurOnSubmit={false} style={{color: '#ffffff', maxHeight: 120}} placeholderTextColor={'#b1b1b1'} placeholder={'Exprimez-vous...'}/>
                        </View>
                        {this.state.chat_send_message.trim().length != 0 &&
                        <View style={{justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => this._sendMessage()}>
                                <Icon type="ionicon" name={'md-send'} size={30} color={'#383838'}/>
                            </TouchableOpacity>
                        </View>
                        }  
                    </View>
                    }
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    BulleNotMy: {
        backgroundColor: '#454545',
        color: '#ffffff',
        padding: 10,
        marginBottom: 2,
        borderRadius: 14,
        marginTop: 2
    },
    BulleItMy: {
        backgroundColor: '#1663b6',
        color: '#ffffff',
        padding: 10,
        marginBottom: 2,
        borderRadius: 14,
        marginTop: 2
    },
    ViewTextInputiOS: {
        flexGrow: 1,
        backgroundColor: '#383838',
        paddingBottom: 10,
        paddingLeft: 8,
        borderRadius: 15,
        paddingTop: 5,
        paddingRight: 8,
        marginRight: 10
    },
    ViewTextInputAndroid: {
        flexGrow: 1,
        backgroundColor: 'rgba(255,255,255,0.19)',
        paddingLeft: 8,
        borderRadius: 15,
        marginRight: 10,
    }
});

const mapStateToProps = (state) => {
    return {
      loggedIn: {
        isLogged: state.authReducer.loggedIn,
        id: state.authReducer.loggedId,
        username: state.authReducer.loggedUsername,
        pseudonyme: state.authReducer.loggedPseudonyme,
        avatar: state.authReducer.loggedAvatar,
        token: state.authReducer.loggedToken
      }
    };
  };

export default connect(mapStateToProps)(MessagingChatRoomComponent);