import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chat from '@/features/chat/Chat/Chat';
import {
  getChatSession,
  clearChatSession,
} from '@/shared/utils/localStorageService';
import styles from '@/styles.module.scss';

const ChatPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [chatId, setChatId] = useState('');

  useEffect(() => {
    const session = getChatSession();
    if (!session) {
      navigate('/login');
    } else {
      setUserId(session.userId);
      setChatId(session.chatId);
    }
  }, [navigate]);

  const handleLogout = () => {
    clearChatSession();
    navigate('/login');
  };

  if (!userId || !chatId) {
    return null; // Или загрузочный экран
  }

  return (
    <div className={styles.loggedIn}>
      <Chat userId={userId} chatId={chatId} onLogout={handleLogout} />
    </div>
  );
};

export default ChatPage;
