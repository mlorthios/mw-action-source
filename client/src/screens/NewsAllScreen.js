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
    Platform
} from 'react-native';
import { withNavigation } from 'react-navigation';

import NewsAllComponent from '../components/News/NewsAll';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux'

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

class NewsAllScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            refreshing: false
        }
    }

    render() {
        const { themeMode } = this.props;

        return (
            <View style={{height: '100%', backgroundColor: themeMode == 'dark' ? '#2a292a' : '#f0f0f0'}}>
                {themeMode == 'dark' ? (
                    <StatusBar barStyle="light-content"/>
                ) : (
                    <StatusBar barStyle="dark-content"/>
                )}
                <View style={{marginTop: Platform.OS === 'ios' ? modelIphone.includes(DeviceInfo.getDeviceId()) ? 46 : 25 : 10, marginBottom: 5}}>
                    <NewsAllComponent themeMode={themeMode}/>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeMode: state.themeMode
    }
  }

export default connect(mapStateToProps)(withNavigation(NewsAllScreen));
