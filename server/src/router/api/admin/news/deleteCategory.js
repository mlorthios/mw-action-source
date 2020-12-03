import CategoryModel from "../../../../models/News/Category";
import SubCategoryModel from "../../../../models/News/SubCategory";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';

module.exports = (req, res, next) =>
{
    var Token = req.headers.authorization,
        CategoryName = req.body.category_name;

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'Forbidden'
        })
    } else {

        try {
            const decod = new manageToken().generateDecode(Token);
            if(decod.data.role == 'admin') {
                CategoryModel.findByIdAndDelete({_id: CategoryName}, function(err, categ) {
                    if(err) {
                        return res.json({status: 'error', response: 'Une erreur est survenue'});
                    } else {
                        if(categ != null) {
                            SubCategoryModel.deleteMany({category_id: categ._id}, function(err, subcateg) {
                                if(err) {
                                    return res.json({status: 'success', response: 'Une erreur est survenue'});
                                } else {
                                    console.log(subcateg.deletedCount)
                                    if(subcateg.deletedCount != 0) {
                                        return res.json({status: 'success', response: 'La catégorie ainsi que les sous-catégories ont bien été supprimées'});
                                    } else {
                                        return res.json({status: 'success', response: 'La catégorie a bien été supprimée'});
                                    }
                                }
                            });
                            
                        } else {
                            return res.json({status: 'error', response: 'Aucune catégorie à supprimer'});
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

