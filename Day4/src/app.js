// server create karna 
// server ko config karna

const express = require('express');
const { title } = require('node:process');


const app = express() // server created
app.use(express.json()) // middleware to parse JSON request body

const notes = [
    {
        title: "My first note",
        body: "This is my first note",
        description: "First note description"
    },
    {
        title: "My second note",
        body: "This is my second note",
        description: "Second note description"
    }
]


app.get('/', (req, res) => {
    res.send('Hello from Express server')
}) // root route

app.post('/notes', (req, res) => {
    console.log(req.body)
    notes.push(req.body)    

    console.log(notes) 
    res.json('Create a new note')
}) // create a new note 


app.get('/notes', (req, res) => {
    
    res.json(notes)
}) // fetch a single note by id

app.put('/notes', (req, res) => {
   
    res.json(notes)
}) // update a note by id

app.delete('/notes/:index', (req, res) => {
    delete notes[req.params.index]

    // notes.splice(req.params.index, 1)
    
    res.json(notes)
}) // delete a note by id
app.patch('/notes/:index', (req, res) => {
    
    
 notes[req.params.index].description = req.body.description

    res.json(notes)
}) // update a note by id


module.exports = app