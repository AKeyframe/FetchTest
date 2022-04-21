# Using My Solution

- Install the latest version of nodejs (I personally like to use nvm for this. [link to nvm](https://github.com/nvm-sh/nvm))
- Download my solution, extract, and place in desired location.
- Once npm is installed, within my soluction directory run: 
    - npm init -yes (if the node_modules directory exists skip this step) 
    - npm i express mongoose dotenv

- Next retrieve your mongodb connection string, after signing up or through an already established cluster. If creating a new account, follow mongodbs guide to setting up a cluster, should pop up directly after sign up. The connection string can be found as an option when trying to connect to the clusterce (connect your application). The code should look something like this: (your link will be differrent and <> are personal information, so it's not included here)
    - mongodb+srv://<>@cluster0.tjqi7.mongodb.net/<>?retryWrites=true&w=majority

- Create a .env file to the main directory
    - Inside add MONGODB_URL=
    - directly after the = add your connection string.
    - On a new line add PORT=4000
- Make sure everything is saved
- Run the sever in the command window. 
    - node server.js 
    - while inside the main directory
- Use Postman, curl, or other means to acces the routes

http://localhost:4000/ 

- The / has basic instructions
- 4000/t is for transactions and spending
    - /t POST to add transaction
    - /t PUT to spend
    - /t DELETE to delete all transactions
- 4000/a is for account point totatls
    - /a DELETE to delete all accounts