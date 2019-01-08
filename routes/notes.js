'use strict';
const express = require('express');
const User = require('../models/users');
const router = express.Router();
const passport = require('passport');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


router.get('/', (req, res) => {
  let id = req.user.id;
  User.findOne({_id: id})
    .then((user) => {
        const {notes, next} = user;
        const returnNote = notes.filter(note => {
            if(note.note === next){
                return note;
            }
        })
        res.json(returnNote[0])
    })
    .catch(err => {
      console.log(err);
    });
});



module.exports = router;
