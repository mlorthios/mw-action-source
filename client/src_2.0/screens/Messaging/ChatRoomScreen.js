import React from 'react';
import { View } from 'react-native';

import MessagingChatRoomComponent from '../../components/Messaging/ChatRoomComponent';

class MessagingChatRoomScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <MessagingChatRoomComponent/>
        )
    }
}

export default MessagingChatRoomScreen;