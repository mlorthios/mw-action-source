import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, StatusBar, Platform, Alert, Animated, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { withNavigation, ScrollView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import RNFetchBlob from 'rn-fetch-blob'
import DeviceInfo from 'react-native-device-info';
import CachedImage from 'react-native-image-cache-wrapper';
import utilSubCategory from '../../utils/color';
import utilResize from '../../utils/resize';
import HTML from 'react-native-render-html';
import LottieView from 'lottie-react-native';
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
import { API_KEY_HTTP } from 'react-native-dotenv'
import { connect } from 'react-redux';
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob'


TimeAgo.addLocale(fr);

import GlobalNotConnectedComponent from '../Global/NotConnected';

class NewsDetailComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            news: [],
            isLoaded: false,
            liked: false,
            ad_error: false,
            ad_loaded: false,
            NotConnected: {
                bounceValue: new Animated.Value(Dimensions.get('window').height)
            },
            gestureName: '',
            myText: '',
        }

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                this.state.NotConnected.bounceValue.setValue(Math.max(0, 0 + gestureState.dy)); //step 1
            },
            onPanResponderGrant: (e, gestureState) => {
                this._closeNotConnected();
            },
            onPanResponderRelease: (e, gesture) => {
                const shouldOpen = gesture.vy <= 0;
                Animated.spring(this.state.NotConnected.bounceValue, {
                    toValue: shouldOpen ? 0 : Dimensions.get('window').height,
                    velocity: gesture.vy,
                    tension: 2,
                    friction: 8,
                }).start();
            },
        });
    }

    componentDidMount() {
        console.log(this.props)
        AdMobRewarded.setTestDevices([AdMobRewarded.simulatorId]);
        AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917');

        AdMobRewarded.addEventListener('rewarded', reward =>
            console.log('AdMobRewarded => rewarded', reward),
        );
        AdMobRewarded.addEventListener('adLoaded', () =>
            console.log('AdMobRewarded => adLoaded'),
        );
        AdMobRewarded.addEventListener('adFailedToLoad', error =>
            console.warn(error),
        );
        AdMobRewarded.addEventListener('adOpened', () =>
            console.log('AdMobRewarded => adOpened'),
        );
        AdMobRewarded.addEventListener('videoStarted', () =>
            console.log('AdMobRewarded => videoStarted'),
        );
        AdMobRewarded.addEventListener('adClosed', () => {
            console.log('AdMobRewarded => adClosed');
            AdMobRewarded.requestAd().catch(error => console.warn(error));
        });
        AdMobRewarded.addEventListener('adLeftApplication', () =>
            console.log('AdMobRewarded => adLeftApplication'),
        );

        AdMobRewarded.requestAd().catch(error => console.warn(error));
    }

    UNSAFE_componentWillMount() {
        const { navigation } = this.props;
        const load_interne = navigation.getParam('load_interne', false);
        if (load_interne == true) {
            this.setState({
                isLoaded: true,
                news: {
                    title: navigation.getParam('title', ''),
                    content: navigation.getParam('content', ''),
                    image: navigation.getParam('image', ''),
                    created_at: navigation.getParam('created_at', ''),
                    subcategory: [
                        {
                            display_name: navigation.getParam('category', ''),
                            name: navigation.getParam('category_name', ''),
                            color: navigation.getParam('color', 'rgba(0, 0, 0, 0.2)')
                        }
                    ]
                }
            })
        } else {
            this.requestNews();
        }

        AdMobRewarded.removeAllListeners();
        AdMobInterstitial.removeAllListeners();
    }

    requestNews = () => {
        const { navigation } = this.props;
        fetch("https://api.mwaction.app/v1/news/fetchall?app_name=" + DeviceInfo.getBundleId() + "&id=" + navigation.getParam('idNew', '1'), {
            headers: new Headers({
                "x-api-key": API_KEY_HTTP
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result != 0) {
                        console.log(result.response[0])
                        this.setState({
                            isLoaded: true,
                            news: result.response[0]
                        });
                    } else {
                        this.props.navigation.navigate('Home');
                    }
                },
                (error) => {
                    this.setState({
                        isLoaded: true
                    });
                }
            )
    };

    like() {
        const { navigation } = this.props;
        const id = navigation.getParam('idNew', '1');
        if (this.props.loggedIn.token) {
            this.animation.play();

            fetch("http://localhost:4001/v1/news/like?app_name=" + DeviceInfo.getBundleId(), {
                method: 'POST',
                headers: new Headers({
                    Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    "Authorization": this.props.loggedIn.token,
                    "x-api-key": API_KEY_HTTP
                }),
                body: "id="+id+"&uniq="+DeviceInfo.getUniqueId(),
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        Alert.alert(JSON.stringify(result))
                        if (result != 0) {
                            this.setState({ liked: true })
                        }
                    },
                    (error) => {
                        this.setState({
                            liked: false
                        });
                    }
                )
        } else {
            var toValue = 0;

            Animated.spring(
                this.state.NotConnected.bounceValue,
                {
                    toValue: toValue,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                }
            ).start();
        }
    }

    _closeNotConnected() {
        var toValue = Dimensions.get('window').height;

        Animated.spring(
            this.state.NotConnected.bounceValue,
            {
                toValue: toValue,
                velocity: 3,
                tension: 2,
                friction: 8,
            }
        ).start();
    }

    dislike() {
        this.animation.reset();
    }

    render() {
        const { navigation } = this.props;
        const { news } = this.state;
        const timeAgo = new TimeAgo('fr')
        const newdate = new Date(news.created_at);

        if (this.state.isLoaded) {
            return (
                <View>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: '100%', backgroundColor: navigation.getParam('color') }}>
                        <View style={{ paddingTop: utilResize, backgroundColor: navigation.getParam('color'), paddingBottom: 30 }}>
                            <View style={{ justifyContent: 'space-between', marginBottom: 15, flexDirection: 'row', alignItems: 'center', marginLeft: 45 - 10, marginRight: 45 }}>
                                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10, width: 50 }} onPress={() => this.props.navigation.goBack()}>
                                    <Icon name="ios-arrow-back" size={30} type="ionicon" color="#fff" />
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -10 }}>
                                    <FontAwesome5 name={utilSubCategory(news.subcategory[0].name).iconName} size={22} color="#fff" style={{ marginRight: 7 }} />
                                    <Text style={{ fontSize: 23, fontWeight: '500', color: '#fff' }}>{news.subcategory[0].display_name}</Text>
                                </View>
                                <View style={{ width: 50 }}></View>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <CachedImage style={{ height: Dimensions.get('screen').height / 1.6, width: Dimensions.get('window').width - 45 * 2, borderRadius: 10, overflow: 'hidden' }} source={{ uri: news.image }}>
                                    <View style={{ padding: 10, flexWrap: 'wrap' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8, borderRadius: 10, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                                            <Icon name="favorite" size={20} color="#fff" />
                                            <Text style={{ marginLeft: 3, color: '#fff', fontSize: 15, fontWeight: '600' }}>78</Text>
                                        </View>
                                    </View>
                                </CachedImage>
                            </View>
                        </View>
                        <View style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: '#f0f0f0', height: '100%', paddingLeft: 20, paddingTop: 10, paddingRight: 20, marginTop: -15 }}>
                            <View>
                                <Text style={{ fontSize: 19, fontWeight: '600', marginBottom: 5 }}>{news.title}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        borderRadius: 10,
                                        marginRight: 4,
                                        color: '#fff',
                                        overflow: 'hidden'
                                    }}
                                    >
                                        Publié {timeAgo.format(newdate)}
                                    </Text>
                                    <Text style={{
                                        backgroundColor: navigation.getParam('color'),
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        borderRadius: 10,
                                        color: '#fff',
                                        overflow: 'hidden'
                                    }}
                                    >
                                        {news.subcategory[0].display_name}
                                    </Text>
                                </View>
                                <HTML baseFontStyle={{ color: '#000' }} html={news.content} imagesInitialDimensions={{ width: undefined, height: undefined }} imagesMaxWidth={Dimensions.get('window').width - 40} />
                                <View>
                                    {this.state.ad_error ? (
                                        <View></View>
                                    ) : (

                                            <View style={{ width: '100%', marginBottom: 30, justifyContent: 'center', flexDirection: 'row' }}>
                                                <AdMobBanner
                                                    adSize="smartBanner"
                                                    adUnitID="ca-app-pub-4228580536802932/3266965391"
                                                    testDevices={[AdMobBanner.simulatorId]}
                                                    onAdFailedToLoad={error => this.setState({ ad_error: true })}
                                                />
                                            </View>
                                        )}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <StatusBar barStyle="light-content" />
                    <View style={{ position: 'absolute', top: '50%', right: 0, zIndex: 9 }}>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                            <TouchableOpacity onPress={() => this.like()} style={{}}>
                                <LottieView
                                    ref={animation => {
                                        this.animation = animation;
                                    }}
                                    style={{ height: 30, width: 30, transform: [{ scale: 1.2 }] }}
                                    loop={false}
                                    source={require('../../../assets/animations/heart2.json')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginTop: 4 }} onPress={() => this.setState({ modalComment: !this.state.modalComment })}>
                                <Icon name="comment" size={30} color='#fff' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress={() => this._closeNotConnected()}>
                        <Animated.View style={{ flex: 1, position: 'absolute', height: '100%', width: '100%', bottom: 0, zIndex: 999, transform: [{ translateY: this.state.NotConnected.bounceValue }] }}>

                        </Animated.View>
                    </TouchableWithoutFeedback>
                    <Animated.View {...this.panResponder.panHandlers} accessible={false} style={{ position: 'absolute', height: '40%', width: '100%', bottom: 0, zIndex: 999, backgroundColor: '#303030', borderTopLeftRadius: 20, borderTopRightRadius: 20, transform: [{ translateY: this.state.NotConnected.bounceValue }] }}>
                        <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, marginBottom: 5 }}>
                            <TouchableOpacity onPress={() => this._closeNotConnected()} style={{ marginTop: 25 }}>
                                <Icon name="close" color={'#f2f2f2'} />
                            </TouchableOpacity>
                        </View>
                        <GlobalNotConnectedComponent />
                    </Animated.View>
                </View>
            )
        } else {
            return (
                <View>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: '100%', backgroundColor: navigation.getParam('color', 'rgba(0, 0, 0, 0.2)') }}>
                        <StatusBar barStyle="light-content" />
                        <View style={{ paddingTop: utilResize, backgroundColor: navigation.getParam('color', 'rgba(0, 0, 0, 0.2)'), paddingBottom: 30 }}>
                            <View style={{ justifyContent: 'space-between', marginBottom: 15, flexDirection: 'row', alignItems: 'center', marginLeft: 45 - 10, marginRight: 45 }}>
                                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10 }} onPress={() => this.props.navigation.goBack()}>
                                    <Icon name="ios-arrow-back" size={30} type="ionicon" color="#fff" />
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -10 }}>

                                    <Text style={{ fontSize: 23, fontWeight: '500', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 10, overflow: 'hidden', color: '#fff', height: 25, width: Dimensions.get('window').width / 3 }}></Text>
                                </View>
                                <View></View>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <CachedImage style={{ height: Dimensions.get('screen').height / 1.6, width: Dimensions.get('window').width - 45 * 2, borderRadius: 10, overflow: 'hidden' }} source={require('../../../assets/load_background.png')}>

                                </CachedImage>
                            </View>
                        </View>
                        <View style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: '#f0f0f0', height: '100%', paddingLeft: 20, paddingTop: 10, paddingRight: 20, marginTop: -15 }}>
                            <View>
                                <Text style={{ fontSize: 19, fontWeight: '600', marginBottom: 5, height: 22, borderRadius: 10, overflow: 'hidden', width: Dimensions.get('screen').width / 2, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        width: 120,
                                        borderRadius: 10,
                                        marginRight: 4,
                                        color: '#fff',
                                        overflow: 'hidden'
                                    }}
                                    >

                                    </Text>
                                    <Text style={{
                                        backgroundColor: navigation.getParam('color', 'rgba(0, 0, 0, 0.2)'),
                                        paddingTop: 5,
                                        width: 70,
                                        paddingBottom: 5,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        borderRadius: 10,
                                        color: '#fff',
                                        overflow: 'hidden'
                                    }}
                                    >

                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                </View>
            )
        }
    }

}

const mapStateToProps = (state) => {
    return {
        loggedIn: {
            token: state.authReducer.loggedToken,
        }
    };
};

export default connect(mapStateToProps)(withNavigation(NewsDetailComponent));