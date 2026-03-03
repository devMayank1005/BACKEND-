const express = require('express');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user.model');

 const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const app = express();

app.use(express.json());
app.use(cookieParser());   
 

// require routes
const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');  
const userRouter = require('./routes/user.route');


// use routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);




module.exports = app;