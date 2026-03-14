require('dotenv').config();   // MUST be first

const app = require('./src/app');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const connectToDb = require('./src/config/db');

connectToDb();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});