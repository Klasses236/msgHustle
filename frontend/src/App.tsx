import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/login/LoginPage';
import ChatPage from '@/pages/chat/ChatPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.scss';

const App = () => {
  return (
    <div className={styles.App}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer theme="colored" />
    </div>
  );
}

export default App;
