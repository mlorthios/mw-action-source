import axios from 'axios';
import qs from "qs";

export function LoginCheckData(token) {
    return new Promise((resolve, reject) =>{
        var url = 'http://localhost:4001/v1/authentication/verify';

        const data = { 'token': token };
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': token },
            url,
        };
        axios(options).then(function (response) {
            console.log(response)
            if(response.data['status'] === 'success') {
                resolve(response.data);
            } else {
                resolve(response.data);
            }

        }).catch(function (error) {
            if(error.message === 'Network Error') {
                const erreur = {
                    response: 'Une erreur sur nos serveurs a été détecté, veuillez réessayer',
                    status: 'error',
                };
                reject(erreur);
            } else {
                const erreur = {
                    response: 'Une erreur a été détecté, veuillez réessayer',
                    status: 'error',
                };
                reject(erreur);
            }
        });
    });
}
