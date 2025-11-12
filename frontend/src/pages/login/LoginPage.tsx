import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '@/features/auth/Login/Login';
import Register from '@/features/auth/Register/Register';
import styles from '@/styles.module.scss';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = () => {
    navigate('/main');
  };

  const handleRegister = () => {
    setIsRegister(false);
  };

  const handleSwitchToRegister = () => {
    setIsRegister(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegister(false);
  };

  return (
    <div className={styles.notLoggedIn}>
      {isRegister ? (
        <Register onRegister={handleRegister} onSwitchToLogin={handleSwitchToLogin} />
      ) : (
        <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
      )}
    </div>
  );
}

export default LoginPage;