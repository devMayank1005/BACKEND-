const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user.model');

const app = express();

app.use(express.json());
app.use(cookieParser());   
 
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// require routes
const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');  
const userRouter = require('./routes/user.route');



// use routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);





module.exports = app;