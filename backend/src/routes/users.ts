import express from 'express';
import { User } from '../models/User';
import { users } from '../storage';

const router = express.Router();

// GET /api/users - получить всех пользователей (защищено)
router.get('/', (req, res) => {
  res.json(users.map(u => ({ id: u.id, username: u.username, email: u.email, createdAt: u.createdAt })));
});

export default router;