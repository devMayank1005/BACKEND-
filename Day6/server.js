//server start karna
//
require('dotenv').config(); // 🔥 must be at top

const app = require('./src/app');// app import kar liya

const mongoose = require('mongoose');// mongoose import kar liya

function connectDB() {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB connected");
    })
    .catch((err) => {
      console.error("DB connection error:", err.message);
      process.exit(1); // ❗ stop server if DB fails
    });
}



const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); // server start kar diya
connectDB();// DB connect kar diya