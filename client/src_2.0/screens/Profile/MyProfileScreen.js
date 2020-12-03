import React from 'react';
import ProfileMyProfileComponent from '../../components/Profile/MyProfileComponent';
import { View } from 'react-native';

class ProfileMyProfileScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <ProfileMyProfileComponent/>
            </View>
            
        )
    }

}

export default ProfileMyProfileScreen;