import request from 'request';
import history from '../middleware/history';
import axios from 'axios';
import qs from "qs";

export const Authentication = {
    login,
    isLogging
};

function login(username, password) {
    var url = 'http://localhost:8080/login.php';

    const data = { 'username': username, 'password': password };
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url,
    };
    axios(options).then(function (response) {
        if(response.data['status'] === 'success') {
            history.push('/user/dashboard')
        } else {
            return response.data['response']
        }

    }).catch(function (error) {
        console.log(error);
    });

    return Promise.resolve();
}

function isLogging() {
    return true;
}
