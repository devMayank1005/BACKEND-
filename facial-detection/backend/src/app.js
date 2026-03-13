const express = require('express'); 
const cookieParser = require('cookie-parser'); 



const userModel = require('./model/user.model');
 const app = express();
app.use(cookieParser());


app.use(express.json());






module.exports = app;