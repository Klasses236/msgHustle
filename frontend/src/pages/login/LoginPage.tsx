import { useNavigate } from 'react-router-dom';
import Login from '@/features/auth/Login/Login';
import { saveChatSession } from '@/shared/utils/localStorageService';
import styles from '@/styles.module.scss';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (uid: string, cid: string) => {
    saveChatSession({ username: '', userId: uid, chatId: cid }); // username пустой, так как не используется
    navigate('/chat');
  };

  return <div className={styles.notLoggedIn}><Login onLogin={handleLogin} /></div>;
}

export default LoginPage;