const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');

router.post('/', sendMessage);   // send a message
router.get('/', getMessages);    // get messages (global or private)

module.exports = router;
