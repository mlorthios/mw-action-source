var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    display_name: {
        type: String,
        required: true,
        unique: true
    }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
