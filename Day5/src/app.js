const express = require('express')
const { stat } = require('node:fs')
const app = express() // server created
app.use(express.json()) // middleware to parse JSON request body

const notes = []


// post method to add a note
app.post('/notes', (req, res) => {
    console.log(req.body)
    const note = req.body
    notes.push(note)
    res.status(201).json({ message: 'Note added successfully' })
})

// get method to fetch all notes
app.get('/notes', (req, res) => {
    res.status(200).json({notes: notes})
})

// delete method to delete a note by index
app.delete('/notes/:index', (req, res) => {
 res.status(200).json({message: 'Note deleted successfully'})
})  


// patch method to update a note by index
app.patch('/notes/:index', (req, res) => {
    const index = req.params.index
    const updatedNote = req.body
    notes[index] = {...notes[index], ...updatedNote}
    res.status(200).json({message: 'Note updated successfully'})
})  

module.exports = app