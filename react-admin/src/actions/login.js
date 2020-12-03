import axios from 'axios';
import qs from "qs";
import cookie from 'react-cookies'

export function LoginData(email, password) {
    return new Promise((resolve, reject) =>{
        var url = 'http://localhost:4001/v1/authentication/login';

        var expires = new Date();
        expires.setTime(expires.getTime()+31536000000);

        const data = { 'email': email, 'password': password };
        const options = {
            method: 'POST',
            crossDomain: true,
            headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'x-api-key': 'HJsj34567dhjdbfd5678jhfdgsjkqmmsdl457IBG46UGsduffhsteghfjdJGJHGtkssdfukkHUFTFJH4657tdftsfykd57GHIf' },
            data: qs.stringify(data),
            url,
        };
        axios(options).then(function (response) {
            if(response.data['status'] === 'success') {
                if(response.data.user['role'] !== 'user') {
                    cookie.save('token', response.data['token'], { path: '/',  expires });
                    resolve(response.data);
                } else {
                    resolve({
                        response: 'Vous n\'êtes pas autorisé à accéder à ce site',
                        status: 'error'
                    });
                }

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
                    response: 'Une erreur a été détecté, veuillez réessayer '+process.env.API,
                    status: 'error',
                };
                reject(erreur);
            }
        });
    });
}
