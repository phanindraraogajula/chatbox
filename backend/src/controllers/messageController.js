const prisma = require('../db');

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !content) {
      return res.status(400).json({ error: "senderId and content are required" });
    }

    // Optional: rate limiting logic here if needed

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId: receiverId || null, // null = global
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    res.status(201).json({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderUsername: message.sender.userId,
      receiverId: message.receiverId,
      receiverUsername: message.receiver ? message.receiver.userId : null,
      timestamp: message.createdAt
    });

  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.query; // optional, null = global

    const messages = await prisma.message.findMany({
      where: receiverId ? { 
        OR: [
          { receiverId: parseInt(receiverId) },
          { senderId: parseInt(receiverId) } // include messages from sender
        ]
      } : { receiverId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: true,
        receiver: true,
      },
    });

    const formatted = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      senderUsername: msg.sender.userId,
      receiverId: msg.receiverId,
      receiverUsername: msg.receiver ? msg.receiver.userId : null,
      timestamp: msg.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { sendMessage, getMessages };
