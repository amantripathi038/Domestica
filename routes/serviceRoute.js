const { getServicesOfWorker, createServiceOfWorker } = require('../controllers/serviceController');

const Router = require('express').Router();

Router
    .route('/')
    .get(getServicesOfWorker)
    .post(createServiceOfWorker);

module.exports = Router;