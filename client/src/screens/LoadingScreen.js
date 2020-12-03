import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Switch,
    Alert,
    Dimensions,
    Image,
    Button,
    Platform,
    Linking,
    StatusBar
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import LottieView from 'lottie-react-native';
import byteSize from "byte-size";

class LoadingScreen extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        this.animation.play();
    }

    render() {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#2a292a'}}>
                <StatusBar barStyle="light-content"/>
                <LottieView
                    ref={animation => {
                            this.animation = animation;
                        }}
                        style={{height: 90, width: 90, transform: [{scale: 1.2}]}}
                        loop={true}
                        source={require('../../assets/animations/27-loading.json')}
                        />
                        <Text style={{textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: 'bold'}}>{this.props.screenProps.status}</Text>
                        {this.props.screenProps.status == 'Téléchargement des packages' &&
                        <Text style={{textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 19}}>
                            {byteSize(this.props.screenProps.receivedBytes).value}{byteSize(this.props.screenProps.receivedBytes).unit} sur {byteSize(this.props.screenProps.totalBytes).value}{byteSize(this.props.screenProps.totalBytes).unit}
                        </Text>
                        }
            
            </View>
        );
    }
}

export default LoadingScreen;
