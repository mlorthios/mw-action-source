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
    TouchableHighlight,
} from 'react-native';
import Firebase, {db} from '../../config/Firebase';
import DeviceInfo from 'react-native-device-info';
import {Avatar, Icon} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UtilsConvertNumber from '../../utils/ConvertNumber';

import ActionsProfileFollow from '../../actions/Profile/Follow';

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

class ProfileUserProfileScreen extends React.Component {

    constructor(props) {
        super(props);

        this.user = {
            username: Firebase.auth().currentUser.displayName,
        };

        this.state = {
            user_data: [],
            user_certified: [],
            user_platform: [],
            user_nb_subscribers: 0,
            user_nb_subscriptions: 0,
            isLoading: true,
            follow: null,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const navigation_id = navigation.getParam('id', '1');
        console.log(navigation_id + ' monted');
        db.doc('users/' + navigation_id)
            .get()
            .then((doc) => {
                this.setState({user_data: doc.data(), isLoading: false});
                this.setState({user_certified: doc.data().certified, isLoading: false});
                this.setState({user_platform: doc.data().platform, isLoading: false});
            })
            .catch(e => console.log(e));

        db.doc('users/' + Firebase.auth().currentUser.uid).collection('subscriptions').doc(navigation_id)
            .get()
            .then((doc) => {
                console.log(doc.data());
                if (doc.exists && doc.data().subscriptions == true) {
                    this.setState({follow: true});
                } else {
                    this.setState({follow: false});
                }
            });

        db.doc('users/' + navigation_id).collection('subscriptions')
            .get()
            .then((doc) => {
                const nb = doc.size;
                console.log(nb);
                this.setState({user_nb_subscriptions: nb});
            });

        db.doc('users/'+navigation_id).collection('subscribers')
            .get()
            .then((doc) => {
                const nb = doc.size;
                console.log(nb);
                this.setState({user_nb_subscribers: nb});
            })
    }

    follow() {
        const {navigation} = this.props;
        const navigation_id = navigation.getParam('id', '1');

        const response = new ActionsProfileFollow().follow(Firebase.auth().currentUser.uid, navigation_id);

        if (response) {
            this.setState({follow: true, user_nb_subscribers: this.state.user_nb_subscribers + 1});
        } else {
            Alert.alert('Vous ne pouvez pas vous suivre');
        }
    }

    unfollow() {
        const {navigation} = this.props;
        const navigation_id = navigation.getParam('id', '1');

        const response = new ActionsProfileFollow().unfollow(Firebase.auth().currentUser.uid, navigation_id);

        if (response) {
            this.setState({follow: false, user_nb_subscribers: this.state.user_nb_subscribers - 1});
        } else {
            Alert.alert('Vous ne pouvez pas vous suivre');
        }
    }

    render() {
        const {navigation} = this.props;
        const navigation_username = navigation.getParam('username', 'chargement');
        const navigation_displayName = navigation.getParam('displayName', 'chargement');
        const navigation_id = navigation.getParam('id', '1');
        return (
            <View style={{marginBottom: 15, flex: 1}}>
                <View style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    marginBottom: 12,
                }}>
                    <View style={{
                        marginLeft: 25,
                        marginRight: 25,
                        marginTop: Platform.OS === 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? 46 : 30 : 25,
                        marginBottom: 5,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <View style={{paddingRight: 22}}>
                                <Icon name={'ios-arrow-back'} type={'ionicon'} size={25} color={'#fff'}/>
                            </View>
                        </TouchableOpacity>
                        <Text style={{
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: 17,
                            textAlign: 'center',
                        }}>
                            {this.state.user_data ? (
                                <Text>{this.state.user_data.displayName}</Text>
                            ) : (
                                <Text>{navigation_displayName}</Text>
                            )}
                        </Text>
                        {navigation_id == Firebase.auth().currentUser.uid ? (
                            <Icon name={'bars'} type={'font-awesome'} size={20} color={'#fff'}/>
                        ) : (
                            <Icon name={'ellipsis-h'} type={'font-awesome'} size={20} color={'#fff'}/>
                        )}

                    </View>
                </View>
                <View style={{marginLeft: 25, marginRight: 25}}>
                    <View style={{justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                        <Avatar
                            containerStyle={{marginBottom: 10}}
                            showEditButton={true}
                            editButton={{
                                name: 'ios-camera',
                                type: 'ionicon',
                                underlayColor: '#fff',
                                color: '#000',
                                style: {backgroundColor: '#e2e2e2', borderWidth: 1, borderColor: '#1f1f1f'},
                            }}
                            onEditPress={() => Alert.alert('ok')}
                            title={this.user.username[0]}
                            size={'large'}
                            rounded={true}
                            source={{uri: 'http://steamavatars.co/wp-content/uploads/2016/01/gorillaz_steam_avatars.jpg'}}/>
                        <View style={{marginBottom: 10}}>
                            <Text style={{color: '#fff', fontWeight: '500'}}>
                                {this.state.isLoading == false ? (
                                    <Text>@{this.state.user_data.username}</Text>
                                ) : (
                                    <Text>@{navigation_username}</Text>
                                )}
                            </Text>
                        </View>
                        {this.state.user_certified && this.state.user_certified.verified &&
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: 'rgba(255,255,255,0.84)',
                            paddingRight: 8,
                            paddingLeft: 4,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderRadius: 15,
                            marginBottom: 18,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Icon name={'check'} containerStyle={{marginRight: 6}} type={'font-awesome'} size={11}
                                  iconStyle={{
                                      padding: 4,
                                      color: '#FFF',
                                      backgroundColor: '#348fff',
                                      borderRadius: 10,
                                      overflow: 'hidden',
                                  }}/>
                            <Text style={{color: '#3e3e3e', fontWeight: '500'}}>{this.state.user_certified.value}</Text>
                        </View>
                        }
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 18}}>
                            <View style={{flex: 1}}>
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    fontSize: 17,
                                }}>{new UtilsConvertNumber().convert(this.state.user_nb_subscriptions, 1)}</Text>
                                <Text style={{color: '#dadada', textAlign: 'center'}}>Abonnements</Text>
                            </View>
                            <View style={{alignContent: 'center', flex: 1}}>
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    fontSize: 17,
                                }}>
                                    {new UtilsConvertNumber().convert(this.state.user_nb_subscribers, 1)}
                                </Text>
                                <Text style={{color: '#dadada', textAlign: 'center'}}>Abonnés</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    fontSize: 17,
                                }}>{new UtilsConvertNumber().convert(1279, 1)}</Text>
                                <Text style={{color: '#dadada', textAlign: 'center'}}>J'aime</Text>
                            </View>
                        </View>
                        {navigation_id == Firebase.auth().currentUser.uid ? (
                            <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                <View style={{marginRight: 5}}>
                                    <TouchableOpacity>
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 40,
                                            backgroundColor: '#fff',
                                            paddingRight: 14,
                                            paddingLeft: 14,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                        }}>
                                            <Text style={{fontWeight: '500', fontSize: 15}}>Éditer</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                <View style={{marginRight: 5}}>
                                    {this.state.follow == true ? (
                                        <TouchableOpacity onPress={() => this.unfollow()}>
                                            <View style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: 40,
                                                backgroundColor: '#fff',
                                                paddingRight: 14,
                                                paddingLeft: 14,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                            }}>
                                                <Text style={{fontWeight: '500', fontSize: 15}}>Abonné(e)</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : this.state.follow == false ? (
                                        <TouchableOpacity onPress={() => this.follow()}>
                                            <View style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: 40,
                                                backgroundColor: 'transparent',
                                                borderWidth: 2,
                                                borderColor: '#fff',
                                                paddingRight: 14,
                                                paddingLeft: 14,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                            }}>
                                                <Text style={{
                                                    fontWeight: '500',
                                                    fontSize: 15,
                                                    color: '#FFF',
                                                }}>S'abonner</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity>
                                            <View style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: 40,
                                                width: 69,
                                                backgroundColor: '#fff',
                                                paddingRight: 14,
                                                paddingLeft: 14,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                            }}>
                                                <Text style={{fontWeight: '500', fontSize: 15}}></Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {this.state.user_platform && this.state.user_platform.psn != '' &&
                                <View style={{marginRight: 5}}>
                                    <TouchableOpacity onPress={() => Alert.alert(this.state.user_platform.psn)}>
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 40,
                                            paddingRight: 14,
                                            paddingLeft: 14,
                                            borderRadius: 2,
                                            borderColor: '#fff',
                                            backgroundColor: '#665cbe',
                                            borderWidth: 2,
                                            overflow: 'hidden',
                                        }}>

                                            <FontAwesome5 name={'playstation'} size={17} color={'#FFF'}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                }
                                {this.state.user_platform && this.state.user_platform.xbox != '' &&
                                <View style={{marginRight: 5}}>
                                    <TouchableOpacity onPress={() => Alert.alert(this.state.user_platform.xbox)}>
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 40,
                                            paddingRight: 14,
                                            paddingLeft: 14,
                                            borderRadius: 2,
                                            borderColor: '#fff',
                                            backgroundColor: '#9bc848',
                                            borderWidth: 2,
                                            overflow: 'hidden',
                                        }}>

                                            <FontAwesome5 name={'xbox'} size={17} color={'#FFF'}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                }
                                {this.state.user_platform && this.state.user_platform.battle != '' &&
                                <View style={{marginRight: 5}}>
                                    <TouchableOpacity onPress={() => Alert.alert(this.state.user_platform.battle)}>
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 40,
                                            paddingRight: 14,
                                            paddingLeft: 14,
                                            borderRadius: 2,
                                            borderColor: '#fff',
                                            backgroundColor: '#bb8410',
                                            borderWidth: 2,
                                            overflow: 'hidden',
                                        }}>

                                            <FontAwesome5 name={'laptop'} brand size={17} color={'#FFF'}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                }
                                <View>
                                    <TouchableOpacity>
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 40,
                                            paddingRight: 14,
                                            backgroundColor: '#571e25',
                                            paddingLeft: 14,
                                            borderRadius: 2,
                                            borderColor: '#fff',
                                            borderWidth: 2,
                                            overflow: 'hidden',
                                        }}>

                                            <FontAwesome5 name={'chart-bar'} size={17} color={'#FFF'}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

export default ProfileUserProfileScreen;
