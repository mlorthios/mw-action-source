import React from 'react';
import {View, Text, Dimensions, ScrollView, StatusBar, ImageBackground, TouchableOpacity, RefreshControl, FlatList, ActivityIndicator} from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from 'react-redux'
TimeAgo.addLocale(fr);

class HomeNewsMultiplayerComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoaded: false,
            news: [],
            refreshing: false,
        }
    }

    componentDidMount() {
        this.requestNews();
    }

    requestNews = () => {
        this.setState({isLoaded: false});
        fetch("https://api.mwactu.fr/v1/news/?category=1&limit=ok")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        refreshing: false,
                        news: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: false,
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

            //when t[3], t[4] and t[5] are missing they defaults to zero
            result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
        }

        return result;
    }

    refreshNews = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.requestNews()
        })
    };

    _renderItem (item) {
        const timeAgo = new TimeAgo('fr')
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('NewsDetail', {idNews: item.id})}>
                <View style={{shadowColor: "#000",
                    shadowOffset: { height: 2},
                    shadowOpacity: 0.5}}>
                    <ImageBackground style={{
                        borderRadius: 10,
                        height: 200,
                        width: Dimensions.get('window').width / 2,
                        marginLeft: 15,
                        overflow: 'scroll'

                    }} source={{uri: item.image}}>
                        <View style={{  backgroundColor: 'rgba(0, 0, 0, 0)', height: 200, width: Dimensions.get('window').width / 2,}}>
                            <View style={{position: 'absolute', bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: '100%', padding: 7}}>
                                <Text style={{color: '#fff', fontWeight: '500'}}>{item.title}</Text>
                            </View>
                            <View style={{position: 'absolute', top: 10,  right: 10, backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 5, borderRadius: 10}}>
                                <Text style={{fontWeight: '400', color: 'white', fontSize: 12}}>
                                    Publié {timeAgo.format(this.DateConvert(item.created_at))}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { themeMode } = this.props;

        return (
            <View style={{marginBottom: 15}}>
                <View style={{marginLeft: 15, marginBottom: 8, flexDirection: 'row'}}>
                    <Text style={{color: themeMode == 'dark' ? '#fff' : '#000', fontWeight: '600', fontSize: 22}}>
                        Actualités Multijoueur
                    </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('NewsAll', {idCategory: 1})} style={{paddingLeft: 10, paddingRight: 10, backgroundColor: 'rgba(88,88,88,0.48)', marginLeft: 10, borderRadius: 25 / 2, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: '#fff', fontWeight: '500'}}>Tout voir</Text>
                    </TouchableOpacity>
                </View>
                {this.state.isLoaded ? (
                    <View>
                        {this.state.news.length == 0 ? (
                            <View style={{marginLeft: 15, flexWrap: 'wrap'}}>
                                <View style={{shadowColor: themeMode == 'dark' ? '#202020' : '#c9c9c9',
                                    shadowOffset: { height: 0},
                                    shadowOpacity: 0.5}}>
                                    <Text style={{
                                        borderRadius: 10, 
                                        overflow: 'hidden', 
                                        color: '#000', 
                                        backgroundColor: themeMode == 'dark' ? '#3d3d3d' : '#fff', 
                                        paddingTop: 18, 
                                        paddingBottom: 18, 
                                        paddingLeft: 8, 
                                        paddingRight: 8
                                        }}>Aucune actualité à afficher dans cette catégorie</Text>
                                </View>
                            </View>
                        ) : (
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={this.state.news}
                                renderItem={({ item }) => this._renderItem(item)}
                                keyExtractor={item => item.id}
                                ListFooterComponent={<View style={{width:15}}></View>}
                            />
                        )}
                    </View>
                ) : (
                    <ActivityIndicator color={themeMode == 'dark' ? '#fff' : '#000'}/>
                )}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeMode: state.themeMode
    }
  }

export default withNavigation(HomeNewsMultiplayerComponent);
