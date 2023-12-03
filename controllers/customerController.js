const Customer = require('./../models/Customer');
const Worker = require('./../models/Worker')
const OTP = require('./../models/OTP')
const catchAsync = require('./../utils/catchAsync');
const jwtMethods = require('./../utils/jwtMethods');
const AppError = require('./../utils/appError');
const removeUnwantedFields = require('../utils/removeUnwantedFields');
const Service = require('./../models/Service');
const TailoredService = require('../models/TailoredService');

module.exports.sendOTP = catchAsync(async function sendOTPandCreateOTPInstance(req, res) {
    if (await Customer.findOne({ email: req.body.email })) throw new AppError('Account already exists', 400);
    await OTP.deleteMany({ $or: [{ email: req.body.email }, { contact: req.body.contact }] });
    const user = await OTP.create({ email: req.body.email, contact: req.body.contact });
    res.status(200).json({
        message: 'OTP sent successfully',
        token: jwtMethods.getJWTToken({ email: user.email, contact: user.contact }, 300 * 1000)
    })
})

module.exports.verifyOTP = catchAsync(async function verifyOTP(req, res) {
    const token = req.headers?.authorization?.split(' ')[1];
    const data = jwtMethods.verifyJWTToken(token);
    const user = await OTP.findOne({ email: data.email });
    if (!user) throw new AppError('Unauthorized', 401);
    const { email, contact } = await user.verifyOTP(req.body.OTP);
    const obj = {
        name: req.body.name, email, contact, password: req.body.password,
        currentLocation: req.body.currentLocation
    };
    const customer = await Customer.create(obj);
    jwtMethods.createAndSendJWTToken(res, customer, 201);
})

module.exports.login = catchAsync(async function (req, res) {
    const { email, password } = req.body;
    const user = await Customer.findOne({ email: email }).select('+password');
    if (user?.comparePassword(password)) {
        jwtMethods.createAndSendJWTToken(res, user);
    }
    else throw new AppError("Invalid email or password", 401);
})

module.exports.updateName = catchAsync(async function (req, res) {
    req.user.name = req.body.newName;
    req.user.save();
    removeUnwantedFields(req.user);
    res.status(200).json({
        message: "Name successfully updated.",
        name: req.user.name
    })
})

module.exports.getNearbyWorkers = catchAsync(async function (req, res, next) {
    const distance = req.query.distance * 1 || 5; // In Kilometers
    const lnglat = req.user.currentLocation.coordinates;
    const nearbyWorkers = await Worker.getNearbyWorkers(distance, lnglat)
    res.status(200).json({
        status: 'success',
        length: nearbyWorkers.length,
        data: nearbyWorkers
    });
})

module.exports.getNearbyServices = catchAsync(async function (req, res, next) {
    const distance = req.query.distance * 1 || 5; // In Kilometers
    const lnglat = req.user.currentLocation.coordinates;
    const serviceType = req.query.serviceType;
    const nearbyServices = await Service.getNearbyServices(distance, lnglat, serviceType);
    res.status(200).json({
        status: 'success',
        length: nearbyServices.length,
        data: nearbyServices
    });
})

module.exports.createTailoredService = catchAsync(async function (req, res, res) {
    delete req.body.numberOfViews; delete req.body.featured;
    req.body.customerId = req.user._id;
    req.body.location = req.user.currentLocation;
    const tailoredService = await TailoredService.create(req.body);
    req.user?.tailoredServices.push(tailoredService._id);
    await req.user?.save();
    res.status(201).json({
        message: 'Service created successfully',
        service: tailoredService
    })
})