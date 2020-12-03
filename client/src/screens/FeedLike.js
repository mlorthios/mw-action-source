import React from 'react';
import {View, Text, TouchableOpacity } from 'react-native';
import { Avatar, ListItem, Icon, SearchBarIOS, SearchBar } from 'react-native-elements';

class FeedLikeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text: ''};
    }

    render() {
        return (
            <View style={{marginTop: 10, marginLeft: 10}}>
                <View>
                    <SearchBar
                        containerStyle={{backgroundColor: 'transparent'}}
                        platform="ios"
                        placeholder="Rechercher"
                        cancelButtonTitle={null}
                        showCancel={false}
                    />
                </View>
                <View>
                    <ListItem
                        leftAvatar={{ source: { uri: 'https://www.mediaslibres.com/wp-content/uploads/2018/10/profil-homme-meetic-640x427.jpg' } }}
                        title="elliot"
                        subtitle="Developer"
                        rightElement={
                            <TouchableOpacity>
                                <Text style={{overflow: 'hidden', fontWeight: '600', backgroundColor: '#097cff', color: 'white', paddingLeft: 16, paddingRight: 16, paddingBottom: 6, paddingTop: 6, borderRadius: 6}}>S'abonner</Text>
                            </TouchableOpacity>
                        }
                    />
                    <ListItem
                        leftAvatar={{ source: { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' } }}
                        title="mathislts"
                        subtitle="CEO of Instadev"
                        rightElement={
                            <TouchableOpacity>
                                <Text style={{overflow: 'hidden', fontWeight: '600', backgroundColor: '#097cff', color: 'white', paddingLeft: 16, paddingRight: 16, paddingBottom: 6, paddingTop: 6, borderRadius: 6}}>S'abonner</Text>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </View>
        );
    }
}

export default FeedLikeScreen;
