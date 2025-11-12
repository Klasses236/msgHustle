import express from 'express';
import { Chat } from '../models/Chat';
import { User } from '../models/User';
import { chats, users } from '../storage';

const router = express.Router();

// POST /api/chats - создать или присоединиться к чату
router.post('/', (req, res) => {
  const { username, chatKey } = req.body;
  if (!username || !chatKey) {
    return res.status(400).json({ error: 'Имя пользователя и chatKey обязательны' });
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

  // Проверить уникальность username в чате
  const existingUserInChat = users.find(u => u.username === username && chat!.userIds.includes(u.id));
  if (existingUserInChat) {
    return res.status(400).json({ error: 'Имя пользователя уже существует в этом чате' });
  }

  // Создать пользователя
  const newUser: User = {
    id: Date.now().toString(),
    username,
    createdAt: new Date(),
  };
  users.push(newUser);

  // Добавить пользователя в чат
  chat.userIds.push(newUser.id);

  res.status(201).json({ userId: newUser.id, chatId: chat.id });
});

export default router;