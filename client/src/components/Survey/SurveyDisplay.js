import React from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ActivityIndicator, Platform,
    Alert
} from 'react-native';
import {Icon} from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
import HTML from 'react-native-render-html';
TimeAgo.addLocale(fr);
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import qs from "qs";

class SurveyDisplayComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoaded: false,
            survey: [],
            refreshing: false,
            survey_active: false
        }
    }

    componentDidMount() {
        this.requestSurvey();
    }

    closeSurvey() {
        this.setState({survey_active: false})
    }

    requestSurvey = () => {
        this.setState({isLoaded: false});
        fetch("https://api.mwactu.fr/v1/survey/list?device="+DeviceInfo.getUniqueId())
            .then(res => res.json())
            .then(
                (result) => {
                    if(result['status'] == 'voted') {
                        this.setState({
                            isLoaded: true,
                            refreshing: false,
                            survey: result,
                            survey_response: null,
                            survey_active: false
                        });
                    } else {
                        if(result != 'undefined') {
                            this.setState({
                                isLoaded: true,
                                refreshing: false,
                                survey: result,
                                survey_response: null,
                                survey_active: false
                            });
                        }

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

    surveyResponse(id, responseid) {

        fetch('https://api.mwactu.fr/v1/survey/response', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: "id="+id+"&deviceid="+DeviceInfo.getUniqueId()+"&responseid="+responseid,
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result['status'] === 'success') {
                        Alert.alert('Merci !', 'Votre réponse à notre sondage a bien été enregistré');
                        this.setState({survey_active: false})
                    } else {
                        Alert.alert('Oups !', result['response']);
                    }
                },
                (error) => {
                    this.setState({
                        isLoaded: false,
                        refreshing: false
                    });
                })
    }

    refreshNews = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.requestNews()
        })
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

    render() {
        const timeAgo = new TimeAgo('fr');
        return (
            <View>
                {this.state.survey_active ? (
                    <View>
                        {this.state.survey.map((item, index) => {
                            return (
                                <View style={{marginBottom: 15, backgroundColor: '#1a1a1a', paddingBottom: 12, paddingTop: 12}}>
                                    <View style={{marginLeft: 15, marginBottom: 3, flexDirection: 'row'}}>
                                        <Text style={{color: '#fff', fontWeight: '600', fontSize: 22}}>
                                            Sondage
                                        </Text>
                                    </View>
                                    <View style={{marginLeft: 15, marginBottom: 8, flexDirection: 'row'}}>
                                        <Text style={{color: '#fff', fontWeight: '400', fontSize: 13}}>
                                            Terminé {timeAgo.format(this.DateConvert(item.end))}
                                        </Text>
                                    </View>
                                    <View style={{shadowColor: "#000",
                                        shadowOffset: { height: 2},
                                        shadowOpacity: 0.5}}>
                                        <View style={{marginLeft: 15, marginRight: 15, backgroundColor: '#1a9bc5', padding: 6, borderRadius: 10}}>
                                            <Text style={{color: '#fff', fontWeight: '500', textAlign: 'center', fontSize: 16}}>
                                                {item.question}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{marginTop: 8, flexDirection: 'row'}}>
                                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={{marginLeft: 15, marginRight: 15}}>
                                            {this.state.survey_response.map((item2, index2) => {
                                                return(
                                                    <TouchableOpacity key={item2.id} onPress={() => this.surveyResponse(item.id, item2.id)} style={{flexWrap: 'wrap', marginRight: 7}}>
                                                        <Text style={{
                                                            color: '#fff',
                                                            fontWeight: '500',
                                                            fontSize: 15,
                                                            borderWidth: 2,
                                                            borderColor: '#23b7ff',
                                                            paddingTop: 5,
                                                            paddingBottom: 5,
                                                            paddingLeft: 8,
                                                            paddingRight: 8,
                                                            borderRadius: 10}}>{item2.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </ScrollView>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                ) : (
                    <View></View>
                )
                }
            </View>
        );
    }
}

export default withNavigation(SurveyDisplayComponent);
