import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Switch, Alert, Dimensions, Platform, StyleSheet} from 'react-native';
import {Icon, ListItem, Avatar, Badge, withBadge} from 'react-native-elements';
import CachedImage from 'react-native-image-cache-wrapper';
import uri from 'rn-fetch-blob/utils/uri';
import TouchableScale from 'react-native-touchable-scale';
import DeviceInfo from 'react-native-device-info';

styles = StyleSheet.create({
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5
    },
    ratingImage: {
        height: 19.21,
        width: 100
    },
    ratingText: {
        paddingLeft: 10,
        color: 'grey'
    }
})

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

class ForumCategoryScreen extends React.Component {

    constructor() {
        super();

        this.state = {

        };
    }

    render() {
        return (
            <View style={{marginTop: Platform.OS === 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? 46 : 30 : 25, marginBottom: 15}}>
                <View style={{flexDirection: 'row', alignItems:'flex-start', marginLeft: 25, marginBottom: 20}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <View style={{backgroundColor: 'rgba(0,0,0,0.6)', height: 30, width: 30, borderRadius: 30 / 2, flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'center'}}><Icon name="ios-arrow-back" size={20} type="ionicon" color="#fff" /></View>
                    </TouchableOpacity>
                </View>
                <View style={{marginLeft: 25, flexDirection: 'row'}}>
                    <Text style={{color: '#fff', fontWeight: '600', fontSize: 27}}>Discussions générales</Text>
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
                    <View style={{marginBottom: 9}}>
                        <Text style={{color: '#fff', fontWeight: '600', fontSize: 17}}>Épinglé</Text>
                    </View>
                    <View style={{
                        marginBottom: 8,
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
                            Component={TouchableScale}
                            containerStyle={{backgroundColor: '#613501', borderRadius: 10}}
                            title={
                                <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        color: '#fff',
                                        marginRight: 7,
                                        backgroundColor: '#ca7501',
                                        paddingLeft: 7,
                                        paddingRight: 7,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderRadius: 10,
                                        overflow: 'hidden'}}>Annonce</Text>
                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Qui pour un Call Of ?</Text>
                                </View>
                            }
                            subtitle={
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Icon name="star" color={'#f5f014'} type="font-awesome" size={13}/>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5f014', fontWeight: '600', fontSize: 13}}>
                                                    Mathis
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={{color: '#fff', fontSize: 13}}> - il y a 5 heures</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{color: '#fff', fontSize: 13}}>Dernière réponse par </Text>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5838c', fontWeight: '600', fontSize: 13}}>
                                                    Arwantys
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }
                            leftAvatar={{ size: "medium", rounded: true, source: { uri: 'https://randomuser.me/api/portraits/men/41.jpg' } }}
                        />
                    </View>
                    <View style={{
                        marginBottom: 8,
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
                            Component={TouchableScale}
                            containerStyle={{backgroundColor: '#490006', borderRadius: 10}}
                            title={
                                <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{color: '#fff', marginRight: 7, backgroundColor: '#ca0009', paddingLeft: 7, paddingRight: 7, paddingTop: 4, paddingBottom: 4, borderRadius: 10, overflow: 'hidden'}}>Important</Text>

                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Qui pour un Call Of ?</Text>
                                </View>
                            }
                            subtitle={
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Icon name="star" color={'#f5f014'} type="font-awesome" size={13}/>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5f014', fontWeight: '600', fontSize: 13}}>
                                                    Mathis
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={{color: '#fff', fontSize: 13}}> - il y a 5 heures</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{color: '#fff', fontSize: 13}}>Dernière réponse par </Text>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5838c', fontWeight: '600', fontSize: 13}}>
                                                    Arwantys
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }
                            leftAvatar={{ size: "medium", rounded: true, source: { uri: 'https://randomuser.me/api/portraits/men/41.jpg' } }}
                        />
                    </View>
                    <View style={{
                        marginBottom: 8,
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
                            Component={TouchableScale}
                            containerStyle={{backgroundColor: '#18365e', borderRadius: 10}}
                            title={
                                <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        color: '#fff',
                                        marginRight: 7,
                                        backgroundColor: '#226bca',
                                        paddingLeft: 7,
                                        paddingRight: 7,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderRadius: 10,
                                        overflow: 'hidden'}}>PS4</Text>
                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Qui pour un Call Of ?</Text>
                                </View>
                            }
                            subtitle={
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Icon name="star" color={'#f5f014'} type="font-awesome" size={13}/>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5f014', fontWeight: '600', fontSize: 13}}>
                                                    Mathis
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={{color: '#fff', fontSize: 13}}> - il y a 5 heures</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{color: '#fff', fontSize: 13}}>Dernière réponse par </Text>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5838c', fontWeight: '600', fontSize: 13}}>
                                                    Arwantys
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }
                            leftAvatar={{ size: "medium", rounded: true, source: { uri: 'https://randomuser.me/api/portraits/men/41.jpg' } }}
                        />
                    </View>
                    <View style={{
                        marginBottom: 8,
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
                            Component={TouchableScale}
                            containerStyle={{backgroundColor: '#034b00', borderRadius: 10}}
                            title={
                                <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        color: '#fff',
                                        marginRight: 7,
                                        backgroundColor: '#25ca0f',
                                        paddingLeft: 7,
                                        paddingRight: 7,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderRadius: 10,
                                        overflow: 'hidden'}}>Xbox</Text>
                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Qui pour un Call Of ?</Text>
                                </View>
                            }
                            subtitle={
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Icon name="star" color={'#f5f014'} type="font-awesome" size={13}/>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5f014', fontWeight: '600', fontSize: 13}}>
                                                    Mathis
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={{color: '#fff', fontSize: 13}}> - il y a 5 heures</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{color: '#fff', fontSize: 13}}>Dernière réponse par </Text>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5838c', fontWeight: '600', fontSize: 13}}>
                                                    Arwantys
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }
                            leftAvatar={{ size: "medium", rounded: true, source: { uri: 'https://randomuser.me/api/portraits/men/41.jpg' } }}
                        />
                    </View>
                    <View style={{
                        marginBottom: 8,
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
                            Component={TouchableScale}
                            containerStyle={{backgroundColor: '#3b094b', borderRadius: 10}}
                            title={
                                <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        color: '#fff',
                                        marginRight: 7,
                                        backgroundColor: '#831cca',
                                        paddingLeft: 7,
                                        paddingRight: 7,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderRadius: 10,
                                        overflow: 'hidden'}}>PC</Text>
                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Qui pour un Call Of ?</Text>
                                </View>
                            }
                            subtitle={
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Icon name="star" color={'#f5f014'} type="font-awesome" size={13}/>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5f014', fontWeight: '600', fontSize: 13}}>
                                                    Mathis
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={{color: '#fff', fontSize: 13}}> - il y a 5 heures</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{color: '#fff', fontSize: 13}}>Dernière réponse par </Text>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5838c', fontWeight: '600', fontSize: 13}}>
                                                    Arwantys
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }
                            leftAvatar={{ size: "medium", rounded: true, source: { uri: 'https://randomuser.me/api/portraits/men/41.jpg' } }}
                        />
                    </View>
                    <View style={{
                        marginBottom: 8,
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
                            Component={TouchableScale}
                            containerStyle={{backgroundColor: '#004b4a', borderRadius: 10}}
                            title={
                                <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        color: '#fff',
                                        marginRight: 7,
                                        backgroundColor: '#00cac8',
                                        paddingLeft: 7,
                                        paddingRight: 7,
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        borderRadius: 10,
                                        overflow: 'hidden'}}>CP</Text>
                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Qui pour un Call Of ?</Text>
                                </View>
                            }
                            subtitle={
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Icon name="star" color={'#f5f014'} type="font-awesome" size={13}/>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5f014', fontWeight: '600', fontSize: 13}}>
                                                    Mathis
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={{color: '#fff', fontSize: 13}}> - il y a 5 heures</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{color: '#fff', fontSize: 13}}>Dernière réponse par </Text>
                                        <TouchableOpacity style={{flexDirection: 'row'}}>
                                            <Text style={{color: '#fff', marginLeft: 2}}>
                                                <Text style={{color: '#f5838c', fontWeight: '600', fontSize: 13}}>
                                                    Arwantys
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }
                            leftAvatar={{ size: "medium", rounded: true, source: { uri: 'https://randomuser.me/api/portraits/men/41.jpg' } }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default ForumCategoryScreen;
