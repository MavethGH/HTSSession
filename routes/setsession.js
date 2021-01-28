const router = require('express').Router();
const utils = require('../utils');

// create a new session
// needs to be changed to support custom session time-to-live
router.post(function (req, res) {
    // create a unique, random session ID
    let sid = uuid();

    // save session info (arbitrary JSON) to DB
    dbClient.set(sid, JSON.stringify(req.body), function (err) {
        utils.handleError(err, res);
    });

    // create and sign new JWT containing the session ID
    jwt.sign({ sid: sid }, process.env.SECRET, function (err, token) {
        utils.handleError(err, res);

        // reply with JWT
        res.send(token); 
    });
});

module.exports = router;