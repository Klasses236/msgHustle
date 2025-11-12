import express from 'express';
import { Chat } from '../models/Chat';
import { chats, users } from '../storage';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// POST /api/chats - создать или присоединиться к чату
router.post('/', (req: AuthRequest, res) => {
  const { username, chatKey } = req.body;
  if (!username || !chatKey) {
    return res.status(400).json({ error: 'Имя пользователя и chatKey обязательны' });
  }

  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  // Найти или создать чат
  let chat = chats.find(c => c.id === chatKey);
  if (!chat) {
    chat = {
      id: chatKey,
      messages: [],
      userIds: [],
    };
    chats.push(chat);
  }

  // Проверить, что пользователь уже в чате
  if (chat.userIds.includes(user.id)) {
    return res.status(400).json({ error: 'Пользователь уже в этом чате' });
  }

  // Проверить уникальность username в чате
  const existingUserInChat = users.find(u => u.username === username && chat!.userIds.includes(u.id));
  if (existingUserInChat) {
    return res.status(400).json({ error: 'Имя пользователя уже существует в этом чате' });
  }

  // Добавить пользователя в чат
  chat.userIds.push(user.id);

  res.status(201).json({ userId: user.id, chatId: chat.id });
});

export default router;