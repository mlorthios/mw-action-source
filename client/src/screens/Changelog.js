import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Switch, Alert, Dimensions, Platform, StyleSheet} from 'react-native';
import {Icon, ListItem, Avatar, Badge, withBadge} from 'react-native-elements';
import CachedImage from 'react-native-image-cache-wrapper';
import uri from 'rn-fetch-blob/utils/uri';
import TouchableScale from 'react-native-touchable-scale';

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

class ChangelogScreen extends React.Component {

    constructor() {
        super();

        this.state = {

        };
    }

    render() {
        return (
            <View style={{marginTop: 56, marginBottom: 15}}>
                <View style={{flexDirection: 'row', alignItems:'flex-start', marginLeft: 25, marginBottom: 20}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <View style={{backgroundColor: 'rgba(0,0,0,0.6)', height: 30, width: 30, borderRadius: 30 / 2, flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'center'}}><Icon name="ios-arrow-back" size={20} type="ionicon" color="#fff" /></View>
                    </TouchableOpacity>
                </View>
                <View style={{marginLeft: 25, flexDirection: 'row'}}>
                    <Text style={{color: '#fff', fontWeight: '600', fontSize: 27}}>Changelog</Text>
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
            </View>
        );
    }
}

export default ChangelogScreen;
