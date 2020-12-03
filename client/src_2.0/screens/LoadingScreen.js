import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

class LoadingScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.animation.play()
    }

    render() {
        return(
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#2a292a'}}>
                <LottieView
                    ref={animation => {
                            this.animation = animation;
                        }}
                        style={{height: 90, width: 90, transform: [{scale: 1.2}]}}
                        loop={true}
                        source={require('../../assets/animations/27-loading.json')}
                        />
            
            </View>
        )
    }
}

export default LoadingScreen;