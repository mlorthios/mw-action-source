var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var ActualitySchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.ObjectId,
        required: [true]
    },
    sub_category_id: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    title: {
        type: String,
        index: true,
        required: true
    },
    description: {
        type: String,
        unique: false,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        required: true
    },
    posted_by: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        required: true
    }

});

const Actuality = mongoose.model('Actuality', ActualitySchema);

module.exports = Actuality;
