import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/shared/ui/Layout/Layout';
import Chat from '@/features/chat/Chat/Chat';
import NewsChat from '@/features/chat/NewsChat/NewsChat';
import { getChatSession, clearChatSession } from '@/shared/utils/localStorageService';

const MainPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [chatId, setChatId] = useState('');
  const [username, setUsername] = useState('');

  // По умолчанию чат новостей
  const defaultChatId = 'news-releases'; // Фиксированный ID для новостей

  useEffect(() => {
    const session = getChatSession();
    if (session) {
      setUserId(session.userId);
      setChatId(session.chatId);
      setUsername(session.username);
    } else {
      // Если нет сессии, используем новости
      setChatId(defaultChatId);
      const user = localStorage.getItem('user');
      if (user) {
        setUsername(JSON.parse(user).username);
      }
    }
  }, []);

  const handleLogout = () => {
    clearChatSession();
    navigate('/login');
  };

  const handleJoin = (userId: string, chatId: string, username: string) => {
    setUserId(userId);
    setChatId(chatId);
    setUsername(username);
  };

  // Для новостей используем специальный компонент или модифицированный Chat
  const renderChat = () => {
    if (chatId === defaultChatId) {
      return <NewsChat />;
    } else {
      return <Chat userId={userId} chatId={chatId} onLogout={handleLogout} />;
    }
  };

  return (
    <Layout username={username} onLogout={handleLogout} onJoin={handleJoin}>
      {renderChat()}
    </Layout>
  );
};

export default MainPage;