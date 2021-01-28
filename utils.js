module.exports = {
    //reply to failed API call with error message
    handleError: function (err, res) {
        if (err) {
            res.status(400).json(err);
        }
    },
};