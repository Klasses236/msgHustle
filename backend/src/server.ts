import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import messagesRouter from './routes/messages';
import chatsRouter from './routes/chats';
import newsRouter from './routes/news';
import { authenticateToken } from './middleware/auth';

const app = express(); // test
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter); // auth routes
app.use('/api/users', authenticateToken, usersRouter); // protected user routes
app.use('/api/messages', authenticateToken, messagesRouter);
app.use('/api/chats', authenticateToken, chatsRouter);
app.use('/api/news', newsRouter); // news routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinChat', (chatId: string) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on('leaveChat', (chatId: string) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Export io for use in routes
export { io };

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});