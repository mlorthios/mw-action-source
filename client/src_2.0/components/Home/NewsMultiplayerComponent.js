import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, Image, ActivityIndicator, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import SkeletonLoader from "react-native-skeleton-loader";

import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
TimeAgo.addLocale(fr);

import DeviceInfo from 'react-native-device-info';
import utilSubCategory from '../../utils/color';
import CachedImage from 'react-native-image-cache-wrapper';
import FastImage from 'react-native-fast-image'
import { API_KEY_HTTP} from 'react-native-dotenv'

class HomeNewsMultiplayerComponent extends React.Component {

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
        if(this.state.isLoaded == false)  {
            this.setState({isLoaded: false});
            fetch(`https://api.mwaction.app/v1/news/fetchall?app_name=${DeviceInfo.getBundleId()}&limit=4&category=multijoueur`, {
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

    DateConvert(mysql_string) {
        var t, result = null;

        if( typeof mysql_string === 'string' )
        {
            t = mysql_string.split(/[- :]/);

            result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
        }

        return result;
    }

    _renderItem (item, index) {
        const timeAgo = new TimeAgo('fr')
        const newdate = new Date(item.created_at);
        return (
            <TouchableOpacity style={{marginRight: 15}} onPress={() => this.props.navigation.navigate('NewsDetail', {
                idNew: item._id, 
                color: utilSubCategory(item.subcategory[0].name).color,
                title: item.title,
                content: item.content,
                created_at: item.created_at,
                category: item.subcategory[0].display_name,
                category_name: item.subcategory[0].name,
                image: item.image,
                load_interne: true
                })}>
                <View style={styles.cardBoxShadow}>
                    <FastImage style={styles.cardBoxImageBackground} source={{uri: item.image}}>
                        <View style={{  backgroundColor: 'rgba(0, 0, 0, 0.5)', height: 200, width: Dimensions.get('window').width / 1.5,}}>
                            <View style={{position: 'absolute', bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: '100%', padding: 7}}>
                                <Text style={{color: '#fff', fontWeight: '500'}}>{item.title}</Text>
                            </View>
                            <View style={{position: 'absolute', top: 10,  right: 10, flexDirection: 'row'}}>
                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 5,marginBottom: 5, borderRadius: 10, marginRight: 5}}>
                                    <Text style={{fontWeight: '400', color: 'white', fontSize: 12}}>
                                    Publié {timeAgo.format(newdate)}
                                    </Text>
                                </View>
                                <View style={{}}>
                                    <View style={{backgroundColor: utilSubCategory(item.subcategory[0].name).color, paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10}}>
                                        <Text style={{fontWeight: '400', color: 'white', fontSize: 12}}>
                                            {item.subcategory[0].display_name}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </FastImage>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { loading } = this.state;
        return(            
            <View>
                {this.state.isLoaded ? (
                    <View>
                        {this.state.news.length == 0 ? (
                            <View style={{marginLeft: 15, flexWrap: 'wrap'}}>
                                <View style={{shadowColor: 'rgba(215, 215, 215, 1)',
                                    shadowOffset: { height: 0},
                                    shadowOpacity: 0.5}}>
                                    <Text style={{
                                        borderRadius: 10, 
                                        overflow: 'hidden', 
                                        color: '#000', 
                                        backgroundColor: '#fff', 
                                        paddingTop: 18, 
                                        paddingBottom: 18, 
                                        paddingLeft: 8, 
                                        paddingRight: 8
                                        }}>Aucune actualité à afficher dans cette catégorie</Text>
                                </View>
                            </View>
                        ) : (
                            <FlatList
                                contentContainerStyle={{marginLeft: 20}}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={this.state.news}
                                renderItem={({ item, index }) => this._renderItem(item, index)}
                                keyExtractor={item => item._id}
                                ListFooterComponent={<View style={{width:25}}></View>}
                                ListHeaderComponent={<TouchableOpacity onPress={() => this.props.navigation.navigate('NewsList', {category: 'multijoueur'})} style={{marginRight: 15}}>
                                                        <View>
                                                            <View style={{justifyContent: 'center', height: 200, borderRadius: 10, flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 15}}>
                                                                <Text style={{color: '#FFF', fontWeight: '600'}}>Tout voir</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>}
                                />
                        )}
                    </View>
                ) : (
                    <ActivityIndicator color={'#000'}/>
                )}
            </View>
                
        )
    }

}

const styles = StyleSheet.create({
    cardBoxShadow: {
        
    },
    cardBoxImageBackground: {
        height: 200, 
        width: Dimensions.get('window').width / 1.5,
        borderRadius: 10,
        overflow: 'hidden'
    }
})

export default withNavigation(HomeNewsMultiplayerComponent);