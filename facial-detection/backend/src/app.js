const express = require('express'); 
const cookieParser = require('cookie-parser');
const authController = require('./controller/auth.controller'); 

const cors = require('cors');




const userModel = require('./model/user.model');
 const app = express();
app.use(cookieParser());


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies to be sent
}));

const authRouter = require('./routes/auth.route'); 
const songRouter = require('./routes/song.route');

app.use('/api/auth',authRouter);
app.use('/api/songs',songRouter);   





module.exports = app;