const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.ObjectId,
        index: true,
        required: [true, "Please login to create new service."],
        ref: 'Worker'
    },
    serviceName: {
        type: String,
        required: [true, "Service must have a name"],
        enum: ['cook', 'maid', 'sweeper', 'labour', 'mistri', 'others']
    },
    serviceDescription: {
        type: String
    },
    pricePerDay: {
        type: Number
    },
    pricePerWeek: {
        type: Number
    },
    pricePerMonth: {
        type: Number
    },
    serviceIsAvailable: {
        type: Boolean,
        default: true,
        index: true,
    },
    numberOfViews: {
        type: Number,
        index: true,
        default: 0,
    },
    featured: {
        type: Boolean,
        default: false,
        index: true,
    }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;