const express = require('express');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user.model');

const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');  
 const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const app = express();

app.use(express.json());
app.use(cookieParser());   
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);



module.exports = app;