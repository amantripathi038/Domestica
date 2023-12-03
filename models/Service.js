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
    ratings: {
        numberOfRatings: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0,
            max: 5
        }
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

serviceSchema.statics.getNearbyServices = async function (distance, lnglat, serviceType) {
    const pipeline = [
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: lnglat
                },
                distanceField: "distance",
                maxDistance: distance * 1000,
                spherical: true
            }
        },
        {
            $lookup: {
                from: 'workers',
                let: { workerId: "$workerId" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$workerId"] }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            photo: 1,
                            ratings: 1
                        }
                    }
                ],
                as: 'worker'
            }
        },
        {
            $unwind: {
                path: "$worker",
                preserveNullAndEmptyArrays: true // If there is no matching worker
            }
        }
    ];

    if (serviceType) {
        pipeline.push({
            $match: {
                serviceName: serviceType // Add any other conditions if needed
            }
        });
    }
    return await this.aggregate(pipeline);
};


const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;