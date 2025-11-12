import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from '@/pages/login/LoginPage';
import JoinPage from '@/pages/join/JoinPage';
import ChatPage from '@/pages/chat/ChatPage';
import MainPage from '@/pages/main/MainPage';
import PrivateRoute from '@/shared/ui/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.scss';

const App = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/chat');
  };

  return (
    <div className={styles.App}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<PrivateRoute><MainPage /></PrivateRoute>} />
        <Route path="/join" element={<PrivateRoute><JoinPage onJoin={handleJoin} /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer theme="colored" />
    </div>
  );
}

export default App;
