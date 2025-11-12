import React, { useState } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal';
import JoinChat from '@/features/chat/JoinChat/JoinChat';
import styles from './styles.module.scss';

interface LayoutProps {
  children: React.ReactNode;
  username: string;
  onLogout?: () => void;
  onJoin?: (userId: string, chatId: string, username: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  username,
  onLogout,
  onJoin,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockChats = [
    { id: '1', name: 'Chat 1' },
    { id: '2', name: 'Chat 2' },
    { id: '3', name: 'Chat 3' },
    { id: '4', name: 'Chat 4' },
    { id: '5', name: 'Chat 5' },
    { id: '7', name: 'Chat 6' },
    { id: '8', name: 'Chat 6' },
    { id: '9', name: 'Chat 6' },
    { id: '61', name: 'Chat 6' },
    { id: '62', name: 'Chat 6' },
    { id: '63', name: 'Chat 6' },
    { id: '64', name: 'Chat 6' },
    { id: '65', name: 'Chat 6' },
    { id: '66', name: 'Chat 6' },
  ];

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
        <div className={styles.user}>{username}</div>
      </header>

      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <Button
            text="Присоединиться к чату"
            color="blue"
            size="medium"
            onClick={handleJoinChat}
          />
          <div className={styles.sidebarChats}>
            {mockChats.map((chat) => (
              <div key={chat.id} className={styles.chatItem}>
                {chat.name}
              </div>
            ))}
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
        <main className={styles.content}>{children}</main>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <JoinChat onJoin={handleJoin} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default Layout;
