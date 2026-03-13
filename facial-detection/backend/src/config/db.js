const mongoose = require('mongoose');


const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit the process with an error code
    }
};

module.exports = connectToDb;

