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
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import CachedImage from 'react-native-image-cache-wrapper';
import uri from 'rn-fetch-blob/utils/uri';
import AppLink from 'react-native-app-link';
import VersionCheck from 'react-native-version-check';

class UpdateScreen extends React.Component {

    constructor() {
        super();

        this.state = {

        };
    }

    openStore() {
        if(Platform.OS === 'ios') {
            Linking.openURL('https://apps.apple.com/fr/app/id1486772141');
        } else {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.mwactudev');
        }
    }

    render() {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, marginLeft: 40, marginRight: 40}}>
                <Image resizeMode="contain"
                       style={{width:Dimensions.get('window').width / 1.5, height: 90}} source={require('../../assets/logo.png')}/>
                <Text style={{textAlign: 'center', color: '#fff', fontSize: 25, fontWeight: 'bold'}}>Mise à jour requise</Text>
                <Text style={{textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 19}}>
                    Veuillez installer la dernière mise à jour pour continuer à utiliser l'application
                </Text>
                <TouchableOpacity onPress={() => this.openStore()} style={{marginBottom: 5}}>
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
                        <Text style={{backgroundColor:'#0074ff',
                            color: '#fff',
                            paddingLeft: 19, paddingRight: 19, paddingTop: 8, paddingBottom: 8, fontSize: 18, borderRadius: 10, overflow: 'hidden'}}>Installer maintenant</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default UpdateScreen;
