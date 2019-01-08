'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const Note = require('../models/notes');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', (req,res)=>{
  return Note.find()
    .then(notes => res.json(notes.map(note => note.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));

});

module.exports = router;

