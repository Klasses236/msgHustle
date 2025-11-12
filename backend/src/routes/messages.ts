import express from 'express';
import { Message } from '../models/Message';
import { chats, users } from '../storage';
import { io } from '../server';

const router = express.Router();

// GET /api/messages?chatId=... - получить сообщения для чата
router.get('/', (req, res) => {
  const { chatId } = req.query;
  if (!chatId) {
    return res.status(400).json({ error: 'chatId обязателен' });
  }
  const chat = chats.find(c => c.id === chatId);
  if (!chat) {
    return res.status(404).json({ error: 'Чат не найден' });
  }
  res.json(chat.messages);
});

// POST /api/messages - отправить новое сообщение
router.post('/', (req, res) => {
  const { chatId, senderId, content } = req.body;
  if (!chatId || !senderId || !content) {
    return res.status(400).json({ error: 'chatId, senderId и content обязательны' });
  }
  const chat = chats.find(c => c.id === chatId);
  if (!chat) {
    return res.status(404).json({ error: 'Chat not found' });
  }
  const user = users.find(u => u.id === senderId);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  const newMessage: Message = {
    id: Date.now().toString(),
    senderId,
    senderUsername: user.username,
    content,
    timestamp: new Date(),
  };
  chat.messages.push(newMessage);
  // Emit new message to all connected clients in the chat room
  io.to(chatId).emit('newMessage', { chatId, message: newMessage });
  res.status(201).json(newMessage);
});

export default router;