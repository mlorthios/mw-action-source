import SubCategoryModel from "../../../../models/News/SubCategory";
import CategoryModel from "../../../../models/News/Category";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';

module.exports = (req, res, next) =>
{
    var Token = req.headers.authorization,
        Category = req.query.category;

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'Forbidden'
        })
    } else {

        try {
            const decod = new manageToken().generateDecode(Token);
            if(decod.data.role == 'admin') {
                CategoryModel.findOne({name: Category}, function(err, categ) {
                    if(err) {
                        return res.json({status: 'error', response: 'Une erreur est survenue'});
                    } else {
                        if(categ != null) {
                            SubCategoryModel.find({category_id: categ._id}, function(err, subcateg) {
                                if(err) {
                                    return res.json({status: 'error', response: 'Une erreur est survenue'});
                                } else {
                                    if(subcateg != null) {
                                        return res.json({status: 'success', response: subcateg});
                                    } else {
                                        return res.json({status: 'error', response: 'Aucune sous-catégorie a afficher'});
                                    }
                                }
                            })
                        } else {
                            return res.json({status: 'error', response: 'Erreur de catégorie'});
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

