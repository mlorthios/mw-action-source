import ActualityModel from "../../../../models/News/Actuality";
import SubCategoryModel from "../../../../models/News/SubCategory";
import CategoryModel from "../../../../models/News/Category";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';

import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

module.exports = (req, res, next) =>
{
    var Token = req.headers.authorization,
        NewsId = req.query.id;

    console.log(NewsId)

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'Forbidden'
        })
    } else {
        try {

                const decod = new manageToken().generateDecode(Token);
                if(decod.data.role == 'admin') {

                    ActualityModel.aggregate([
                        /*{ $skip: skip },
                        { $limit: limit },*/
                        { $match : { _id : ObjectId(NewsId) } },
                        { $limit: 1 },
                        {
                            "$lookup": {
                                "from": "categories",
                                "localField": "category_id",
                                "foreignField": "_id",
                                "as": "category"
                            },
                        },
                        {
                            "$lookup": {
                                "from": "subcategories",
                                "localField": "sub_category_id",
                                "foreignField": "_id",
                                "as": "subcategory"
                            },
                        },
                        {$unwind: '$category'},
                        {$unwind: '$subcategory'},
                        {
                            $project: {
                                "__v": 0,
                                "subcategory.__v": 0,
                                "category.__v": 0
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