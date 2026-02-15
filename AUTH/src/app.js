const express = require('express'); 
const authRouter = require('../routes/auth.route');
const cookieParser = require('cookie-parser'); 
const dotenv = require('dotenv');
dotenv.config();


const userModel = require('../model/user.model');
 const app = express();
app.use(cookieParser());


app.use(express.json());

app.use('/api/auth',authRouter); // auth route





module.exports = app;