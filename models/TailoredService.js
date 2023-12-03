const mongoose = require('mongoose');

const tailoredServiceSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.ObjectId,
        index: true,
        required: [true, "Please login to create new service."],
        ref: 'Customer'
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere' // Ensure proper indexing for geospatial queries
        }
    },
    serviceName: {
        type: String,
        required: [true, "Service must have a name"]
    },
    serviceDescription: {
        type: String
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
})

const TailoredService = mongoose.model('TailoredService', tailoredServiceSchema);

module.exports = TailoredService;