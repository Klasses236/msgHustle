import express from 'express';
import { prisma } from '../storage';
import { io } from '../server';

const router = express.Router();

// GET /api/messages?chatId=...&offset=...&limit=... - получить сообщения для чата с пагинацией
router.get('/', async (req, res) => {
  const { chatId, offset = '0', limit = '50' } = req.query;
  if (!chatId || typeof chatId !== 'string') {
    return res.status(400).json({ error: 'chatId обязателен' });
  }
  const offsetNum = parseInt(offset as string, 10);
  const limitNum = parseInt(limit as string, 10);
  if (isNaN(offsetNum) || offsetNum < 0) {
    return res.status(400).json({ error: 'offset должен быть числом >= 0' });
  }
  if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
    return res
      .status(400)
      .json({ error: 'limit должен быть числом от 1 до 100' });
  }
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) {
      return res.status(404).json({ error: 'Чат не найден' });
    }
    const totalCount = await prisma.message.count({
      where: { chatId },
    });
    const messages = await prisma.message.findMany({
      where: { chatId },
      include: { sender: true },
      orderBy: { timestamp: 'desc' },
      take: limitNum,
      skip: offsetNum,
    });
    res.json({ items: messages.reverse(), totalCount });
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
