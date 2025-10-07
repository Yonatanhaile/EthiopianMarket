const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead
} = require('../controllers/messagesController');
const { protect } = require('../middleware/auth');

router.use(protect); // All message routes require authentication

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/:listingId/:userId', getMessages);
router.put('/:id/read', markAsRead);

module.exports = router;

