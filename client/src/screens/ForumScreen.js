import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Switch, Alert, Dimensions} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import CachedImage from 'react-native-image-cache-wrapper';
import uri from 'rn-fetch-blob/utils/uri';

class ForumScreen extends React.Component {

    constructor() {
        super();

        this.state = {

        };
    }

    render() {
        return (
            <View style={{marginTop: 56, marginBottom: 15}}>
                <View style={{marginLeft: 25, flexDirection: 'row'}}>
                    <Text style={{color: '#fff', fontWeight: '600', fontSize: 27}}>Forums</Text>
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
                    <View style={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.29,
                        shadowRadius: 4.65,

                        elevation: 7,
                    }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ForumsCategory', { idCategory: 1 })}>
                        <View style={{height: 70, backgroundColor: '#373737', borderRadius: 15, flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row', height: 70, width: 70, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, overflow: 'hidden'}}><CachedImage style={{height: '100%', width: '100%'}} source={{uri:'https://api.mwactu.fr/img/discussion.png'}}/></View>
                            <View style={{justifyContent: 'center'}}>
                                <Text style={{fontSize: 21, fontWeight: '500', color: '#fff', marginLeft: 15}}>Discussions générales</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default ForumScreen;
