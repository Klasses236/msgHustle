import express from 'express';
import { prisma } from '../storage';

const router = express.Router();

// GET /api/users - получить всех пользователей (защищено)
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, email: true, createdAt: true },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
