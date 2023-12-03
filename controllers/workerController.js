const Worker = require('./../models/Worker');
const OTP = require('./../models/OTP');
const jwtMethods = require('./../utils/jwtMethods');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

module.exports.sendOTP = catchAsync(async function sendOTPandCreateOTPInstance(req, res) {
    if (await Worker.findOne({ email: req.body.email })) throw new AppError('Account already exists', 400);
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
        currentLocation: req.body.currentLocation, aadhaar: req.body.aadhaar
    };
    const worker = await Worker.create(obj);
    jwtMethods.createAndSendJWTToken(res, worker, 201);
})

module.exports.login = catchAsync(async function (req, res) {
    const { email, password } = req.body;
    const user = await Worker.findOne({ email: email }).select('+password').populate('services');
    if (user?.comparePassword(password)) {
        jwtMethods.createAndSendJWTToken(res, user);
    }
    else throw new AppError("Invalid email or password", 401);
})