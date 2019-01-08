'use strict';
const express = require('express');
const User = require('../models/users');
const router = express.Router();
const passport = require('passport');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res) => {
    let UserId = req.user.id;
    User.find()
    .then(() => {

    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = router;
