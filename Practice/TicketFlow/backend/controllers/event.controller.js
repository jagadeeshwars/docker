const Event = require('../models/Event');
const redisClient = require('../config/redis');

exports.getEvents = async (req, res) => {
    try {
        const cacheKey = 'events_list';
        
        // Try to get from cache
        const cachedEvents = await redisClient.get(cacheKey);
        if (cachedEvents) {
            return res.json(JSON.parse(cachedEvents));
        }

        const events = await Event.findAll();
        
        // Save to cache for 1 hour (3600 seconds)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(events));
        
        res.json(events);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.createEvent = async (req, res) => {
    try {
        // Admin check should be in middleware, but just double checking
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, description, date, location, total_tickets, price } = req.body;

        const event = await Event.create({
            title, description, date, location, total_tickets, price
        });

        // Initialize redis ticket counter for atomic decrements
        await redisClient.set(`event:${event.id}:tickets`, total_tickets);

        // Invalidate events cache
        await redisClient.del('events_list');

        res.status(201).json(event);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
