const { sendOTP, verifyOTP, login } = require('./../controllers/workerController');
const auth = require('./../middlewares/auth')

const serviceRoute = require('./serviceRoute')
const Router = require('express').Router();

Router.post('/auth', sendOTP);
Router.post('/auth/verify', verifyOTP);
Router.post('/auth/login', login);

Router.use('/', (req, res, next) => {
    req.userType = 'worker';
    next();
}, auth.protect);

Router.use('/service', serviceRoute);

module.exports = Router;