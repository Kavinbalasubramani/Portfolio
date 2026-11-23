const express = require('express');
const router = express.Router();
const { getMessages, getMessage, sendMessage, markRead, deleteMessage, getStats } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.post('/', sendMessage);

// Private (admin)
router.get('/stats', protect, getStats);
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessage);
router.patch('/:id/read', protect, markRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
