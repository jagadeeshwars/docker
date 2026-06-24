const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const auth = require('../middleware/auth');

// Protected routes
router.post('/', auth, bookingController.bookTicket);
router.get('/my-bookings', auth, bookingController.getUserBookings);

module.exports = router;
