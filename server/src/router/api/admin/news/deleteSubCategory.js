import SubCategoryModel from "../../../../models/News/SubCategory";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';

module.exports = (req, res, next) =>
{
    var Token = req.headers.authorization,
        SubCategoryName = req.body.sub_category_name;

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'Forbidden'
        })
    } else {

        try {
            const decod = new manageToken().generateDecode(Token);
            if(decod.data.role == 'admin') {
                SubCategoryModel.findByIdAndDelete({_id: SubCategoryName}, function(err, categ) {
                    if(err) {
                        return res.json({status: 'error', response: 'Une erreur est survenue'});
                    } else {
                        if(categ != null) {
                            return res.json({status: 'success', response: 'La sous-catégorie a bien été supprimée'});
                        } else {
                            return res.json({status: 'error', response: 'Aucune sous-catégorie à supprimer'});
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

