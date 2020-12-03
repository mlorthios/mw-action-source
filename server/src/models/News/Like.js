var mongoose = require('mongoose');

var NewsLikeSchema = new mongoose.Schema({
    news_id: {
        type: mongoose.Schema.ObjectId,
        required: false
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        unique: false
    },
    uniq_id: {
        type: String,
        required: true,
        unique: false
    }
});

const NewsLike = mongoose.model('NewsLike', NewsLikeSchema);

module.exports = NewsLike;
