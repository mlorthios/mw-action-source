import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, Image, ActivityIndicator, FlatList, SafeAreaView, Switch } from 'react-native';
import { withNavigation } from 'react-navigation';
import SkeletonLoader from "react-native-skeleton-loader";

import TimeAgo from 'javascript-time-ago';
import fr from 'javascript-time-ago/locale/fr';
TimeAgo.addLocale(fr);

import DeviceInfo from 'react-native-device-info';
import utilSubCategory from '../../utils/color';
import CachedImage from 'react-native-image-cache-wrapper';
import { API_KEY_HTTP } from 'react-native-dotenv';

class CGUComponent extends React.Component {

    constructor() {
        super();

        this.state = {
            isLoaded: false
        };
    }

    render() {
        return (
            <View>
                <Text>lol</Text>
            </View>
                
        )
    }

}

export default withNavigation(CGUComponent);