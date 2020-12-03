import React from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    StatusBar,
    ImageBackground,
    RefreshControl,
    FlatList,
    TouchableOpacity,
    Platform,
    Button,
    StyleSheet
} from 'react-native';
import { withNavigation } from 'react-navigation';

import GlobalProfileComponent from '../components/Global/Profile';

import HomeNewsMultiplayerComponent from '../components/Home/NewsMultiplayer';
import HomeNewsCoopComponent from '../components/Home/NewsCoop';
import DeviceInfo from 'react-native-device-info';
import NavigationService from '../navigation/NavigationService';
import SurveyDisplay from '../components/Survey/SurveyDisplay';
import Rate, { AndroidMarket } from 'react-native-rate'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux'

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

let update_msg = false;
class HomeScreen extends React.Component {
    static navigationOptions = {

    }

    constructor() {
        super();
        this.state = {
            refreshing: false,
            rated: false,
            update: false
        }
    }

    componentDidMount() {
        this.getData();
        
    }

    storeData = async (data) => {
        try {
          await AsyncStorage.setItem('update_rev4', 'open')
        } catch (e) {
            
        }
    }

    getData = async () => {
        try {
          const value = await AsyncStorage.getItem('update_rev4')
          if(value !== null) {
            if(value == 'open') {
                this.setState({update: false})
            }
          } else {
            this.setState({update: true})
            this.storeData();
          }
        } catch(e) {
            
        }
      }

    _msg() {
        return (
            <View style={{marginBottom: 15, marginLeft: 10, marginRight: 10}}>
                        <View style={{shadowColor: "#000",
                                    shadowOffset: { height: 0},
                                    shadowOpacity: 0.5, borderRadius: 10, overflow: 'hidden'}}>
                            <View style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 12}}>
                                <Text style={{color: '#fff', fontSize: 15, fontWeight: '500'}}>Rev65</Text>
                            </View>
                        </View>
                    </View>
        )
    }

    render() {

        const { themeMode } = this.props;

        const styles = StyleSheet.create({
            container: {
                height: '100%',
                backgroundColor: themeMode == 'dark' ? '#2a292a' : '#f0f0f0'
            }
        });

        return (
            <View style={styles.container}>
                {themeMode == 'dark' ? (
                    <StatusBar barStyle="light-content"/>
                ) : (
                    <StatusBar barStyle="dark-content"/>
                )}
                
                <ScrollView contentContainerStyle={{paddingTop: Platform.OS === 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? 46 : 30 : 25, paddingBottom: 5}} showsVerticalScrollIndicator={false}>
                    <GlobalProfileComponent themeMode={themeMode}/>
                    {this.state.update == true &&
                    <View style={{marginBottom: 15, paddingBottom: 0, paddingTop: 12}}>
                        <View style={{marginLeft: 15, marginBottom: 3, marginRight: 15}}>
                            <Text style={{color: '#fff', fontWeight: '600', fontSize: 22}}>
                                Mise à jour
                            </Text>
                            <View style={{marginTop: 12}}>
                                <Text style={{color: '#fff'}}>Une mise à jour a été déployé pour corriger le problème d'ouverture des articles depuis les notifications qui est survenu dans la dernière mise à jour, si vous voyez ce message c'est que vous êtes à jour.</Text>
                                <Text style={{color: '#fff', marginTop: 4}}>Suite au sondage, nous avons ajouté nos réseaux sociaux Instagram et Snapchat, le sondage étant tellement serré qu'on a ajouté les deux, comme ça tout le monde est content. Des concours sont à prévoir, alors suivez-nous 😜</Text>
                        
                            </View>
                        </View>
                    </View>
                    }
                    <SurveyDisplay/>
                    <HomeNewsMultiplayerComponent themeMode={themeMode}/>
                    <HomeNewsCoopComponent themeMode={themeMode}/>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeMode: state.themeMode
    }
  }

export default connect(mapStateToProps)(withNavigation(HomeScreen));
