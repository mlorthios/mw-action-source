import React from 'react';
import { View, Text, StatusBar, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions} from 'react-native';
import convertSize from '../utils/convertSize';

const marginTopSize = new convertSize().MarginTopResponsive()

class TournamentRegisterComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: marginTopSize,
    },
    headerH1View: {
        marginLeft: 20,
        marginRight: 20
    },
    headerH1Text: {
        fontWeight: 'bold',
        fontSize: 34,
        marginBottom: 10
    },
    headerH2View: {
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20
    },
    headerH2Text: {
        fontWeight: '600',
        fontSize: 25,
        marginBottom: 10
    },
})

export default TournamentScreen;