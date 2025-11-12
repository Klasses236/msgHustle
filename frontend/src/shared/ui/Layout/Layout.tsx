import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import styles from './styles.module.scss';

interface LayoutProps {
  children: React.ReactNode;
  username: string;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, username, onLogout }) => {
  const navigate = useNavigate();

  const handleJoinChat = () => {
    navigate('/join');
  };

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div></div>
        <div className={styles.user}>
          {username}
        </div>
      </header>

      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <Button
              text="Присоединиться к чату"
              color="blue"
              size="medium"
              onClick={handleJoinChat}
            />
          </div>
          {onLogout && (
            <div className={styles.sidebarBottom}>
              <Button
                text="Выйти"
                color="red"
                size="medium"
                onClick={onLogout}
              />
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;