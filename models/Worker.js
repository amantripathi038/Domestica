const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Service = require('./Service')

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a valid worker name."]
    },
    aadhaar: {
        type: String,
        required: [true, 'Please provide a valid aadhaar number.'],
        validate: {
            validator: function (value) {
                // Check if the value is a valid 12-digit number.
                return /^\d{12}$/.test(value);
            },
            message: 'Aadhar must have 12 digits.'
        },
        index: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        index: {
            unique: true,
            partialFilterExpression: { email: { $exists: "true" } }
        },
        validate: [validator.isEmail, 'Please provide a valid email address.']
    },
    contact: {
        type: String,
        required: [true, 'Please provide a valid contact number.'],
        validate: {
            validator: function (value) {
                // Check if the value is a valid 10-digit number starting with 6, 7, 8, or 9
                return /^[6-9]\d{9}$/.test(value);
            },
            message: 'Mobile number is not valid.'
        },
        index: true
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
    services: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Service'
    }]
}, { timestamps: true });

//Hash Password
workerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

workerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

workerSchema.statics.getNearbyWorkers = async function (distance, lnglat) {
    return await this.find({
        currentLocation: { $geoWithin: { $centerSphere: [lnglat, distance / 6378.1] } }
    }).select('-password -createdAt -updatedAt -__v');
}

workerSchema.statics.getNearbyServices = async function (distance, lnglat) {
    return this.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: lnglat },
                distanceField: "distance",
                maxDistance: distance * 1000, // Convert distance to meters
                spherical: true
            }
        },
        {
            $project: {
                services: 1,
                distance: 1
            }
        },
        {
            $lookup: {
                from: "services", // Replace with the actual name of the services collection
                localField: "services",
                foreignField: "_id",
                as: "services"
            }
        }
    ]);
}

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;