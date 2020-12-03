import ActualityModel from "../../../../models/News/Actuality";
import SubCategoryModel from "../../../../models/News/SubCategory";
import CategoryModel from "../../../../models/News/Category";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';

module.exports = (req, res, next) =>
{
    var Token = req.headers.authorization,
        PageCurrent = req.query.page_current;

    if(!Token) {
        return res.json({
            status: 'error',
            response: 'Forbidden'
        })
    } else {
        try {

                const decod = new manageToken().generateDecode(Token);
                if(decod.data.role == 'admin') {

                    var page = parseInt(PageCurrent);
                    var limit = parseInt(1);
                    var skip = (page - 1) * limit;

                    ActualityModel.aggregate([
                        /*{ $skip: skip },
                        { $limit: limit },*/
                        { $sort : { created_at : -1 } },
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
                                "content": 0,
                                "image": 0,
                                "posted_by": 0,
                                "category_id": 0,
                                "sub_category_id": 0,
                                "__v": 0,
                                "category.__v": 0,
                                "category._id": 0,
                                "description": 0,
                                "subcategory._id": 0,
                                "subcategory.category_id": 0,
                                "subcategory.__v": 0
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