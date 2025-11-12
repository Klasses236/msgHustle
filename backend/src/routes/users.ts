import express from 'express';
import { User } from '../models/User';
import { users } from '../storage';

const router = express.Router();

// GET /api/users - получить всех пользователей
router.get('/', (req, res) => {
  res.json(users);
});

// POST /api/users - создать нового пользователя
router.post('/', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Имя пользователя обязательно' });
  }
  const newUser: User = {
    id: Date.now().toString(),
    username,
    createdAt: new Date(),
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

export default router;