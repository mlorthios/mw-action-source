import React from 'react';
import {View, Text, Dimensions, ScrollView, StatusBar, ImageBackground, Alert, TouchableOpacity, Image, Platform, Modal, ActivityIndicator} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Icon, Overlay } from 'react-native-elements';
import HTML from 'react-native-render-html';
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
TimeAgo.addLocale(fr);
import DeviceInfo from 'react-native-device-info';
import LottieView from 'lottie-react-native';

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];


import NewsCommentComponent from '../../components/News/Comments';

class NewsDetailComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoaded: false,
            news: [],
            refreshing: false,
            modalComment: false,
            liked: false,
            overlayLogging: false,
        
        }
    }

    goBack() {
        const { navigation } = this.props;
        if(navigation.getParam('notification', false) == true) {
            navigation.navigate('Home');
        } else {
            navigation.goBack();
        }
    }

    componentDidMount() {
        this.requestNews();
        this.verifylike();
    }

    verifylike() {
        const { navigation } = this.props;
        fetch("https://api.mwactu.fr/v1/verify_likes/?deviceid="+DeviceInfo.getUniqueId()+"&id=" + navigation.getParam('idNews', '1'))
            .then(res => res.json())
            .then(
                (result) => {
                    if(result['status'] == 'dislike') {
                        this.setState({
                            liked: true
                        });
                        this.animation.play();
                    }
                (error) => {
                    this.setState({
                        liked: false
                    });
                }
            
        });
    }

    like() {
        const { navigation } = this.props;
        fetch('https://api.mwactu.fr/v1/like/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: "id="+navigation.getParam('idNews', '1')+"&deviceid="+DeviceInfo.getUniqueId(),
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result['status'] === 'success') {
                        //Alert.alert('Merci !', 'Votre commentaire a bien été ajouté');
                        this.animation.play();
                        this.setState({liked: true})
                    } else if(result['status'] === 'dislike') {
                        //Alert.alert('Oh non !', 'Vous venez de retirer votre mention j\'aime');
                        this.setState({liked: false})
                        this.animation.reset();
                    } else {
                        Alert.alert('Oups !', result['response']);
                    }
                },
                (error) => {
                    this.setState({
                        liked: false
                    });
                })
    }

    requestNews = () => {
        const { navigation } = this.props;
        fetch("https://api.mwactu.fr/v1/news/?id=" + navigation.getParam('idNews', '1'))
            .then(res => res.json())
            .then(
                (result) => {
                    if(result != 0) {
                        this.setState({
                            isLoaded: true,
                            refreshing: false,
                            news: result
                        });
                    } else {
                        this.props.navigation.navigate('Home');
                    }
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        refreshing: false
                    });
                }
            )
    };

    DateConvert(mysql_string)
    {
        var t, result = null;

        if( typeof mysql_string === 'string' )
        {
            t = mysql_string.split(/[- :]/);

            result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
        }

        return result;
    }

    _comment() {
        return(
            <TouchableOpacity onPress={() => this.setState({modalComment: !this.state.modalComment})}>
                            <Icon name="comment" size={30} color='#fff'/>
                        </TouchableOpacity>
        )
    }

    render() {
        const timeAgo = new TimeAgo('fr');

        if(this.state.isLoaded) {
            return (
                <View style={{height: '100%', backgroundColor: '#141414'}}>
                <View style={{position: 'absolute', top: '50%', right: 0, zIndex: 9}}>
                    <View style={{backgroundColor: 'rgba(0,0,0,1)', padding: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10}}>
                        <TouchableOpacity onPress={() => this.like()} style={{}}>
                        <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        style={{height: 30, width: 30, transform: [{scale: 1.2}]}}
                        loop={false}
                        source={require('../../../assets/animations/heart2.json')}
                        />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
                    {this.state.news.map((item, index) => {
                        return (
                            <View key={item.id}>
                                <ImageBackground style={{height: Dimensions.get('window').height / 1.7, width: Dimensions.get('window').width}} source={{uri: item.image}}>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, 0)', height: Dimensions.get('window').height / 1.7, width: Dimensions.get('window').width}}>
                                        <View style={{flexDirection: 'row', alignItems:'flex-start', marginTop: Platform.OS === 'ios' ? 50 : 25, marginLeft: 30}}>
                                            <TouchableOpacity onPress={() => this.goBack()}>
                                                <View style={{backgroundColor: 'rgba(0,0,0,0.6)', height: 30, width: 30, borderRadius: 30 / 2, flexDirection: 'row',
                                                    alignItems: 'center', justifyContent: 'center'}}><Icon name="ios-arrow-back" size={20} type="ionicon" color="#fff" /></View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ImageBackground>
                                <View style={{marginTop: -30, paddingLeft: 20, paddingRight: 15, paddingTop: 15, marginBottom: 20, backgroundColor: '#141414', height: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                                    <View style={{marginBottom: 5}}><Text style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>{item.title}</Text>
                                    </View>
                                    <View style={{flexWrap: 'wrap'}}>
                                        <Text style={{
                                            borderRadius: 10,
                                            overflow: 'hidden',
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            paddingTop: 6,
                                            paddingBottom: 6,
                                            color: '#fff',
                                            fontSize: 12,
                                            backgroundColor: 'rgba(255,255,255,0.14)'}}>Publié {timeAgo.format(this.DateConvert(item.created_at))}</Text>
                                    </View>
                                    <View style={{marginTop: 25}}>
                                        <HTML baseFontStyle={{color: '#fff'}} html={item.content} imagesInitialDimensions={{width: undefined, height: undefined}} imagesMaxWidth={Dimensions.get('window').width - 40} />
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                
                </ScrollView>
                {this.state.modalComment &&
                <View style={{flex: 1, backgroundColor: '#1f1f1f', position: 'absolute', borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden',bottom: 0, left: 0, right: 0, height: Dimensions.get('window').height / 1.3, zIndex: 999}}>
                    <View style={{backgroundColor: '#1f1f1f', flex:1}}>
                        <View style={{marginTop: 15, flex: 1}}>
                            <View style={{ flexDirection: 'row',justifyContent: 'space-between', marginLeft: 20, marginRight: 20}}>
                                <View>
                                    <Text style={{color: '#fff'}}>Commentaires</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.setState({modalComment: !this.state.modalComment})}>
                                    <View style={{}}>
                                        <Icon name={'close'} size={20} color={'#fff'}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <NewsCommentComponent idNew={5}/>
                        </View>
                    </View>
                </View>
                }
                 
            </View>
            );
        } else {
            return(
                <View style={{position: 'absolute', top: Dimensions.get('window').height / 2, left: 0, right: 0, bottom: 0, height: '100%' }}>
                    <View style={{justifyContent: 'center'}}>
                        <ActivityIndicator color='#fff'/>
                    </View>
                </View>
            )
        }
    }
}

export default withNavigation(NewsDetailComponent);
