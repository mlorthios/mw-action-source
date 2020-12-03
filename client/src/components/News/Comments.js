import React from 'react';
import {View, Text, Dimensions, ScrollView, StatusBar, ImageBackground, TouchableOpacity, Image, Platform, TextInput} from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
TimeAgo.addLocale(fr);


class NewsCommentComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            comments: [],
        }
    }

    _sendMsg(){
        //emit a dong message to socket server
        
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <View>

                    </View>
                </View>
                <View style={{justifyContent: 'flex-end', flex: 1}}>
                    <View style={{backgroundColor: '#404040',paddingLeft: 20, paddingBottom: 40, paddingRight: 20, paddingTop: 15, maxHeight: 120}}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput placeholderTextColor={'#b5b5b5'} multiline style={{flexGrow: 1, color: '#fff', fontSize: 16}} placeholder="Ajouter un commentaire..."/>
                            <TouchableOpacity>
                                <Icon name={'send'} color='#fff'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

}

export default NewsCommentComponent;