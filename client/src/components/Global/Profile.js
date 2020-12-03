import React from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    StatusBar,
    ImageBackground,
    Linking,
    Image,
    WebView,
    TouchableOpacity, Switch,
} from 'react-native';
import {colors_dark, colors_light} from '../../config/Themes';
import {withNavigation} from "react-navigation";
import Firebase from '../../config/Firebase';
import {Icon, ListItem} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

class GlobalProfileComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            logging: false,
            url: 'https://twitter.com/MWActu',
            currentUser: null
        }
    }

    signOutUser = () => {
        Firebase.auth().signOut();
    };

    componentDidMount() {
        const { currentUser } = Firebase.auth()
        this.setState({ currentUser })
    }

    loadInBrowser = () => {
        Linking.openURL(this.state.url).catch(err => console.error("Couldn't load page", err));
    };

    openSnapchat = () => {
        Linking.openURL('https://snapchat.com/add/mwa-team').catch(err => console.error("Couldn't load page", err));
    };

    openInsta = () => {
        Linking.openURL('https://instagram.com/mwa_team').catch(err => console.error("Couldn't load page", err));
    };

    render() {

        const { themeMode } = this.props;

        return (
            <View style={{marginBottom: 5}}>
                <View style={{marginLeft: 15}}>
                    {themeMode == 'dark' ? (
                        <Image style={{height: 50, width: Dimensions.get('window').width / 3}} resizeMode="contain" source={require('../../../assets/logo.png')}/>
                    ) : (
                        <Image style={{height: 50, width: Dimensions.get('window').width / 3}} resizeMode="contain" source={require('../../../assets/logo-light.png')}/>
                    )}
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={{marginRight: 7}} onPress={() => this.openInsta()}>
                            <FontAwesome5 name={'instagram'} size={30} brand color={themeMode == 'dark' ? '#fff' : '#000'}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.openSnapchat()}>
                            <FontAwesome5 name={'snapchat-ghost'} size={27} brand color={themeMode == 'dark' ? '#fff' : '#000'}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.currentUser &&
                    <ListItem
                        leftAvatar={{ title: 'M', source: { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' } }}
                        title={Firebase.auth().currentUser.displayName}
                        titleStyle={{color: '#fff', fontWeight: '600', marginLeft: -5}}
                        containerStyle={{backgroundColor: 'transparent', borderRadius: 10}}
                        rightElement={
                            (
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('MyProfile')}>
                                    <Icon name={'person'} size={25} color={'#fff'}/>
                                </TouchableOpacity>
                            )
                        }
                    />
                }
            </View>
        );
    }
}

export default withNavigation(GlobalProfileComponent);
