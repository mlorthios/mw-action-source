import manageToken from "../../../middleware/protection/manageToken";
import ActualityModel from "../../../models/News/Actuality";
import CategoryModel from "../../..//models/News/Category";
import SubCategoryModel from "../../../models/News/SubCategory";

module.exports = (req, res, next) =>
{

    if(req.headers['x-api-key'] == __config.http.key) {
        if(req.query.app_name == 'fr.mwactu.application' || req.query.app_name == 'com.mwactudev') {

            if(req.query.category && req.query.category !== undefined) {
                if(req.query.limit && req.query.limit !== undefined) {
                    CategoryModel.find({name: req.query.category}, function (err, category) {
                        if(err) {
                            const response = {
                                response: err.name,
                                status: 'error',
                                statusCode: '500',
                            }
                            res.json(response);
                        } else {
                            if(category.length != 0 && category !== undefined) {
                                ActualityModel.aggregate([
                                    { $sort : { created_at : -1 } },
                                    { $match : { "category_id" : category[0]._id } },
                                    {
                                        "$lookup": {
                                            "from": "subcategories",
                                            "localField": "sub_category_id",
                                            "foreignField": "_id",
                                            "as": "subcategory"
                                        },
                                    },
                                    { $limit : 4 },
                                    {
                                        $project: {
                                            "category_id": 0,
                                            "sub_category_id": 0,
                                            "description": 0,
                                            "subcategory._id": 0,
                                            "subcategory.category_id": 0
                                        }
                                    }
                                ], function(err, docs) {
                                    if(err) {
                                        console.log(err);
                                    }
                                        const response = {
                                            response: docs,
                                            status: 'success',
                                            statusCode: '200'
                                        }
                                        res.json(response);
                                })
                            } else {
                                const response = {
                                    response: 'Not Found',
                                    status: 'error',
                                    statusCode: '404',
                                }
                                res.json(response);
                            }
                        }
                    });
                } else {
                    CategoryModel.find({name: req.query.category}, function (err, category) {
                        if(err) {
                            const response = {
                                response: err.name,
                                status: 'error',
                                statusCode: '500',
                            }
                            res.json(response);
                        } else {
                            if(category.length != 0 && category !== undefined) {
                                ActualityModel.aggregate([
                                    { $match : { "category_id" : category[0]._id, "disabled": false } },
                                    {
                                        "$lookup": {
                                            "from": "subcategories",
                                            "localField": "sub_category_id",
                                            "foreignField": "_id",
                                            "as": "subcategory"
                                        },
                                    },
                                    {
                                        $project: {
                                            "category_id": 0,
                                            "sub_category_id": 0,
                                            "description": 0,
                                            "subcategory._id": 0,
                                            "subcategory.category_id": 0
                                        }
                                    }
                                ], function(err, docs) {
                                        const response = {
                                            response: docs,
                                            status: 'success',
                                            statusCode: '200'
                                        }
                                        res.json(response);
                                })
                            } else {
                                const response = {
                                    response: 'Not Found',
                                    status: 'error',
                                    statusCode: '404',
                                }
                                res.json(response);
                            }
                        }
                    });
                }

            } else if(req.query.id) {
                ActualityModel.aggregate([
                    { "$addFields": { "newId": { "$toString": "$_id" }}},
                    { $match : { "newId" : req.query.id } },
                    {
                        "$lookup": {
                            "from": "subcategories",
                            "localField": "sub_category_id",
                            "foreignField": "_id",
                            "as": "subcategory"
                        },
                    },
                    {
                        $project: {
                            "category_id": 0,
                            "sub_category_id": 0,
                            "description": 0,
                            "subcategory._id": 0,
                            "subcategory.category_id": 0,
                            "newId": 0
                        }
                    }
                ], function(err, docs) {
                        const response = {
                            response: docs,
                            status: 'success',
                            statusCode: '200'
                        }
                        res.json(response);
                })
            } else {
                const response = {
                    response: 'Forbidden',
                    status: 'error',
                    statusCode: '403'
                }
                res.json(response);
            }

        } else {
            const response = {
                response: 'Forbidden',
                status: 'error',
                statusCode: '403'
            }
            res.json(response);
        }
    } else {
        const response = {
            response: 'Forbidden',
            status: 'error',
            statusCode: '403'
        }
        res.json(response);
    }

}