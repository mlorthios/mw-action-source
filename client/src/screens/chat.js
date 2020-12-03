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
    KeyboardAvoidingView
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import CachedImage from 'react-native-image-cache-wrapper';
import uri from 'rn-fetch-blob/utils/uri';
import TouchableScale from 'react-native-touchable-scale';
import * as firebase from "firebase";
import firestore from 'firebase/firestore';
import uuidv1 from 'uuid/v1';
import { SafeAreaView } from 'react-native-safe-area-context';
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
import time from 'javascript-time-ago/modules/style/time';
TimeAgo.addLocale(fr);

async function onSignIn() {

    // Get the users ID
    const { email, displayName } = firebase.auth().currentUser

    const uid = firebase.auth().currentUser.uid;

    // Create a reference
    const ref = firebase.database().ref(`Users/${uid}`);

    await ref.set({
        uid,
        username: displayName,
        email: email,
        role: 'admin',
    });

    const snapshot = await ref.once('value')

    console.log(snapshot)
    console.log(displayName)
}

class ChatScreen extends React.Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('chats').orderBy('createdAt');
        this.unsubscribe = null;
        this.state = {
            messageChat: [],
            message: '',
            isLoading: true,
            enableScrollViewScroll: true,
        }
    }

    onEnableScroll= (value: boolean) => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };

    loadMessage(data) {
        this.setState({messageChat: data})
    }

    addMessage(rece) {
        const db_chats = firebase.firestore().collection('chats');

        if(rece.length != 0) {
            var data_message = {
                _id: uuidv1(),
                text: rece.trimLeft(),
                createdAt: new Date(Date.now()),
                user: {
                    _id: firebase.auth().currentUser.uid,
                    name: firebase.auth().currentUser.displayName,
                    avatar: 'https://facebook.github.io/react/img/logo_og.png',
                }
            }

            firebase.firestore().collection('chats/').add(data_message);

            this.setState({message: ''});
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        this.unsubscribe = this.ref.onSnapshot((querySnapshot) => {
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
            this.setState({messageChat: listmessage, isLoading:false})
        })
    }

    componentDidMount() {

        const { currentUser } = firebase.auth()
        if(!currentUser) {
            this.props.navigation.navigate('HomeNotLogging')
        }

        this.onCollectionUpdate();

    }

    handleMessage(data) {
        this.setState({message: data})
    }

    _BulleChat(item, index) {
        const timeAgo = new TimeAgo('fr');
        const index_plus = this.state.messageChat[index+1];
        const index_moins = this.state.messageChat[index-1];
        const index_init = this.state.messageChat[index];
        if(item.user.id == firebase.auth().currentUser.uid) {
            return(
                <View>
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
                <View>
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
        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <View style={{marginTop: 56, marginBottom: 15, flex: 1}}>
                    <View style={{marginLeft: 25, flexDirection: 'row'}}>
                        <Text style={{color: '#fff', fontWeight: '600', fontSize: 27}}>Chat</Text>
                    </View>
                    <View style={{
                        marginBottom: 15,
                        width: 55,
                        marginTop: 5,
                        height: 3,
                        backgroundColor: '#fff',
                        marginLeft: 25,
                        borderRadius: 5,
                    }}></View>
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
                        <View style={{
                            flexGrow: 1,
                            backgroundColor: 'rgba(255,255,255,0.19)',
                            paddingBottom: 10,
                            paddingLeft: 8, borderRadius: 15, paddingTop: 5, paddingRight: 8, marginRight: 10}}>
                            <TextInput multiline={true} style={{color: '#ffffff', maxHeight: 80}} placeholderTextColor={'#b1b1b1'} value={this.state.message} onChangeText={text => this.setState({message: text})} placeholder={'Exprimez-vous...'}/>
                        </View>
                        {this.state.message.length != 0 &&
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
    }
});

export default ChatScreen;
