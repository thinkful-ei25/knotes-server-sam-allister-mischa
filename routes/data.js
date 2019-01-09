'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const Note = require('../models/notes');
const noteSeed = require('../resources/notes');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', (req,res)=>{
  Note.find()
    .then(data =>{
      if(data.length === 0){
        Note.insertMany(noteSeed);
      } else {
        return res.json(data);
      }
    }).catch(err => {
      console.log(err);      
      res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = router;

