const express = require('express');
const transactionRouter = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

//Delete - Deletes all trasnactions
transactionRouter.delete('/', (req, res) => {
    Transaction.deleteMany({}, (err, delActions) => {
        res.redirect('/');
    });
});

//Update / Spend
transactionRouter.put('/', (req, res) => {  
    let prevDebt = req.body.points;
    let curDebt = req.body.points;
    let ps = 0; //points spent
    let spent = {};
    

    //foundTransactions (ft) - will be sorted by date
    let tArr = Transaction.find({}).sort({ "timestamp" : 1 }).populate('payer');
    let promise = tArr.exec();

    promise.then(actions => {
        if(curDebt < 0) res.send("You cannot spend a negative amount.");
        else if(curDebt === 0) res.send("No points were spent");
        else {
            //Iterate through the array. Break when there is no remaining debt
            for(let i=0; i<actions.length; i++){
                if(curDebt > 0){
                    //If the transaction gains the person points
                    if(actions[i].points <=0){
                        
                        curDebt+= actions[i].points*(-1);
                        prevDebt+= actions[i].points*(-1);
                        
                        //Add points spent to total spent for user
                        spent[actions[i].payer.user] ? 
                            spent[actions[i].payer.user]+= (actions[i].points*(-1)) : 
                            spent[actions[i].payer.user] = (actions[i].points*(-1));


                    //If the payer isn't out of points
                    } else if(actions[i].payer.points > 0){
                        
                        //If the user more points vs the trasasction
                        if(actions[i].payer.points >= actions[i].points){
                            curDebt = curDebt - actions[i].points;
                            
                            //Check points spent
                            curDebt < 0 ? 
                                ps = prevDebt :
                                ps = actions[i].points;

                            //Add points spent to total spent for user
                            spent[actions[i].payer.user] ? 
                                spent[actions[i].payer.user]+= ps*(-1) :
                                spent[actions[i].payer.user] = ps*(-1);
                            
                            prevDebt = curDebt;     

                        } else {
                            curDebt = curDebt - actions[i].payer.points;
                            
                            //Check points spent
                            curDebt < 0 ? 
                                ps = (actions[i].payer.points + curDebt) :
                                ps = actions[i].payer.points;

                            //Add points spent to total spent for user
                            spent[actions[i].payer.user]? 
                                spent[actions[i].payer.user]+= ps*(-1) :
                                spent[actions[i].payer.user] = ps*(-1);
                            
                            prevDebt = curDebt;

                        }
                    } // else if payers points > 0
                } else {
                    break;
                }
            }//for

            //user total deduction and formatting
            let result = [];
            
            if(curDebt > 0) result.push({UnableToSpend: curDebt})
            for(let key in spent){
                result.push({payer: key, points: spent[key]});

                Account.findOne({user: key}).exec( (error, foundUser) => {
                    foundUser.points = foundUser.points + (spent[key]);
                    foundUser.save();

                });
            }

            res.json(result);
        }// main else
    }); // promise.then()
}); //router

//Create - Transaction Route / Will create account if it doesn't exist
transactionRouter.post('/', (req, res) => {
    const name = req.body.payer;
    const points = parseInt(req.body.points);
    const date = req.body.timestamp;
    let newT = {};

    //Find the user
    Account.findOne({user: name}, (error, foundUser) => {

        //If the user doesn't exit 
        if(foundUser === null){
            //creat the user
            //If points is a negetive value set innital points to zero
            const newAcc = {user: name, points: points < 0 ? 0 : points};
            Account.create(newAcc, (error, newAccount) => {
                newT = {
                    payer: newAccount._id, 
                    points: newAcc.points, 
                    timestamp: date 
                }

                //Record transaction
                Transaction.create(newT, (error, createdTransaction) => {
                    res.send(`Account Created and Transaction recorded: ${newAcc.user} for ${points} points at ${date}`);
                });

            });

        } else { //add the points to the user - record transaction
            foundUser.points = foundUser.points+points;
            foundUser.save();

            newT = {payer: foundUser._id, points: points, timestamp: date}
            Transaction.create(newT, (error, createdTransaction) => {
                res.send(`Transaction recorded: ${foundUser.user} for ${points} points at ${date}`);
            });
        }    
    });
});



module.exports = transactionRouter;