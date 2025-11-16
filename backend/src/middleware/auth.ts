import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

export interface AuthRequest extends Request {
  user?: { id: string; username: string; email: string };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

export const generateAccessToken = (user: {
  id: string;
  username: string;
  email: string;
}) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = async (userId: string) => {
  const token = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
  return token;
};

export const verifyRefreshToken = async (token: string) => {
  jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
    throw new Error('Invalid refresh token');
  }
  // Optionally, delete the used token to prevent reuse
  await prisma.refreshToken.delete({ where: { token } });
  return refreshTokenRecord.user;
};
