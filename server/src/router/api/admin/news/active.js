import ActualityModel from "../../../../models/News/Actuality";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';

module.exports = (req, res, next) =>
{
    var Token = req.headers.authorization,
        NewId = req.body.id;

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'Forbidden'
        })
    } else {

        try {
            const decod = new manageToken().generateDecode(Token);
            if(decod.data.role == 'admin') {
                var dataChange = {
                    disabled: false
                }
                ActualityModel.findByIdAndUpdate(NewId, dataChange, function(err, news) {
                    if(err) {
                        console.log(err)
                        return res.json({status: 'error', response: 'Une erreur est survenue'});
                    } else {
                        if(news != null) {
                            return res.json({status: 'success', response: 'Votre actualité a bien été activé'});
                        } else {
                            return res.json({status: 'error', response: 'Aucune catégorie à activé'});
                        }
                    }
                })
            } else {
                return res.json({
                    status: 'error',
                    response: 'Forbidden'
                })
            }
        }
        catch(err) {
            return res.json({status: 'error', response: 'Forbidden'});
        }
    }
}

