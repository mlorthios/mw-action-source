import React from 'react';
import { View, StyleSheet } from 'react-native';

import NewsListComponent from '../../components/News/ListComponent';

class NewsListScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <NewsListComponent/>
        )
    }

}

export default NewsListScreen;