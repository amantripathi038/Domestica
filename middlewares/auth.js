const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwtMethods = require('./../utils/jwtMethods');
const Customer = require('./../models/Customer');
const Worker = require('./../models/Worker');

module.exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    const _id = jwtMethods.verifyJWTToken(token);

    // 3) Check if user still exists
    let currentUser;
    if (req.userType === 'customer') currentUser = await Customer.findById(_id);
    else if (req.userType === 'worker') currentUser = await Worker.findById(_id);
    else return next(new AppError('Invalid user type', 401));

    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});