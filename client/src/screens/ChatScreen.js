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
    Button,
    ScrollView,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    Platform, DeviceEventEmitterStatic as DeviceEventEmitter, Image,
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import CachedImage from 'react-native-image-cache-wrapper';
import uri from 'rn-fetch-blob/utils/uri';
import TouchableScale from 'react-native-touchable-scale';
import Firebase, { db } from '../config/Firebase';
import uuidv1 from 'uuid/v1';
import { SafeAreaView } from 'react-native-safe-area-context';
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
import time from 'javascript-time-ago/modules/style/time';
import { Header } from 'react-navigation-stack';
import DeviceInfo from 'react-native-device-info';
TimeAgo.addLocale(fr);

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

class ChatScreen extends React.Component {

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            messageChat: [],
            message: '',
            isLoading: true,
            enableScrollViewScroll: true,
            following: false
        }

    }

    onEnableScroll= (value) => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };

    loadMessage(data) {
        this.setState({messageChat: data})
    }

    addMessage(rece) {
        const db_chats = db.collection('chats');

        if(rece.length != 0 && rece.trim()) {
            var data_message = {
                _id: uuidv1(),
                text: rece.trim(),
                createdAt: new Date(Date.now()),
                user: {
                    _id: Firebase.auth().currentUser.uid,
                    name: Firebase.auth().currentUser.displayName,
                    avatar: 'https://facebook.github.io/react/img/logo_og.png',
                }
            }

            db.collection('chats/').add(data_message);

            this.setState({message: ''});
        }
    }

    channelcreate() {
        db.collection()
    }

    onCollectionUpdate = (querySnapshot) => {
        this.unsubscribe = db.collection('chats').orderBy('createdAt').onSnapshot((querySnapshot) => {
            const listmessage = [];
            querySnapshot.forEach((doc) => {
                listmessage.push({
                    id: doc.data()._id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt,
                    user: {
                        id: doc.data().user._id,
                        name: doc.data().user.name
                    }
                });
            });
            this.setState({messageChat: listmessage, isLoading: false})
        })
    }

    componentWillUnmount () {
        this.unsubscribe();
    }

    componentDidMount() {
        Firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.onCollectionUpdate()
            } else {
                this.unsubscribe();
            }
        });
    }

    handleMessage(data) {
        this.setState({message: data})
    }

    _BulleChat(item, index) {
        const timeAgo = new TimeAgo('fr');
        const index_plus = this.state.messageChat[index+1];
        const index_moins = this.state.messageChat[index-1];
        const index_init = this.state.messageChat[index];
        if(item.user.id == Firebase.auth().currentUser.uid) {
            return(
                <View style={{marginTop: index == 0 ? 10 : 0}}>
                    {index_moins && index_moins.user.id == item.user.id ||
                    <View style={{marginTop: index_moins && index_moins.user.id != item.user.id ? 10 : 0}}></View>
                    }
                    <View style={{flexDirection: 'row-reverse'}}>
                        <View style={styles.BulleItMy}><Text style={{color: '#fff'}}>{item.text}</Text></View>
                    </View>
                    {index_plus && index_plus.user.id == item.user.id ||
                    <View style={{flexDirection: 'row-reverse'}}>
                        <View style={{marginTop: 4}}><Text style={{
                            color: '#9d9d9d',
                            fontSize: 11
                        }}>{timeAgo.format(new Date(item.createdAt.toDate()))}</Text></View>
                    </View>
                    }
                </View>
            )
        } else {
            return(
                <View style={{marginTop: index == 0 ? 10 : 0}}>
                    {index_moins && index_moins.user.id == item.user.id ||
                    <View>
                        <Text style={{color: '#acacac', fontWeight: '500', marginTop: index_moins && index_moins.user.id != item.user.id ? 10 : 0}}>
                            {item.user.name}
                        </Text>
                    </View>
                    }
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.BulleNotMy}><Text style={{color: '#fff'}}>{item.text}</Text></View>
                    </View>
                    {index_plus && index_plus.user.id == item.user.id ||
                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginTop: 4}}><Text style={{
                            color: '#9d9d9d',
                            fontSize: 11
                        }}>{timeAgo.format(new Date(item.createdAt.toDate()))}</Text></View>
                    </View>
                    }
                </View>
            )
        }
    }

    _scrollEnd() {
        this.refs.flatList1.scrollToEnd();
    }

    render() {
        if(this.unsubscribe) {
            return (
                <KeyboardAvoidingView behavior= {(Platform.OS === 'ios')? "padding" : null} style={{flex: 1}}>
                    <View style={{marginBottom: 15, flex: 1}}>
                        <View style={{
                            backgroundColor: 'rgba(255,255,255,0.03)'
                        }}>
                            <View style={{marginLeft: 25, marginTop: Platform.OS === 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? 46 : 30 : 25, marginBottom: 10}}>
                                <Text style={{color: '#fff', fontWeight: '600', fontSize: 27}}>Chat Général</Text>
                            </View>
                        </View>
                        <FlatList
                            contentContainerStyle={{marginRight: 25, marginLeft: 25}}
                            showsVerticalScrollIndicator={false}
                            data={this.state.messageChat}
                            renderItem={({ item, index }) => this._BulleChat(item, index)}
                            keyExtractor={(item, index) => item.id}
                            scrollEnabled={true}
                            ref="flatList1"
                            onContentSizeChange={() => this._scrollEnd()}
                            onLayout={() => this._scrollEnd()}
                        />
                        <View style={{marginLeft: 25, marginRight: 25, flexDirection: 'row', marginTop: 10}}>
                            <View style={Platform.OS == 'ios' ? styles.ViewTextInputiOS : styles.ViewTextInputAndroid}>
                                <TextInput multiline={true} blurOnSubmit={false} style={{color: '#ffffff'}} placeholderTextColor={'#b1b1b1'} value={this.state.message} onChangeText={text => this.setState({message: text})} placeholder={'Exprimez-vous...'}/>
                            </View>
                            {this.state.message.length != 0 && this.state.message.trim().length != 0 &&
                            <View style={{justifyContent: 'center'}}>
                                <TouchableOpacity onPress={() => this.addMessage(this.state.message)}>
                                    <Icon type="ionicon" name={'md-send'} size={30} color={'#fff'}/>
                                </TouchableOpacity>
                            </View>
                            }
                        </View>
                    </View>
                </KeyboardAvoidingView>
            );
        } else {
            return(
                <View style={{flex: 1}}>
                    <View style={{marginBottom: 15, flex: 1}}>
                        <View style={{
                            backgroundColor: 'rgba(255,255,255,0.03)'
                        }}>
                            <View style={{marginLeft: 25, marginTop: Platform.OS === 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? 46 : 30 : 25, marginBottom: 10}}>
                                <Text style={{color: '#fff', fontWeight: '600', fontSize: 27}}>Chat Général</Text>
                            </View>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                            <Image style={{
                                height: 50,
                                width: Dimensions.get('window').width / 3}} resizeMode={'contain'} source={require('../../assets/MWLoading.gif')}/>
                        </View>
                    </View>
                </View>
            )
        }
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
        backgroundColor: 'rgba(255,255,255,0.19)',
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

export default withNavigationFocus(ChatScreen);
