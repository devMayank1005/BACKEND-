// server ko start krna

// db sai connection krna
require('dotenv').config();

const { env } = require('node:process');
const app = require('./src/app');

const mongoose = require('mongoose');

function connectToDb() {
    mongoose.connect(env.MONGO_URI).then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        console.log("Error connecting to DB", err);
    });
}
    
connectToDb();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});