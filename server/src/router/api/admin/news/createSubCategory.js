import SubCategoryModel from "../../../../models/News/SubCategory";
import CategoryModel from "../../../../models/News/Category";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';

module.exports = (req, res, next) =>
{
    var Token = req.headers.authorization,
        CategoryName = req.body.category_name,
        DisplayName = req.body.display_name;

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'Forbidden'
        })
    } else {

        if(!DisplayName && !CategoryName) {
            return res.json({
                status: 'error',
                response: 'Forbidden'
            })

        } else {
            try {
                const Name = DisplayName.replace(/\s+/g, '');

                const decod = new manageToken().generateDecode(Token);
                if(decod.data.role == 'admin') {
                    CategoryModel.findOne({name: CategoryName}, function(err, categ) {
                        if(err) {
                            return res.json({status: 'error', response: 'Une erreur est survenue'});
                        } else {
                            if(categ !== null) {
                                var data = {
                                    category_id: categ._id,
                                    name: Name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
                                    display_name: DisplayName
                                }
                                if(!DisplayName) {
                                    return res.json({status: 'error', response: 'Veuillez entrer un nom de sous-catégorie'});
                                } else {
                                    SubCategoryModel.create(data, function(err, subc) {
                                        if(err) {
                                            
                                            return res.json({status: 'error', response: 'Une erreur est survenue'});
                                        } else {
                                            return res.json({status: 'success', response: 'La sous-catégorie a bien été créée', data: subc, category: categ});
                                        }
                                    })
                                }
                            } else {
                                return res.json({status: 'error', response: 'Une erreur est survenue'});
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
    }
}

