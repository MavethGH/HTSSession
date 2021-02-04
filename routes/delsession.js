const router = require('express').Router();
const utils = require('../utils');

// delete a session, forcing a user to log in again
// currently expects a JWT; in the future the SID only will work too
// jwt and dbClient are defined in index.js
router.get(function (req, res) {
    // get JWT from querystring
    let token = req.query.jwt;

    // decode JWT to get SID
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        handleError(err, res);

        // try to delete all session data associated with the SID
        dbClient.del(decoded.sid, function (err, reply) {
            handleError(err, res);

            // should be 0 if key did not exist, and 1 if key was deleted.
            // handleError should instead return info about what went wrong
            res.send(reply);
        });
    });
});

module.exports = router;