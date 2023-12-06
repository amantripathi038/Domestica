const { updateUserName, updateUserLocation, getMe } = require('../controllers/factoryMethods');
const { sendOTP, verifyOTP, login, uploadUserImage } = require('./../controllers/workerController');
const auth = require('./../middlewares/auth');

const serviceRoute = require('./serviceRoute');
const Router = require('express').Router();

Router.post('/auth', sendOTP);
Router.post('/auth/verify', verifyOTP);
Router.post('/auth/login', login);

Router.use('/', (req, res, next) => {
    req.userType = 'worker';
    next();
}, auth.protect);

Router.get('/getMe', getMe);
Router.post('/updateProfile', uploadUserImage);
Router.post('/updateName', updateUserName);
Router.post('/updateLocation', updateUserLocation);

Router.use('/service', serviceRoute);

module.exports = Router;