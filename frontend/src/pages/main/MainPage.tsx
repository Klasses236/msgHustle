import { useState, useEffect } from 'react';
import Login from '@/features/auth/Login/Login';
import Chat from '@/features/chat/Chat/Chat';
import { getChatSession, clearChatSession } from '@/shared/utils/localStorageService';
import styles from './styles.module.scss';

const MainPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [chatId, setChatId] = useState('');

  useEffect(() => {
    const session = getChatSession();
    if (session) {
      setUserId(session.userId);
      setChatId(session.chatId);
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = (uid: string, cid: string) => {
    setUserId(uid);
    setChatId(cid);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    clearChatSession();
    setLoggedIn(false);
    setUserId('');
    setChatId('');
  };

  return (
    <div className={`${styles.App} ${loggedIn ? styles.loggedIn : styles.notLoggedIn}`}>
      {loggedIn ? (
        <Chat userId={userId} chatId={chatId} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default MainPage;