'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET,{
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

router.post('/login', localAuth, (req,res)=>{
  console.log(req.user);
  let user ={
    id: req.user._id,
    username: req.user.username,
    name: req.user.name || ''
  };
  const authToken = createAuthToken(user);
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.post('/refresh', jwtAuth, (req,res)=>{
  let user ={
    id: req.user._id,
    username: req.user.username,
    name: req.user.name || ''
  };
  const authToken = createAuthToken(user);
  res.json({authToken});
});

module.exports = router;