var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');

var AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [
            true, "ne peut être vide"
        ],
        match: [/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, 'Votre nom d\'utilisateur est invalide car il utilise des caractères spéciaux ou dépasse les 30 caractères'],
        index: true
    },
    display_username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "ne peut être vide"],
        match: [/\S+@\S+\.\S+/, 'est invalide'],
        index: true
    },
    phone: {
        type: String,
        required: false,
        unique: false
    },
    avatar: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    notification_active: {
        type: Boolean,
        required: true
    },
    notification_id: {
        type: String,
        required: false
    },
    registration_ip: {
        type: String,
        required: true
    },
    psn: {
        type: String,
        required: false
    },
    xbox: {
        type: String,
        required: false
    },
    battlenet: {
        type: String,
        required: false
    },
    disable: {
        type: Boolean,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    }
});

AccountSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
