const { sendOTP, verifyOTP, login, getNearbyWorkers, getNearbyServices } = require('./../controllers/customerController');
const auth = require('./../middlewares/auth');

const Router = require('express').Router();

Router.post('/auth', sendOTP);
Router.post('/auth/verify', verifyOTP);
Router.post('/auth/login', login);

Router.use('/', (req, res, next) => {
    req.userType = 'customer';
    next();
}, auth.protect);

Router.get('/nearbyWorkers', getNearbyWorkers);
Router.get('/nearbyServices', getNearbyServices);

module.exports = Router;