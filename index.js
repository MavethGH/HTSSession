// dependencies
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const redis = require('redis');
const uuid = require('uuid').v4;

// routes
const getsession = require('routes/getsession');
const setsession = require('routes/setsessions');

// load environment variables from .env file
dotenv.config();

// initialize express
const app = express();
app.use(express.json());

// initialize redis
const dbClient = redis.createClient();

// configure routes
app.use('/getsession', getsession);
app.use('/setsession', setsession);

// listen on port specified in environment variable
app.listen(proces.env.PORT);