'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db/db-mongoose');
// const {dbConnect} = require('.db/db-knex');

//routes to users and authentication
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes')

const {localStrategy, jwtStrategy} = require('./utils/strategies');

const app = express();

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(express.json());


app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

//mount routers
app.use('/api/users', usersRouter);
app.use('/auth', authRouter);
app.use('/api/notes', notesRouter)

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
