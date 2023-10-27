const jwt = require('jsonwebtoken');
const AppError = require('./appError');
const removeUnwantedFields = require('./removeUnwantedFields');

module.exports.getJWTToken = function (data, time) {
    return jwt.sign({ data: data }, process.env.JWT_SECRET, {
        expiresIn: time || process.env.JWT_EXPIRE
    })
}

module.exports.verifyJWTToken = function (token) {
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        return decodedData.data;
    } catch (err) {
        throw new AppError('Authentication failed', 401);
    }
}

module.exports.createAndSendJWTToken = function (res, user, status = 200) {
    user = user.toObject();
    const token = this.getJWTToken(user._id);
    user = removeUnwantedFields(user);
    res.status(status).json({
        message: "Success",
        user: user,
        token: token
    })
}