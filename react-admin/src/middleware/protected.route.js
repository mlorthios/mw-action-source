import React from 'react';
import { Route, Redirect} from "react-router-dom";
import qs from "qs";
import axios from "axios";
import cookie from 'react-cookies'

class ProtectedRoute extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            isLoading: true,
            isLoggedIn: false,
            isErrorNetwork: false
        };

        let that = this;

        var url = 'http://localhost:4001/v1/authentication/verify';

        const data = { 'token': cookie.load('token') };
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': cookie.load('token') },
            url,
        };
        axios(options).then(function (response) {
            console.log(response);
            if(response.data['status'] != 'error') {
                if(response.data.data['role'] !== 'user') {
                    if(response.data['status'] === 'success') {
                        that.setState(() => ({ isLoading: false, isLoggedIn: true }));
                    } else {
                        that.setState(() => ({ isLoading: false, isLoggedIn: false }));
                    }
                } else {
                    that.setState(() => ({ isLoading: false, isLoggedIn: false }));
                }
            } else {
                that.setState(() => ({ isLoading: false, isLoggedIn: false }));
            }

        }).catch(function(error) {
            if(error.message === 'Network Error') {
                that.setState({ isErrorNetwork: true, isLoading: false });
            }
        });

    }

    render() {

        if(this.state.isLoading) {
            return null;
        } else if(this.state.isErrorNetwork) {
            return <Redirect to={{ pathname: '/user/error_network', state: { from: this.props.location } }} />;
        } else if(this.state.isLoggedIn) {
            return <Route path={this.props.path} component={this.props.component} exact={this.props.exact}/>;
        } else {
            return <Redirect to={{ pathname: '/user/login', state: { from: this.props.location } }} />;
        }

    }

}

export default ProtectedRoute;
