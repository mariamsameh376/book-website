const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        required: true,
        enum: ['hourly', 'point', 'airport']
    },
    pickupDate: {
        type: Date,
        required: true
    },
    pickupTime: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    passengers: {
        type: Number,
        required: true,
        min: 1
    },
    luggage: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        default: 'confirmed',
        enum: ['confirmed', 'completed', 'cancelled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);