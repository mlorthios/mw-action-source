var mongoose = require('mongoose');

var SubCategorySchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    display_name: {
        type: String,
        required: true
    }
});

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = SubCategory;
