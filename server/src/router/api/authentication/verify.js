import AccountModel from "../../../models/Account/Account";
import Escape from 'escape-html';
import EmailValidator from 'email-validator';
import bcrypt from 'bcrypt';
import manageToken from '../../../middleware/protection/manageToken'

module.exports = (req, res, next) =>
{
    var Token = req.headers.authorization;

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'forbiddon'
        })
    } else {

        try {
            const decod = new manageToken().generateDecode(Token);
            AccountModel.findOne({_id: decod.data.id}, function(err, search) {
                if(err) {
                    return res.json({
                        status: 'error',
                        response: 'Une erreur interne est survenue'
                    });
                } else {
                    if(!search) {
                        return res.json({
                            status: 'error',
                            response: 'Aucune donnée n\'est disponible'
                        });
                    } else {
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
                            created_at: search.created_at
                        }
                        return res.json({
                            status: 'success', 
                            response: 'Connexion établie', 
                            data: data
                        })
                    }
                }
            });
        } 
        catch(err) {
            return res.json({status: 'error', response: 'error token'});
        }

    }

}
