import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/shared/ui/Layout/Layout';
import Chat from '@/features/chat/Chat/Chat';
import NewsChat from '@/features/chat/NewsChat/NewsChat';
import {
  getChatSession,
  clearChatSession,
} from '@/shared/utils/localStorageService';

// По умолчанию чат новостей
const defaultChatId = 'news-releases'; // Фиксированный ID для новостей

const MainPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userId, setUserId] = useState('');
  const [chatId, setChatId] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const session = getChatSession();
    const chatIdFromUrl = searchParams.get('chatId');

    if (session) {
      setUserId(session.userId);
      setChatId(chatIdFromUrl || session.chatId);
      setUsername(session.username);
    } else {
      // Если нет сессии, используем новости или из URL
      setChatId(chatIdFromUrl || defaultChatId);
      const user = localStorage.getItem('user');
      if (user) {
        setUsername(JSON.parse(user).username);
      }
    }
  }, [searchParams]);

  const handleLogout = () => {
    clearChatSession();
    navigate('/login');
  };

  const handleJoin = (userId: string, chatId: string, username: string) => {
    setUserId(userId);
    setChatId(chatId);
    setUsername(username);
    setSearchParams({ chatId });
  };

  const handleChatSelect = (chatId: string) => {
    setChatId(chatId);
    setSearchParams({ chatId });
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
    <Layout
      username={username}
      currentChatId={chatId}
      onLogout={handleLogout}
      onJoin={handleJoin}
      onChatSelect={handleChatSelect}
    >
      {renderChat()}
    </Layout>
  );
};

export default MainPage;
