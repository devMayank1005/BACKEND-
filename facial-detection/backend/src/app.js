const express = require('express'); 
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cookieParser());


app.use(express.json());
app.use(cors({
    origin: frontendOrigin,
    credentials: true, // Allow cookies to be sent
}));

const authRouter = require('./routes/auth.route'); 
const songRouter = require('./routes/song.route');

app.use('/api/auth',authRouter);
app.use('/api/songs',songRouter);   





module.exports = app;