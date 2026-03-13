const app = require('./src/app');
require('dotenv').config();

const cookieParser = require('cookie-parser');
app.use(cookieParser());



const connectToDb = require('./src/config/db');
const mongoose = require('mongoose');


    
connectToDb();



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});     
