const Booking = require('../models/Booking');
const Event = require('../models/Event');
const redisClient = require('../config/redis');

exports.bookTicket = async (req, res) => {
    try {
        const { event_id, quantity } = req.body;
        const user_id = req.user.id;

        const event = await Event.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Concurrency control: Atomic decrement using Redis
        const ticketKey = `event:${event_id}:tickets`;
        
        // Ensure the key exists in Redis (fallback if it was evicted)
        let currentTicketsStr = await redisClient.get(ticketKey);
        if (!currentTicketsStr) {
            // Count from DB
            const allBookings = await Booking.sum('quantity', { where: { event_id } }) || 0;
            const available = event.total_tickets - allBookings;
            await redisClient.set(ticketKey, available);
            currentTicketsStr = available.toString();
        }

        if (parseInt(currentTicketsStr) < quantity) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        // Decrement atomically
        const remaining = await redisClient.decrBy(ticketKey, quantity);
        
        if (remaining < 0) {
            // Revert the decrement if we went below zero
            await redisClient.incrBy(ticketKey, quantity);
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        const total_price = event.price * quantity;

        const booking = await Booking.create({
            user_id,
            event_id,
            quantity,
            total_price,
            status: 'confirmed'
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Event }]
        });
        res.json(bookings);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
