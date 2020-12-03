import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Switch,
    Alert,
    Dimensions,
    Image,
    Button,
    Platform,
    Linking,
    StatusBar,
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import CachedImage from 'react-native-image-cache-wrapper';
import byteSize from "byte-size";

class CheckUpdateScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#212121'}}>
                <StatusBar barStyle="light-content"/>
                <Image resizeMode="contain" style={{width:Dimensions.get('window').width / 1.8, height: 90}} source={require('../../assets/logo.png')}/>
                <Text style={{textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 'bold'}}>{this.props.status}</Text>
                {this.props.status == 'Téléchargement des packages' &&
                <Text style={{textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 19}}>
                    {byteSize(this.props.receivedBytes).value}{byteSize(this.props.receivedBytes).unit} sur {byteSize(this.props.totalBytes).value}{byteSize(this.props.totalBytes).unit}
                </Text>
                }
            </View>
        );
    }
}


export default CheckUpdateScreen;
