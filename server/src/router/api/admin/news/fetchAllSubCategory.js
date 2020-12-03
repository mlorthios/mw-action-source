import SubCategoryModel from "../../../../models/News/SubCategory";
import CategoryModel from "../../../../models/News/Category";
import manageToken from '../../../../middleware/protection/manageToken'
import Escape from 'escape-html';

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
                SubCategoryModel.aggregate([
                    {
                        "$lookup": {
                            "from": "categories",
                            "localField": "category_id",
                            "foreignField": "_id",
                            "as": "category"
                        },
                    },
                    {$unwind: '$category'},
                    {
                        $project: {
                            "__v": 0,
                            "category_id": 0,
                            "name": 0,
                            "category.__v": 0,
                            "category.name": 0
                        }
                    }
                ], function(err, docs) {
                        const response = {
                            response: docs,
                            status: 'success',
                            statusCode: '200'
                        }
                        return res.json(response);
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

