const catchAsync = require("../utils/catchAsync");
const Service = require('./../models/Service');
const Worker = require('./../models/Worker');

module.exports.getServicesOfWorker = catchAsync(async function (req, res, next) {
    const serviceIds = req.user.services;
    const servicePromises = serviceIds.map((serviceId) => {
        return Service.findById(serviceId);
    });
    const services = await Promise.all(servicePromises);
    res.status(200).json({
        message: 'Success',
        length: services.length,
        services: services,
    })
})

module.exports.createServiceOfWorker = catchAsync(async function (req, res, next) {
    delete req.body.numberOfViews; delete req.body.featured;
    req.body.workerId = req.user._id;
    req.body.location = req.user.currentLocation;
    const service = await Service.create(req.body);
    req.user?.services.push(service._id);
    await req.user?.save();
    res.status(201).json({
        message: 'Service created successfully',
        service: service
    })
});