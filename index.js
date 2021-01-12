const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const redis = require('redis');

// load environment variables from .env file
dotenv.config();

// initialize express
const app = express();
app.use(cookieParser());

// initialize redis
const dbClient = redis.createClient(); 

// map session IDs to user information
app.use('/', function (req, res) {
    // get JWT from cookies
    let token = req.cookies['jwt'];

    // decode and verify JWT
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) res.status(400).json(err);
        token = decoded;
    });

    // look up 'sid' field of JWT in Redis DB
    dbClient.get(token.sid, function (err, reply) {
        if (err) res.status(400).json(err);
        // return session info retrieved from DB
        res.json(JSON.parse(reply));
    });
});