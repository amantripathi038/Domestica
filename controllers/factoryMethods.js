const Worker = require('./../models/Worker');
const Customer = require('./../models/Customer');
const removeUnwantedFields = require('./../utils/removeUnwantedFields');
const catchAsync = require('../utils/catchAsync');

module.exports.updateUserLocation = catchAsync(async function (req, res) {
    req.user.currentLocation = req.body.location;
    await req.user.save();
    res.status(200).json({
        status: 'success',
        message: 'Location updated successfully',
        location: req.user.currentLocation
    })
})

module.exports.updateUserName = catchAsync(async function (req, res) {
    req.user.name = req.body.newName;
    req.user.save();
    removeUnwantedFields(req.user);
    res.status(200).json({
        status: 'success',
        message: "Name successfully updated.",
        name: req.user.name
    })
})

module.exports.getMe = catchAsync(async function (req, res) {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    })
});