import AccountModel from "../../../models/Account/Account";
import Escape from 'escape-html';
import EmailValidator from 'email-validator';
import bcrypt from 'bcrypt';
import manageToken from '../../../middleware/protection/manageToken'

module.exports = (req, res, next) =>
{
    var Email = req.body.email,
        Password = req.body.password;

    if(req.headers['x-api-key'] == __config.http.key) {
        if(!Email) {
            return res.json({response: 'Veuillez entrer une adresse email', status: 'error'});
        } else {
            if(!Password) {
                return res.json({response: 'Veuillez entrer un mot de passe', status: 'error'});
            } else {
                AccountModel.findOne({email: Escape(Email)}, function(err, search) {
                    if(err) {
                        return res.json({response: err.message, status: 'error'});
                    } else {
                        console.log(search);
                        if(search != null) {
                            bcrypt.compare(Password, search.password, function (err, result) {
                                if (err) {
                                    return res.status(500).send({
                                        status: 'error',
                                        response: 'Un problème interne est survenue',
                                    });

                                } else {
                                    if (result === true) {
                                        const data = {
                                            id: search._id,
                                            username: search.username,
                                            displayUsername: search.display_username,
                                            email: search.email,
                                            avatar: search.avatar,
                                            role: search.role,
                                            verified: search.verified,
                                            notification_active: search.notification_active,
                                            notification_id: search.notification_id,
                                            disabled: search.disabled,
                                            created_at: search.created_at,
                                            authorization_access: {
                                                bundle_identified: ''
                                            }
                                        }

                                        const userData = {
                                            id: search._id,
                                            username: search.username,
                                            displayUsername: search.display_username,
                                            email: search.email,
                                            avatar: search.avatar,
                                            role: search.role,
                                            verified: search.verified,
                                            notification_active: search.notification_active,
                                            notification_id: search.notification_id,
                                            created_at: search.created_at
                                        }
                                        return res.json({response: 'Vous êtes maintenant connecté', status: 'success', token: new manageToken().generateEncode(data), user: userData});
                                    } else {
                                        return res.json({response: 'Votre mot de passe est incorrect', status: 'error'});
                                    }
                                }
                            });

                        } else {
                            return res.json({response: 'Votre adresse email est incorrect', status: 'error'});
                        }
                    }
                });
            }
        }
    } else {
        return res.json({response: 'Forbidden', status: 'error', statusCode: '403'});
    }
}
