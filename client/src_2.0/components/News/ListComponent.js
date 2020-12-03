import React from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Image, SafeAreaView, ActivityIndicator, Alert} from 'react-native';
import { withNavigation } from 'react-navigation';

import convertSize from '../../utils/convertSize';

import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';

import utilSubCategory from '../../utils/color';
import FastImage from 'react-native-fast-image'
import { API_KEY_HTTP } from 'react-native-dotenv'

import byteSize from "byte-size";

import AnimatedEllipsis from 'react-native-animated-ellipsis';

import { Icon } from 'react-native-elements';

import { FlatGrid } from 'react-native-super-grid';

import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
TimeAgo.addLocale(fr);

const marginTopSize = new convertSize().MarginTopResponsive()

class NewsListComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            loading: true,
            news: []
        }
    }

    componentDidMount() {
        this.requestNews();
    }

    requestNews = () => {

        const { navigation } = this.props;

        if(this.state.isLoaded == false)  {
            this.setState({isLoaded: false});
            fetch(`http://localhost:4001/v1/news/fetchall?app_name=${DeviceInfo.getBundleId()}&limit=&category=` + navigation.getParam('category', 'multijoueur'), {
                headers: new Headers({
                    "x-api-key": API_KEY_HTTP
                  }),
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.statusCode == '200') {
                        this.setState({
                            isLoaded: true,
                            news: result.response
                        });
                    } else {
                        this.setState({
                            isLoaded: true,
                            news: []
                        });
                    }
                },
                (error) => {
                    this.setState({
                        isLoaded: false
                    });
                }
            )
        }
    };

    handleChangeNew(value) {
        this.setState({newActive: value})
    }

    _renderItem (item) {
        const timeAgo = new TimeAgo('fr');
        const colorGe = utilSubCategory(item.subcategory[0].name).color;
        return (
            <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.navigate('NewsDetail', {
                idNew: item._id, 
                color: colorGe,
                title: item.title,
                content: item.content,
                created_at: item.created_at,
                category: item.subcategory[0].display_name,
                category_name: item.subcategory[0].name,
                image: item.image,
                load_interne: true
                })}>
                <View style={{shadowColor: "#000",
                    shadowOffset: { height: 2},
                    shadowOpacity: 0.5}}>
                    <FastImage style={{
                        borderRadius: 10,
                        overflow: 'scroll'

                    }} source={{uri: item.image}}>
                        <View style={{  backgroundColor: 'rgba(0, 0, 0, 0)', height: 220,}}>
                            <View style={{position: 'absolute', bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: '100%', padding: 7}}>
                                <Text style={{color: '#fff', fontWeight: '500'}}>{item.title}</Text>
                            </View>
                            <View style={{position: 'absolute', left: 10, top: 10,  right: 10}}>
                                <View style={{flexWrap: 'wrap', position: 'absolute', right: 0, paddingRight: 7, paddingLeft: 7, backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 5, borderRadius: 10, marginBottom: 3}}>
                                    <Text style={{fontWeight: '400', color: 'white', fontSize: 12}}>
                                        {timeAgo.format(new Date(item.created_at))}
                                    </Text>
                                </View>
                                <View style={{flexWrap: 'wrap', marginTop: 27, position: 'absolute', right: 0,backgroundColor: colorGe, paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10}}>
                                    <Text style={{fontWeight: '400', color: 'white', fontSize: 12, textAlign: 'center'}}>
                                        {item.subcategory[0].display_name}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </FastImage>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const fullHeight = Dimensions.get('window').height;
        const { navigation } = this.props;
        const name_page = navigation.getParam('category', 'multijoueur') == 'coop' ? 'Coop' : 'Multijoueur'
        return (
            <View>
                <View style={{backgroundColor: '#383838', paddingBottom: 30}}>
                    <SafeAreaView style={{marginTop: DeviceInfo.hasNotch() ? 0 : 30}}>
                        <View style={{marginLeft: 20, marginRight: 20, marginBottom: 0}}>
                            <View style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{marginRight: 10}}>
                                    <View style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingRight: 13, paddingLeft: 10, borderRadius: 20/2}}>
                                        <Icon color="#fff" name="ios-arrow-back" type="ionicon"/>
                                    </View>
                                </TouchableOpacity>
                                <Text style={{fontSize: 25, fontWeight: 'bold', color: '#fff'}}>Actualités {name_page}</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
                <View style={{backgroundColor: '#f0f0f0', marginTop: -15, borderRadius: 20}}>
                    {this.state.isLoaded == true ? (
                        <View style={{marginLeft: 20, marginRight: 20}}>
                        {this.state.news == 0 ? (
                            <View style={{marginTop: 10, margin: 15, backgroundColor: '#3d3d3d', padding: 12, borderRadius: 10}}><Text style={{color: '#fff', textAlign: 'center'}}>Cette catégorie est vide.</Text></View>
                        ) : (
                            <FlatGrid
                                contentContainerStyle={{paddingTop: 10}}
                                itemDimension={130}
                                showsVerticalScrollIndicator={false}
                                items={this.state.news}
                                renderItem={({ item }) => this._renderItem(item)}
                                ListFooterComponent={<View style={{marginBottom: 230}}></View>}
                                scrollEnabled={true}
                            />
                        )}
                    </View>
                    ) : (
                        <View style={{marginTop: 20}}>
                            <ActivityIndicator color="#000"/>
                        </View>
                    )}
                </View>
            </View>
          
        );
    }

}

const styles = StyleSheet.create({
    container: {
        paddingTop: marginTopSize
    },
    headerH1View: {
        marginLeft: 20,
        marginRight: 20
    },
    headerH1Text: {
        fontWeight: 'bold',
        fontSize: 34,
        marginBottom: 10
    },
    headerH2View: {
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20
    },
    headerH2Text: {
        fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : null,
        fontWeight: Platform.OS === 'android' ? '500' : '500',
        fontSize: 25,
        marginBottom: 10
    },
    ongletActiveView: {
        backgroundColor: '#fff', 
        marginRight: 5, 
        paddingTop: 6, 
        paddingBottom: 6, 
        paddingLeft: 7, 
        paddingRight: 7, 
        borderRadius: 10
    },
    ongletNotActiveView: {
        marginRight: 5, 
        paddingTop: 6, 
        paddingBottom: 6, 
        paddingLeft: 7, 
        paddingRight: 7, 
        borderRadius: 10
    },
    ongletActiveText: {
        fontSize: 16, 
        fontWeight: '500'
    },
    ongletNotActiveText: {
        fontSize: 16, 
        fontWeight: '500',
        color: '#404040'
    },
    cardBoxShadow: {
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 0,
        },
        shadowOpacity: 0.53,
        shadowRadius: 3.62,
         elevation: 4,
    },
    cardBoxShadowLight: {
        shadowColor: "#FFF",
        shadowOffset: {
	        width: 0,
	        height: 0,
        },
        shadowOpacity: 0.53,
        shadowRadius: 3.62,
         elevation: 4,
    },
    cardBoxImageBackground: {
        height: 230, 
        width: Dimensions.get('window').width / 1.5,
        borderRadius: 10,
        overflow: 'hidden'
    }
})

const mapStateToProps = (state) => {
    return {
      loggedIn: {
        isLogged: state.authReducer.loggedIn,
        pseudonyme: state.authReducer.loggedPseudonyme,
        avatar: state.authReducer.loggedAvatar
      }
    };
  };

export default connect(mapStateToProps)(withNavigation(NewsListComponent));