import React from 'react';
import { View, StyleSheet } from 'react-native';

import NewsDetailComponent from '../../components/News/DetailComponent';

class NewsDetailScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <NewsDetailComponent/>
            </View>
        )
    }

}

export default NewsDetailScreen;