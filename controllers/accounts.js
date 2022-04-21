const express = require('express');
const accountRouter = express.Router();
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');


//Index - Show all accounts and their current points balance
accountRouter.get('/', (req, res) => {
    
    Account.find({}, (error, foundAccounts) => {
        res.json(foundAccounts);
    });
});

//Delete - Deletes all accounts
accountRouter.delete('/', (req, res) => {
    Account.deleteMany({}, (err, delAccounts) => {
        res.redirect('/');
    });
});


module.exports = accountRouter;