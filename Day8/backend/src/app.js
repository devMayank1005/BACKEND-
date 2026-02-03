const express = require('express');
const cors = require('cors');
const path = require('path');

const noteModel = require('./models/notes.model');

const app = express();

/* middleware */
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

/* serve frontend build */
app.use(express.static(
  path.join(__dirname, '../public')
));

/* API routes */
app.post('/api/notes', async (req, res) => {
  const { title, description } = req.body;

  const note = await noteModel.create({ title, description });

  res.status(201).json({
    message: "Note created successfully",
    note
  });
});

app.get('/api/notes', async (req, res) => {
  const notes = await noteModel.find();

  res.status(200).json({
    message: "Notes fetched successfully",
    notes
  });
});

app.delete('/api/notes/:id', async (req, res) => {
  await noteModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Note deleted successfully"
  });
});

app.patch('/api/notes/:id', async (req, res) => {
  const { title, description } = req.body;

  const note = await noteModel.findByIdAndUpdate(
    req.params.id,
    { title, description },
    { new: true }
  );

  res.status(200).json({
    message: "Note updated successfully",
    note
  });
});

/* SPA fallback — VERY IMPORTANT */
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../public/index.html')
  );
});



module.exports = app;
