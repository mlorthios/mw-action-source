import AccountModel from "../../../models/Account/Account";
import Escape from 'escape-html';
import EmailValidator from 'email-validator';
import manageToken from '../../../middleware/protection/manageToken'

module.exports = (req, res, next) =>
{
    var Pseudonyme = req.body.pseudonyme,
        Username = req.body.username,
        Email = req.body.email,
        Password = req.body.password;

    if(req.headers['x-api-key'] == __config.http.key) {
        if(!Pseudonyme) {
            return res.json({response: 'Veuillez entrer un pseudonyme', status: 'error'});
        } else {
            
            if(!Username) {
                return res.json({response: 'Veuillez entrer un nom d\'utilisateur', status: 'error'});
            } else {
                if(Username.substr(0,1) != '.') {
                    if(Username.substr(Username.length -1) != '.') {
                        if(Username.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)) {
                            if(Username.length <= 2) {
                                return res.json({response: 'Votre nom d\'utilisateur est trop court', status: 'error'});
                            } else {
                                if(Username.length > 16) {
                                    return res.json({response: 'Votre nom d\'utilisateur est trop long', status: 'error'});
                                } else {
                                    if(!Email) {
                                        return res.json({response: 'Veuillez entrer une adresse email', status: 'error'});
                                    } else {
                                        if(!EmailValidator.validate(Email)) {
                                            return res.json({response: 'Votre adresse email est incorrect', status: 'error'});
                                        } else {
                                            if(!Password) {
                                                return res.json({response: 'Veuillez entrer un mot de passe', status: 'error'});
                                            } else {
                                                if(Password.length <= 5) {
                                                    return res.json({response: 'Votre mot de passe est trop court', status: 'error'});
                                                } else {
                                                    AccountModel.findOne({username: Escape(Username)}, function(err, searchuser) {
                                                        if(err) {
                                                            return res.json({response: 'Un problème interne est survenue', status: 'error'});
                                                        }  else {
                                                            if(searchuser == null) {
                                                                AccountModel.findOne({email: Escape(Email)}, function(err, searchemail) {
                                                                    if(err) {
                                                                        return res.json({response: 'Un problème interne est survenue', status: 'error'});
                                                                    } else {
                                                                        if(searchemail == null) {
                                                                            var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

                                                                            var dataUser = {
                                                                                username: Escape(Username),
                                                                                display_username: Escape(Pseudonyme),
                                                                                password: Password,
                                                                                email: Escape(Email),
                                                                                phone: '',
                                                                                avatar: 'https://api.mwactu/public/img/default_avatar/default.png',
                                                                                role: 'user',
                                                                                verified: false,
                                                                                notification_active: false,
                                                                                notification_id: '',
                                                                                registration_ip: ip,
                                                                                disable: false,
                                                                                created_at: new Date(Date.now())
                                                                            }

                                                                            AccountModel.create(dataUser, function(err, created) {
                                                                            if(err) {
                                                                                
                                                                                return res.json({response: err.message, status: 'error'});
                                                                            } else {

                                                                                var dataUserPublic = {
                                                                                    id: created._id,
                                                                                    username: Escape(Username),
                                                                                    displayUsername: Escape(Pseudonyme),
                                                                                    email: Escape(Email),
                                                                                    phone: '',
                                                                                    avatar: 'https://api.mwactu.fr/public/img/default_avatar/default.png',
                                                                                    role: 'user',
                                                                                    verified: false,
                                                                                    notification_active: false,
                                                                                    notification_id: '',
                                                                                    disable: false,
                                                                                    created_at: new Date(Date.now())
                                                                                }

                                                                                console.log('created:' + created)
                                                                                return res.json({response: 'Votre compte a bien été créé', token: new manageToken().generateEncode(dataUserPublic), status: 'success', user: dataUserPublic});
                                                                            }
                                                                            });
                                                                        } else {
                                                                            return res.json({response: 'Cette adresse email est déjà utilisé', status: 'error'});
                                                                        }
                                                                    }
                                                                });

                                                            } else {
                                                                return res.json({response: 'Ce nom d\'utilisateur est déjà utilisé', status: 'error'});
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            return res.json({response: 'Les noms d\'utilisateurs ne peuvent contenir que des lettres, des chiffres, des traits de soulignement et des points', status: 'error'});
                        }
                    } else {
                        return res.json({response: 'Vous ne pouvez pas terminer votre nom d\'utilisateur par un point', status: 'error'});
                    }
                } else {
                    return res.json({response: 'Vous ne pouvez pas commencer votre nom d\'utilisateur par un point', status: 'error'});
                }
            }
        }
    } else {
        return res.json({response: 'Forbidden', status: 'error', statusCode: '403'});
    }
}
