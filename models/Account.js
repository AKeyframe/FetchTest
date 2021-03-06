const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    user: String,
    points: Number,
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;