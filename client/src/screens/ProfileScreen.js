import React from 'react';
import {View, Text, TouchableOpacity, Platform, FlatList, TextInput, Alert, Image, Dimensions, AsyncStorage} from 'react-native';
import Firebase, {db } from '../config/Firebase';
import DeviceInfo from 'react-native-device-info';
import {Avatar, Icon} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

class ProfileScreen extends React.Component {

    constructor(props) {
        super(props);

        this.user = {
            username: Firebase.auth().currentUser.displayName,
        };

        this.state = {
            user_data: [],
            user_certified: [],
            isLoading: true
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

    render() {
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
                        marginBottom: 10,
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: 17,
                            textAlign: 'center',
                        }}>
                            {this.state.user_data ? (
                                <Text>{this.state.user_data.displayName}</Text>
                            ) : (
                                <Text>{this.user.username}</Text>
                            )}
                        </Text>
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
                            alignItems: 'center'
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
                                }}>1</Text>
                                <Text style={{color: '#dadada', textAlign: 'center'}}>Abonnements</Text>
                            </View>
                            <View style={{alignContent: 'center', flex: 1}}>
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    fontSize: 17,
                                }}>679,8K</Text>
                                <Text style={{color: '#dadada', textAlign: 'center'}}>Abonnés</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    fontSize: 17,
                                }}>98,4M</Text>
                                <Text style={{color: '#dadada', textAlign: 'center'}}>J'aime</Text>
                            </View>
                        </View>
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
                                        <Text style={{fontWeight: '500', fontSize: 15}}>S'abonner</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginRight: 5}}>
                                <TouchableOpacity>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 40,
                                        paddingRight: 14,
                                        paddingLeft: 14,
                                        borderRadius: 2,
                                        borderColor: '#fff',
                                        borderWidth: 2,
                                        overflow: 'hidden',
                                    }}>

                                        <FontAwesome5 name={'playstation'} size={17} color={'#FFF'}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
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
                    </View>
                </View>
            </View>
        );
    }
}

export default ProfileScreen;
