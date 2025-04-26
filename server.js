const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const stripe = require('stripe')('your_stripe_secret_key');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Temporary storage for bookings
let bookings = [];

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Calculate booking price
function calculatePrice(bookingData) {
    let basePrice = 100;
    if (bookingData.tripType === 'hourly') {
        return basePrice * (bookingData.hoursCount || 3);
    } else {
        let price = basePrice * 2;
        if (bookingData.stops && bookingData.stops.length > 0) {
            price += bookingData.stops.length * 20;
        }
        return price;
    }
}

// Booking endpoint
app.post('/api/bookings', (req, res) => {
    const bookingData = req.body;
    bookingData.price = calculatePrice(bookingData);
    bookingData.id = Date.now();
    bookings.push(bookingData);
    
    res.json({
        success: true,
        bookingId: bookingData.id,
        price: bookingData.price
    });
});

// Payment endpoint
app.post('/api/payments', async (req, res) => {
    const { bookingId, amount, cardNumber, expiryDate, cvv } = req.body;
    
    try {
        const cardToken = await stripe.tokens.create({
            card: {
                number: cardNumber,
                exp_month: expiryDate.split('/')[0],
                exp_year: expiryDate.split('/')[1],
                cvc: cvv
            }
        });
        
        const charge = await stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            source: cardToken.id,
            description: `Charge for booking #${bookingId}`
        });
        
        const bookingIndex = bookings.findIndex(b => b.id == bookingId);
        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'paid';
            bookings[bookingIndex].paymentAmount = amount;
            bookings[bookingIndex].paidAt = new Date();
            bookings[bookingIndex].stripeChargeId = charge.id;
            
            // Send confirmation email
            await sendConfirmationEmail(bookings[bookingIndex]);
        }
        
        res.json({
            success: true,
            message: 'Payment processed successfully',
            chargeId: charge.id
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Payment failed'
        });
    }
});

// Email sending function
async function sendConfirmationEmail(booking) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: booking.email || 'customer@example.com',
        subject: `Booking Confirmation #${booking.id}`,
        html: `
            <h1>Your Booking is Confirmed!</h1>
            <p>Booking ID: #${booking.id}</p>
            <p>Amount Paid: $${booking.paymentAmount}</p>
            <p>Pickup Location: ${booking.pickupAddress}</p>
            <p>Pickup Time: ${new Date(booking.pickupTime).toLocaleString()}</p>
        `
    };
    
    await transporter.sendMail(mailOptions);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
