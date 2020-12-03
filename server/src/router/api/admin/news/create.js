import ActualityModel from "../../../../models/News/Actuality";
import CategoryModel from "../../../../models/News/Category";
import SubCategoryModel from "../../../../models/News/SubCategory";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';
var path = require('path');
import uuid from 'uuid/v1';

module.exports = (req, res, next) =>
{

    var Token = req.headers.authorization;

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'Forbidden'
        })
    } else {

        try {
            const decod = new manageToken().generateDecode(Token);
            if(decod.data.role == 'admin') {

                var Title = Escape(req.body.title),
                    TitleMaxLength = 80,
                    Description = Escape(req.body.description),
                    DescriptionMaxLength = 60,
                    Category = Escape(req.body.category),
                    SubCategory = Escape(req.body.sub_category),
                    Image = req.files,
                    Content = req.body.content;

                if(Title !== 'undefined' && Title.length !== 0) {
                    if(Title.length <= TitleMaxLength) {
                        if(Description !== 'undefined' && Description.length !== 0) {
                            if(Description.length <= DescriptionMaxLength) {
                                if(Category !== 'undefined' && Category.length !== 0) {
                                    CategoryModel.findOne({name: Category}, function (err, categ) {
                                        if (err) {
                                            return res.status(500).send({
                                                status: 'error',
                                                response: 'Un problème interne est survenue',
                                            });
                                        } else {
                                            if(categ != null) {
                                                if(SubCategory !== 'undefined' && SubCategory.length !== 0) {
                                                    SubCategoryModel.findOne({name: SubCategory, category_id: categ._id}, function (err, subcateg) {
                                                        if (err) {
                                                            return res.status(500).send({
                                                                status: 'error',
                                                                response: 'Un problème interne est survenue',
                                                            });
                                                        } else {
                                                            if(subcateg != null) {
                                                                if (!req.files || Object.keys(req.files).length === 0) {
                                                                    return res.json({response: 'Veuillez ajouter une image', status: 'error'});
                                                                } else {

                                                                    let Image = req.files.image;

                                                                    const extension = path.extname(Image.name);
                                                                    const filename = uuid();

                                                                    const imageUrlLocal = "http://localhost:4001/public/img/"+filename+extension;
                                                                    const imageUrl = "https://api.mwaction.app/public/img/"+filename+extension;

                                                                    Image.mv(__base+'/public/img/'+filename+extension, function(err) {
                                                                        if (err) {
                                                                            return res.status(500).send({
                                                                                response: 'Un problème est survenue pendant l\'importation de l\'image',
                                                                                status: 'error',
                                                                            });
                                                                        } else {
                                                                            if(!Content) {
                                                                                return res.json({response: 'Veuillez écrire un contenu', status: 'error'});
                                                                            } else {

                                                                                var dataActuality = {
                                                                                    category_id: categ._id,
                                                                                    sub_category_id: subcateg._id,
                                                                                    title: Title,
                                                                                    description: Description,
                                                                                    content: Content,
                                                                                    image: imageUrlLocal,
                                                                                    created_at: new Date(Date.now()),
                                                                                    posted_by: decod.data.username,
                                                                                    disabled: false
                                                                                }

                                                                                ActualityModel.create(dataActuality, function(err, created) {
                                                                                    if(err) {
                                                                                        console.log(err);
                                                                                        return res.json({response: 'Un problème interne est survenue', status: 'error'});
                                                                                    } else {
                                                                                        return res.json({response: 'Votre actualité a bien été posté', status: 'success'});
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    });
                                                                }

                                                            } else {
                                                                return res.json({response: 'Cette sous-catégorie n\'existe pas', status: 'error'});
                                                            }
                                                        }
                                                    });

                                                } else {
                                                    return res.json({response: 'Veuillez sélectionner une sous-catégorie', status: 'error'});
                                                }

                                            } else {
                                                return res.json({response: 'Cette catégorie n\'existe pas', status: 'error'});
                                            }
                                        }
                                    });
                                } else {
                                    return res.json({response: 'Veuillez sélectionner une catégorie', status: 'error'});
                                }

                            } else {
                                return res.json({response: 'Veuillez entrer une description plus court', status: 'error'});
                            }

                        } else {
                            return res.json({response: 'Veuillez entrer une description', status: 'error'});
                        }

                    } else {
                        return res.json({response: 'Veuillez entrer un titre plus court', status: 'error'});
                    }

                } else {
                    return res.json({response: 'Veuillez entrer un titre', status: 'error'});
                }
            } else {
                return res.json({response: 'Forbidden', status: 'error'});
            }
        }
        catch(err) {
            return res.json({status: 'error', response: 'Forbidden'});
        }
    }
}
