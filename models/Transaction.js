const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    payer: {type: Schema.Types.ObjectId, ref:'Account'},
    points: Number,
    timestamp: Date,

});


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;