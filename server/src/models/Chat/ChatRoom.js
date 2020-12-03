var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var ChatRoomSchema = new mongoose.Schema({
    message_id: {
        type: String,
        required: [true]
    },
    text: {
        type: String,
        required: true
    },

    user_id: {
        type: mongoose.Schema.ObjectId,
        unique: false,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },

});

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;
