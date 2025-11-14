import express from 'express';
import { prisma } from '../storage';
import { io } from '../server';

const router = express.Router();

// GET /api/messages?chatId=... - получить сообщения для чата
router.get('/', async (req, res) => {
  const { chatId } = req.query;
  if (!chatId || typeof chatId !== 'string') {
    return res.status(400).json({ error: 'chatId обязателен' });
  }
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: { include: { sender: true } } },
    });
    if (!chat) {
      return res.status(404).json({ error: 'Чат не найден' });
    }
    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/messages - отправить новое сообщение
router.post('/', async (req, res) => {
  const { chatId, senderId, content } = req.body;
  if (!chatId || !senderId || !content) {
    return res
      .status(400)
      .json({ error: 'chatId, senderId и content обязательны' });
  }
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    const chatUser = await prisma.chatUser.findUnique({
      where: {
        userId_chatId: {
          userId: senderId,
          chatId,
        },
      },
    });
    if (!chatUser) {
      return res.status(404).json({ error: 'Пользователь не в чате' });
    }
    const newMessage = await prisma.message.create({
      data: {
        chatId,
        senderId,
        senderUsername: chatUser.nickname,
        content,
      },
      include: { sender: true },
    });
    // Emit new message to all connected clients in the chat room
    io.to(chatId).emit('newMessage', { chatId, message: newMessage });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
