require('dotenv').config();   // MUST be first

const app = require('./src/app');
const connectToDb = require('./src/config/db');
const port = process.env.PORT || 3000;

connectToDb();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});