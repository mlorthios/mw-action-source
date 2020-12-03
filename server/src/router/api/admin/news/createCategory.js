import CategoryModel from "../../../..//models/News/Category";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';

module.exports = (req, res, next) =>
{
    var Token = req.headers.authorization,
        DisplayName = req.body.display_name;

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'Forbidden'
        })
    } else {

        if(!DisplayName) {
            return res.json({
                status: 'error',
                response: 'Veuillez entrer un nom de catégorie'
            })

        } else {
            try {
                const Name = DisplayName.replace(/\s+/g, '');

                var data = {
                    name: Name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
                    display_name: DisplayName
                }
                const decod = new manageToken().generateDecode(Token);
                if(decod.data.role == 'admin') {
                    CategoryModel.findOne({display_name: Escape(DisplayName)}, function(err, search) {
                        if(err) {
                            console.log(err);
                            return res.json({status: 'error', response: 'Une erreur est survenue'});
                        } else {
                            CategoryModel.create(data, function(err, created) {
                                if(err) {
                                    if(err.code == 11000) {
                                        return res.json({status: 'error', response: 'Cette catégorie existe déjà'});
                                    } else {
                                        return res.json({status: 'error', response: 'Une erreur est survenue'});
                                    } 
                                    
                                } else {
                                    return res.json({status: 'success', response: 'La catégorie a bien été créée', data: created});
                                }
                            })
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
    }
}