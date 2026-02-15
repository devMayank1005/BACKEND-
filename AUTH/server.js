const app = require('./src/app');
require('dotenv').config();

const cookieParser = require('cookie-parser');
app.use(cookieParser());



const connectToDb = require('./src/config/database');   
const { env } = require('node:process');
const mongoose = require('mongoose');


    
connectToDb();

mongoose.connection.once('open', () => {
    console.log("Connected to database:", mongoose.connection.name);
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});     
