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
                chatUsers: {
                    some: {
                        userId: user.id,
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
            include: { chatUsers: true },
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: { id: chatKey },
                include: { chatUsers: true },
            });
        }

        // Проверить, что пользователь уже в чате
        if (chat.chatUsers.some((cu) => cu.userId === user.id)) {
            return res
                .status(400)
                .json({ error: 'Пользователь уже в этом чате' });
        }

        // Проверить уникальность nickname в чате
        const existingChatUser = await prisma.chatUser.findUnique({
            where: {
                chatId_nickname: {
                    chatId: chatKey,
                    nickname: username,
                },
            },
        });
        if (existingChatUser) {
            return res
                .status(400)
                .json({ error: 'Имя пользователя уже существует в этом чате' });
        }

        // Добавить пользователя в чат с nickname
        await prisma.chatUser.create({
            data: {
                userId: user.id,
                chatId: chatKey,
                nickname: username,
            },
        });

        res.status(201).json({ userId: user.id, chatId: chat.id });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/chats/:chatId - выйти из чата
router.delete('/:chatId', async (req: AuthRequest, res) => {
    const { chatId } = req.params;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    try {
        const chatUser = await prisma.chatUser.findUnique({
            where: {
                userId_chatId: {
                    userId: user.id,
                    chatId: chatId,
                },
            },
        });

        if (!chatUser) {
            return res
                .status(400)
                .json({ error: 'Пользователь не в этом чате' });
        }

        await prisma.chatUser.delete({
            where: {
                userId_chatId: {
                    userId: user.id,
                    chatId: chatId,
                },
            },
        });

        res.json({ message: 'Успешно вышли из чата' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
