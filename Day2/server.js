const express = require('express');// import express module


const app = express();// server instance creation




app.get('/', (req, res) => {
    res.send('Hello World');
});// root route handler

app.get('/about', (req, res) => {
    res.send('About Page');
});// about route handler



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});// server listening on port 3000