import manageToken from "../../../middleware/protection/manageToken";
import LikeModel from '../../../models/News/Like';


module.exports = (req, res, next) =>
{

    var Token = req.headers.authorization,
        NewsID = req.body.id,
        UniqID = req.body.uniq;

    if(req.headers['x-api-key'] == __config.http.key) {
        if(req.query.app_name == 'fr.mwactu.application' || req.query.app_name == 'com.mwactudev') {

            if(!Token) {
                return res.json({
                    statusCode: '403',
                    status: 'error',
                    response: 'Forbidden'
                })
            } else {
        
                try {
                    const decod = new manageToken().generateDecode(Token);
                    if(decod) {
                        LikeModel.findOne({news_id: NewsID, user_id: decod.data.id}, (err, sliked) => {
                            if(err) {
                                return res.json({
                                    status: 'error',
                                    response: 'Une erreur est survenue'
                                })
                            } else {
                                if(sliked == null) {
                                    const c = {
                                        news_id: NewsID,
                                        user_id: decod.data.id,
                                        uniq_id: UniqID
                                    }
                                    LikeModel.create(c, (err, liked) => {
                                        if(err) {
                                            return res.json({
                                                status: 'error',
                                                response: 'Une erreur est survenue'
                                            })
                                        } else {
                                            return res.json({
                                                status: 'success',
                                                response: 'La mention j\'aime a bien été ajouté'
                                            })
                                        }
                                    });
                                } else {
                                    return res.json({
                                        status: 'exist',
                                        response: 'Vous avez déjà like'
                                    })
                                }
                            }
                        });
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

        } else {
            const response = {
                response: 'Forbidden',
                status: 'error',
                statusCode: '403'
            }
            return res.json(response);
        }
    } else {
        const response = {
            response: 'Forbidden',
            status: 'error',
            statusCode: '403'
        }
        return res.json(response);
    }

}