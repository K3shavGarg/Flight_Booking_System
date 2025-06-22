const {StatusCodes} = require('http-status-codes');
const info = (req, res) => {

    res.status(StatusCodes.OK)
    .send({
        "success" : true,
        "message" : "This is the info endpoint for AirportService."
    })
};

module.exports = {
    info
}