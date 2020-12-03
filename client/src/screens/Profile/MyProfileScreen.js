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
import ImagePicker from 'react-native-image-picker';
import UtilsConvertNumber from '../../utils/ConvertNumber';
import uuid from 'uuid/v4';
import 'firebase/storage';
import UploadAva from '../../utils/UploadAvatar';

import ActionsProfileFollow from '../../actions/Profile/Follow';

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

const options = {
    title: 'Sélectionner une image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

class ProfileUserProfileScreen extends React.Component {

    constructor(props) {
        super(props);

        this.user = {
            username: Firebase.auth().currentUser.displayName,
        };

        this.state = {
            avatar: '',
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
        const navigation_id = Firebase.auth().currentUser.uid;
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

    pickImage = () => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                // Nothing
            } else if (response.error) {
                Alert.alert('error')
            } else {
                const { uri } = response;
                const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                return Firebase.storage()
                    .ref(`photos/newPhotoId`)
                    .put(uploadUri)
                    .then(file => file.ref)
                    .catch(error => error);
            }
        });
    };

    uploadImage = () => {
        const ext = this.state.imageUri.split('.').pop(); // Extract image extension
        const filename = `${uuid()}.${ext}`; // Generate unique name
        this.setState({ uploading: true });
        Firebase
            .storage()
            .ref(`tutorials/images/${filename}`)
            .putFile(this.state.imageUri)
            .on(
                Firebase.storage.TaskEvent.STATE_CHANGED,
                snapshot => {
                    let state = {};
                    state = {
                        ...state,
                        progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
                    };
                    if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                        const allImages = this.state.images;
                        allImages.push(snapshot.downloadURL);
                        state = {
                            ...state,
                            uploading: false,
                            imgSource: '',
                            imageUri: '',
                            progress: 0,
                            images: allImages
                        };
                        AsyncStorage.setItem('images', JSON.stringify(allImages));
                    }
                    this.setState(state);
                },
                error => {
                    unsubscribe();
                    alert('Sorry, Try again.');
                }
            );
    };

    render() {
        const navigation_id = Firebase.auth().currentUser.uid;
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
                            {this.state.user_data &&
                                <Text>{this.state.user_data.displayName}</Text>
                            }
                        </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
                            <View>
                                <Icon name={'bars'} type={'font-awesome'} size={20} color={'#fff'}/>
                            </View>
                        </TouchableOpacity>
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
                            onEditPress={this.pickImage}
                            title={this.user.username[0]}
                            size={'large'}
                            rounded={true}
                            source={{uri: this.state.avatar}}/>
                        <View style={{marginBottom: 10}}>
                            <Text style={{color: '#fff', fontWeight: '500'}}>
                                {this.state.isLoading == false &&
                                    <Text>@{this.state.user_data.username}</Text>
                                }
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
                        {navigation_id == Firebase.auth().currentUser.uid &&
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
                        }
                    </View>
                </View>
            </View>
        );
    }
}

export default ProfileUserProfileScreen;
