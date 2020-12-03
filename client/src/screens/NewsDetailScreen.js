import React from 'react';
import {View, Text, Dimensions, ScrollView, StatusBar, ImageBackground, TouchableOpacity, Image} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux'

import NewsDetailComponent from '../components/News/NewsDetail';

class NewsDetailScreen extends React.Component {

    constructor() {
        super();
    }

    render() {
        const { themeMode } = this.props;
        return (
            <View style={{backgroundColor: themeMode == 'dark' ? '#2a292a' : '#f0f0f0'}}>
                <NewsDetailComponent themeMode={themeMode}/>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeMode: state.themeMode
    }
  }

export default connect(mapStateToProps)(withNavigation(NewsDetailScreen));
