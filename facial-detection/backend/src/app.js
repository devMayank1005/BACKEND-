const express = require('express'); 
const cookieParser = require('cookie-parser');
const authController = require('./controller/auth.controller'); 
const authRouter = require('./routes/auth.route'); 
const cors = require('cors');




const userModel = require('./model/user.model');
 const app = express();
app.use(cookieParser());


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies to be sent
}));


app.use('/api/auth',authRouter);





module.exports = app;