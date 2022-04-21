require("dotenv").config();

const express = require('express');
const app = express();
const {PORT=4000, MONGODB_URL} = process.env;

//While a database isn't needed I figured you'd prefer to see one
//As the job ad had mongodb and a few others were listed.


const mongoose = require('mongoose');

mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));


//Models
const Account = require('./models/Account');
const Transaction = require('./models/Transaction');

//Controllers
const accountController = require('./controllers/accounts');
const transactionController = require('./controllers/transactions');

/////////////////////////////////////
//          Middleware
////////////////////////////////////

app.use(express.json());

app.use('/t', transactionController);
app.use('/a', accountController);


//Index / Home route
app.get('/', (req, res) => {
    res.send(`Fetch Backend Test
    Use /a Get for account balaces - Delete to delete all accounts
    Use /t Post to add a transaction, Put to spend, and Delete to delete all accounts `);
});

app.listen(PORT, () => console.log(`listening on PORT: ${PORT}`));