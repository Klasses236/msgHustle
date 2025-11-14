import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../storage';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../middleware/auth';

const router = express.Router();

// POST /api/auth/register - регистрация
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    if (password.length < 8) {
        return res
            .status(400)
            .json({ error: 'Пароль должен быть не менее 8 символов' });
    }
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });
        if (existingUser) {
            return res.status(400).json({
                error: 'Пользователь с таким именем или email уже существует',
            });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            },
        });
        const accessToken = generateAccessToken({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        });
        const refreshToken = generateRefreshToken({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        });
        res.status(201).json({
            user: { id: newUser.id, username, email },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/login - вход
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        const accessToken = generateAccessToken({
            id: user.id,
            username: user.username,
            email: user.email,
        });
        const refreshToken = generateRefreshToken({
            id: user.id,
            username: user.username,
            email: user.email,
        });
        res.json({
            user: { id: user.id, username: user.username, email: user.email },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/refresh - обновить access token
router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }
    try {
        const user = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ error: 'Invalid refresh token' });
    }
});

export default router;
