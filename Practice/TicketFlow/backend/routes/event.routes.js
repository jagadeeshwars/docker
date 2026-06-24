const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const auth = require('../middleware/auth');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (Admin only for creating events in reality, but just auth here for simplicity)
router.post('/', auth, eventController.createEvent);

module.exports = router;
