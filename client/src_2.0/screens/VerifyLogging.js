import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';

class VerifyLogging extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if(this.props.loggedIn.isLogged == true) {
            this.props.navigation.navigate('HomeL');
        } else {
            this.props.navigation.navigate('HomeNL');
        }
    }

    render() {
        return (
            <View style={{alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}><Text style={{textAlign: 'center'}}>Chargement</Text></View>
        );
    }

}

const mapStateToProps = (state) => {
    return {
      loggedIn: {
        isLogged: state.authReducer.loggedIn
      }
    };
  };

export default connect(mapStateToProps)(VerifyLogging);