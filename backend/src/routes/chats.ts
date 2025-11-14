import express from 'express';
import { prisma } from '../storage';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/chats - получить список чатов пользователя
router.get('/', async (req: AuthRequest, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    try {
        const chats = await prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: user.id,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        // Для простоты используем id как name
        const chatsWithName = chats.map((chat) => ({
            id: chat.id,
            name: chat.id,
        }));

        res.json(chatsWithName);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/chats - создать или присоединиться к чату
router.post('/', async (req: AuthRequest, res) => {
    const { username, chatKey } = req.body;
    if (!username || !chatKey) {
        return res
            .status(400)
            .json({ error: 'Имя пользователя и chatKey обязательны' });
    }

    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    try {
        // Найти или создать чат
        let chat = await prisma.chat.findUnique({
            where: { id: chatKey },
            include: { users: true },
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: { id: chatKey },
                include: { users: true },
            });
        }

        // Проверить, что пользователь уже в чате
        if (chat.users.some((u) => u.id === user.id)) {
            return res
                .status(400)
                .json({ error: 'Пользователь уже в этом чате' });
        }

        // Проверить уникальность username в чате
        const existingUserInChat = chat.users.find(
            (u) => u.username === username
        );
        if (existingUserInChat) {
            return res
                .status(400)
                .json({ error: 'Имя пользователя уже существует в этом чате' });
        }

        // Добавить пользователя в чат
        await prisma.chat.update({
            where: { id: chatKey },
            data: {
                users: {
                    connect: { id: user.id },
                },
            },
        });

        res.status(201).json({ userId: user.id, chatId: chat.id });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
