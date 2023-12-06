const { updateUserName, updateUserLocation, getMe } = require('../controllers/factoryMethods');
const { sendOTP, verifyOTP, login, getNearbyWorkers, getNearbyServices, updateName, getWorkerById, uploadUserImage } = require('./../controllers/customerController');
const auth = require('./../middlewares/auth');

const Router = require('express').Router();

Router.post('/auth', sendOTP);
Router.post('/auth/verify', verifyOTP);
Router.post('/auth/login', login);

Router.use('/', (req, res, next) => {
    req.userType = 'customer';
    next();
}, auth.protect);

Router.get('/worker', getWorkerById);
Router.get('/getMe', getMe);
Router.get('/nearbyWorkers', getNearbyWorkers);
Router.get('/nearbyServices', getNearbyServices);

Router.post('/updateName', updateUserName);
Router.post('/updateProfile', uploadUserImage);
Router.post('/updateLocation', updateUserLocation);

module.exports = Router;