import React from 'react';
import SettingsHomeComponent from '../../components/Settings/HomeComponent'
import { View } from 'react-native';

class SettingsHomeScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <SettingsHomeComponent/>
            </View>
            
        )
    }

}

export default SettingsHomeScreen;