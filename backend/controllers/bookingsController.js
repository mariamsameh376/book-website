const Booking = require('../models/Booking');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createBooking = async (req, res) => {
    try {
        const { serviceType, pickupDate, pickupTime, pickupLocation, passengers, luggage } = req.body;
        
        if (!serviceType || !pickupDate || !pickupTime || !pickupLocation) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newBooking = new Booking({
            serviceType,
            pickupDate: new Date(pickupDate),
            pickupTime,
            pickupLocation,
            passengers: parseInt(passengers),
            luggage: parseInt(luggage),
            status: 'confirmed',
            createdAt: new Date()
        });

        const savedBooking = await newBooking.save();

        // Send confirmation email
        const msg = {
            to: req.body.email || 'customer@example.com',
            from: process.env.EMAIL_FROM || 'bookings@limoservice.com',
            subject: 'Your Limousine Booking Confirmation',
            html: `<p>Your booking for ${pickupDate} at ${pickupTime} has been confirmed!</p>`
        };

        await sgMail.send(msg);

        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking' });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};