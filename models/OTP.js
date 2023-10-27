const mongoose = require('mongoose');
const otpMethods = require('./../utils/otpMethods');
const AppError = require('../utils/appError');
const validator = require('validator');

const OTPSchema = mongoose.Schema({
    email: {
        type: String,
        index: true,
        validate: [validator.isEmail, 'Please provide a valid email address.'],
    },
    contact: {
        type: String,
        index: true,
        validate: {
            validator: function (value) {
                // Check if the value is a valid 10-digit number starting with 6, 7, 8, or 9
                return /^[6-9]\d{9}$/.test(value);
            },
            message: 'Mobile number is not valid.'
        }
    },
    OTP: {
        type: Number,
        min: 100000,
        max: 999999
    },
    createdAt: {
        type: Date,
        expires: '5m',
        default: Date.now
    }
})

OTPSchema.pre("save", async function () {
    this.OTP = otpMethods.generateOTP();
});

OTPSchema.post("save", async function () {
    await otpMethods.sendOTP(this.OTP, this.email);
})

OTPSchema.methods.verifyOTP = async function (OTP) {
    if (otpMethods.verifyOTP(this.OTP, OTP)) {
        const email = this.email;
        const contact = this.contact;
        await this.model('Otp').deleteMany({ $or: [{ email }, { contact }] });
        return { email, contact };
    }
    throw new AppError('OTP verification failed', 401);
}


const OTP = mongoose.model('Otp', OTPSchema);

module.exports = OTP;