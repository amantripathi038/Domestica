const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        default: 'Anonymous'
    },
    email: {
        type: String,
        required: [true, 'Please provide a valid email address.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address.'],
        index: true
    },
    contact: {
        type: String,
        validate: {
            validator: function (value) {
                // Check if the value is a valid 10-digit number starting with 6, 7, 8, or 9
                return /^[6-9]\d{9}$/.test(value);
            },
            message: 'Mobile number is not valid.'
        },
        default: ""
    },
    photo: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    currentLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    address: {
        addressLine1: {
            type: String,
            default: ""
        },
        addressLine2: {
            type: String,
            default: ""
        },
        landmark: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        }
    },
    tailoredServices: [{
        type: mongoose.Schema.ObjectId,
        ref: 'TailoredService'
    }]
}, { timestamps: true });

//Hash Password
customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

customerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;