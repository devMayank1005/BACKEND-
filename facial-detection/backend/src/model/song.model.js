const mongoose = require('mongoose');
const { url } = require('node:inspector');

const songSchema = new mongoose.Schema({
url: {
    type: String,
    required: true
  },
posterUrl: {
    type: String,
    required: true
  },
title: {
    type: String,
    required: true
  },
 mood: {
    type: String,
    enum: ['happy', 'sad', 'surprised'],
    message:"enum this is"
  }
});

const songModel = mongoose.model('Songs', songSchema);

module.exports = songModel;  