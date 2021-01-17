const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const redis = require('redis');
const uuid = require('uuid').v4;

// load environment variables from .env file
dotenv.config();

// initialize express
const app = express();
app.use(cookieParser());
app.use(express.json());

// initialize redis
const dbClient = redis.createClient();

// read cookies from request and return corresponding session
// should probably be changed to use querystrings or something
app.get(function (req, res) {
    // get JWT from cookies
    let token = req.cookies['jwt'];

    // decode and verify JWT
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) res.status(400).json(err);

        // look up 'sid' field of JWT in Redis DB
        dbClient.get(decoded.sid, function (err, reply) {
            if (err) res.status(400).json(err);

            // return session info retrieved from DB
            res.json(JSON.parse(reply));
        });
    });
});

// create a new session
// needs to be changed to support custom session time-to-live
app.post(function (req, res) {
    // create a unique, random session ID
    let sid = uuid();
    
    // save session info (arbitrary JSON) to DB
    dbClient.set(sid, JSON.stringify(req.body), function (err, reply) {
        if (err) res.status(400).json(err);
    });

    // create and sign new JWT containing the session ID
    jwt.sign({ sid: sid }, process.env.SECRET, function (err, token) {
        if (err) res.status(400).json(err);

        // reply with JWT
        // idk if parsing this matters, but better safe than sorry
        res.json(JSON.parse(token)); 
    });
});