import React, { useState } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal';
import JoinChat from '@/features/chat/JoinChat/JoinChat';
import { useGetUserChatsQuery } from '@/app/api/chatsSlice';
import styles from './styles.module.scss';

interface LayoutProps {
  children: React.ReactNode;
  username: string;
  currentChatId?: string;
  onLogout?: () => void;
  onJoin?: (userId: string, chatId: string, username: string) => void;
  onChatSelect?: (chatId: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  username,
  currentChatId,
  onLogout,
  onJoin,
  onChatSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: chats = [], isLoading } = useGetUserChatsQuery();

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
            {isLoading ? (
              <div>Загрузка чатов...</div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`${styles.chatItem} ${
                    chat.id === currentChatId ? styles.activeChat : ''
                  }`}
                  onClick={
                    onChatSelect ? () => onChatSelect(chat.id) : undefined
                  }
                  style={{ cursor: onChatSelect ? 'pointer' : 'default' }}
                >
                  {chat.name}
                </div>
              ))
            )}
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
