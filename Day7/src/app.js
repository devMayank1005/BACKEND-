//server ko create krna
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Note = require('./models/notes.model');

//middleware
app.use(bodyParser.json());


app.post('/notes', async (req, res) => {

    const{title, description} = req.body;
    
   const note = await Note.create({title, description})
    .then(() => console.log('Note created'))
    .catch((err) => console.error(err));
    
    res.status(201).json({ message: 'Note added successfully', note });
   

});

app.get('/notes', async (req, res) => {
    const notes = await Note.find()
    .then((notes) => res.status(200).json({notes: notes}))
    .catch((err) => console.error(err));
});


module.exports = app;