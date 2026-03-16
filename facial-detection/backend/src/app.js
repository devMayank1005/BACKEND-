const express = require('express'); 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: frontendOrigin,
    credentials: true,
}));

const authRouter = require('./routes/auth.route'); 
const songRouter = require('./routes/song.route');

app.use('/api/auth', authRouter);
app.use('/api/songs', songRouter);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {

    const distPath = path.join(__dirname, '../../frontend/dist');

    app.use(express.static(distPath));

    app.use((req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

module.exports = app;