import React from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
import RNFetchBlob from 'rn-fetch-blob';
import { FlatGrid } from 'react-native-super-grid';
TimeAgo.addLocale(fr);

class NewsAllComponent extends React.Component {

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
        const { navigation } = this.props;
        fetch("https://api.mwactu.fr/v1/news/?category=" + navigation.getParam('idCategory', '1'))
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
        const timeAgo = new TimeAgo('fr');
        return (
            <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.navigate('NewsDetail', {idNews: item.id})}>
                <View style={{shadowColor: "#000",
                    shadowOffset: { height: 2},
                    shadowOpacity: 0.5}}>
                    <ImageBackground style={{
                        borderRadius: 10,
                        overflow: 'scroll'

                    }} source={{uri: item.image}}>
                        <View style={{  backgroundColor: 'rgba(0, 0, 0, 0)', height: 250,}}>
                            <View style={{position: 'absolute', bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: '100%', padding: 7}}>
                                <Text style={{color: '#fff', fontWeight: '500'}}>{item.title}</Text>
                            </View>
                            <View style={{position: 'absolute', top: 10,  right: 10, backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 5, borderRadius: 10}}>
                                <Text style={{fontWeight: '400', color: 'white', fontSize: 12}}>
                                    {timeAgo.format(this.DateConvert(item.created_at))}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const timeAgo = new TimeAgo('fr');
        const { navigation, themeMode } = this.props;
        return (
            <View style={{marginTop: 10}}>
                <View>
                    <View style={{marginBottom: 10}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <View style={{backgroundColor: 'rgba(126,126,126,0.6)', height: 30, width: 30, borderTopRightRadius: 30 / 2, borderBottomRightRadius: 30/2, flexDirection: 'row',
                                alignItems: 'center', justifyContent: 'center'}}><Icon name="ios-close" size={30} type="ionicon" color="#fff" /></View>
                        </TouchableOpacity>
                    </View>
                    <View style={{backgroundColor: '#444444', padding: 7}}>
                        <Text style={{color: '#fff', fontWeight: '600'}}>
                            Actualités

                            {navigation.getParam('idCategory', '1') === 1 &&
                            <Text> Multijoueur</Text>
                            }

                            {navigation.getParam('idCategory', '2') === 2 &&
                            <Text> Coop</Text>
                            }

                            {navigation.getParam('idCategory', '3') === 3 &&
                            <Text> Campagne</Text>
                            }
                        </Text>
                    </View>
                </View>
                {this.state.isLoaded ? (
                    <View>
                        {this.state.news == 0 ? (
                            <View style={{marginTop: 10, margin: 15, backgroundColor: '#3d3d3d', padding: 12, borderRadius: 10}}><Text style={{color: '#fff', textAlign: 'center'}}>Cette catégorie est vide.</Text></View>
                        ) : (
                            <FlatGrid
                                itemDimension={130}
                                items={this.state.news}
                                renderItem={({ item }) => this._renderItem(item)}
                                ListFooterComponent={<View style={{marginBottom: 230}}></View>}
                                scrollEnabled={true}
                            />



                        )}
                    </View>
                ) : (
                    <ActivityIndicator style={{marginTop: 20}} color={themeMode == 'dark' ? '#fff' : '#000'}/>
                )}
            </View>
        );
    }
}

export default withNavigation(NewsAllComponent);
