const router = require('express').Router();
const utils = require('../utils');

// validate a JWT and retrieve the corresponding session data
// jwt and dbClient are defined in index.js
router.get(function (req, res) {
    // get JWT from querystring
    let token = req.query.jwt;

    // decode and verify JWT
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        utils.handleError(err, res);

        // look up 'sid' field of JWT in Redis DB
        dbClient.get(decoded.sid, function (err, reply) {
            utils.handleError(err, res);

            // return session info retrieved from DB
            res.send(reply);
        });
    });
});

module.exports = router;