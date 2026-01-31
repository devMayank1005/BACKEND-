//server ko create krna
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const noteModel = require('./models/notes.model');  
const mongoose = require('mongoose');

// post 
app.use(bodyParser.json());
// creare new note and save to db
//req.body => {title, description}

app.post('/api/notes', async (req, res) => {
    const { title, description } = req.body;

    const note = await noteModel.create({ title, description });

    res.status(201).json({
        message: "Note created successfully",
        note    
    });

});

// get
// fetch all notes from db
app.get('/api/notes', async (req, res) => {
    const notes = await noteModel.find();

    res.status(200).json({
        message: "Notes fetched successfully",
        notes
    });
});

// delete
// delete note by id
app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;

    await noteModel.findByIdAndDelete(id);

    res.status(200).json({
        message: "Note deleted successfully"
    });
});

// patch
// update note by id
app.patch('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const note = await noteModel.findByIdAndUpdate(id, { title, description }, { new: true });

    res.status(200).json({
        message: "Note updated successfully",
        note
    });
}    
);

module.exports = app;