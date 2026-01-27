const express = require('express'); // express import kar liya

const app = express(); // server created

app.use(express.json()); // middleware

module.exports = app; // ✅ EXPORT APP (THIS LINE WAS MISSING)
