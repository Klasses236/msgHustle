import React, { useState } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal';
import JoinPage from '@/pages/join/JoinPage';
import styles from './styles.module.scss';

interface LayoutProps {
  children: React.ReactNode;
  username: string;
  onLogout?: () => void;
  onJoin?: (userId: string, chatId: string, username: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, username, onLogout, onJoin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinChat = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleJoin = (userId: string, chatId: string, username: string) => {
    if (onJoin) {
      onJoin(userId, chatId, username);
    }
    setIsModalOpen(false);
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <JoinPage onJoin={handleJoin} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default Layout;