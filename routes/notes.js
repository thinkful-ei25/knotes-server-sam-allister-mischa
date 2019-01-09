'use strict';
const express = require('express');
const User = require('../models/users');
const router = express.Router();
const passport = require('passport');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.put('/update',(req,res)=>{
  console.log(req.body);
  const id = req.user.id;
  User.findOneAndUpdate({_id: id},{$set:{notes:req.body}})
    .then(user=>{
      res.status(201).json(user);
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({message:'Internal Server Error'});
    });
});

router.put('/mScore/correct',(req,res)=>{
  const id = req.user.id;
  const i = req.body.i;
  User.findOne({_id:id})
    .then(user=>{
      user.notes[i].mScore = (user.notes[i].mScore*2)+1;
      user.notes.sort((a,b)=>a.mScore-b.mScore);
      return user.save();
    })
    .then(sorted =>{
      console.log('sorted', sorted);
      res.send(sorted);
    });
});

router.put('/mScore/incorrect', (req,res)=>{
  const id = req.user.id;
  const i = req.body.i;
  User.findOne({_id: id})
    .then(user=>{
      user.notes[i].mScore = 1;
      user.notes = [...user.notes.slice(1,6),user.notes[0], ...user.notes.slice(6)];
      return user.save();
    })
    .then(sorted =>{
      console.log('sorted', sorted);
      res.send(sorted);
    });

});

module.exports = router;
