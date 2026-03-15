const express = require('express');
const router = express.Router();
const songModel = require('../model/song.model');
const upload = require('../middleware/upload.middleware');
const songController = require('../controller/song.controller');

router.post('/add',upload.single('song'),songController.uploadSong); 
router.get('/',songController.getSong);




module.exports = router;    