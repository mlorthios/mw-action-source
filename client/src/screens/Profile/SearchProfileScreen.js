import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    FlatList,
    TextInput,
    Alert,
    Image,
    Dimensions,
    AsyncStorage,
    ImageBackground,TouchableHighlight

} from 'react-native';
import Firebase, {db } from '../../config/Firebase';
import DeviceInfo from 'react-native-device-info';
import {Avatar, Icon, SearchBar, ListItem} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

class ProfileSearchProfileScreen extends React.Component {

    constructor(props) {
        super(props);

        this.user = {
            username: Firebase.auth().currentUser.displayName,
        };

        this.state = {
            search: '',
            search_data: []
        }
    }

    componentDidMount() {
        db.doc('users/'+Firebase.auth().currentUser.uid)
            .get()
            .then((doc)=>{
                this.setState({user_data: doc.data(), isLoading: false});
                this.setState({user_certified: doc.data().certified, isLoading: false});
            })
            .catch(e => console.log(e));
    }

    searchAction(user) {
        this.setState({search: user});
        if(user.length != 0) {
            db.collection('users/').orderBy('username').startAt(user).endAt(user+'\uf8ff').limit(50).get()
                .then(snapshot => {
                    var users = [];
                    if (snapshot.empty) {
                        return;
                    }

                    snapshot.forEach(doc => {
                        users.push(doc.data())
                    });

                    this.setState({search_data: users})
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
        } else {
            this.setState({search_data: []})
        }

    }

    _renderItem (item, i) {
        return (
            <TouchableOpacity style={{zIndex: 9}} onPress={() => this.props.navigation.navigate('UserProfile',
                {id: item.id, username: item.username, displayName: item.displayName})}>
                <View style={{
                    marginBottom: 6,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,

                    elevation: 7,
                }}>
                <ListItem
                    key={i}
                    containerStyle={{backgroundColor: 'rgba(68,68,68,0.58)', padding: 7, marginBottom: 5, borderRadius: 10}}
                    leftAvatar={{ size:'medium', title: item.username[0], source: { uri: item.avatar } }}
                    title={
                        (
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 15, color: '#fff', fontWeight: '500', marginRight: 4}}>{item.username}</Text>
                            {item.certified.verified &&
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Icon name={'check-circle'} iconStyle={{color: '#2d97ff'}} containerStyle={{marginRight: 6}} type={'font-awesome'} size={15}/>
                            </View>
                            }
                        </View>
                        )
                    }
                    subtitleStyle={{fontSize: 14, color: '#919191'}}
                    subtitle={item.displayName}
                />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{marginBottom: 15}}>
                <View style={{
                    marginBottom: 0,
                }}>
                    <View style={{
                        marginLeft: 14,
                        marginRight: 14,
                        marginTop: Platform.OS === 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? 46 : 30 : 25,
                        marginBottom: 0,
                    }}>
                        <SearchBar
                            autoCapitalize={'none'}
                            platform="ios"
                            disableFullscreenUI={true}
                            containerStyle={{backgroundColor: 'transparent', zIndex: 0}}
                            inputContainerStyle={{backgroundColor: 'rgba(255,255,255,0.18)'}}
                            inputStyle={{color: '#fff'}}
                            placeholderTextColor={'#959595'}
                            placeholder="Rechercher"
                            cancelButtonTitle={null}
                            showCancel={false}
                            onChangeText={(user, i) => this.searchAction(user, i)}
                            value={this.state.search}
                        />
                    </View>
                </View>
                <View style={{marginLeft: 25, marginRight: 25}}>
                    {this.state.search_data.length != 0 ? (
                        <FlatList
                            keyboardShouldPersistTaps={'handle'}
                            data={this.state.search_data}
                            renderItem={({ item }) => this._renderItem(item)}
                            keyExtractor={item => item.id}
                        />
                    ) : (
                        <View></View>
                    )}
                </View>
            </View>
        );
    }
}

export default ProfileSearchProfileScreen;
