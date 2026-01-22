const express = require('express');// import express module
const { log } = require('node:console');


const app = express();// server instance creation

app.use(express.json());// middleware to parse JSON request bodies
const notes = [
    { id: 1, content: 'Note 1' },
    { id: 2, content: 'Note 2' },
    { id: 3, content: 'Note 3' }
];// sample notes data





app.post('/notes', (req, res) => {
    const newNote = {
        id: notes.length + 1,
        content: `Note ${notes.length + 1}`
    };

    console.log(req.body);// log request body to console
   console.log(newNote);
    notes.push(newNote);
    res.status(201).send(newNote);
});// create note route handler

app.get('/notes', (req, res) => {
    res.send(notes);
});// get all notes route handler   


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});// server listening on port 3000