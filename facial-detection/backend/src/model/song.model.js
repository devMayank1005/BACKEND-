const mongoose = require('mongoose');

const ALLOWED_MOODS = ['happy', 'sad', 'surprised', 'angry', 'neutral'];

const songSchema = new mongoose.Schema({
url: {
    type: String,
    required: true
  },
posterUrl: {
    type: String,
  required: false
  },
title: {
    type: String,
    required: true
  },
 mood: {
    type: String,
    enum: ALLOWED_MOODS,
    required: true
  }
});

const songModel = mongoose.model('Songs', songSchema);

module.exports = songModel;  