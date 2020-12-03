import React from 'react';
import ContextChritmasComponent from '../../components/Context/Christmas';
import { View } from 'react-native';

class ContextScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <ContextChritmasComponent/>
            </View>
            
        )
    }

}

export default ContextScreen;