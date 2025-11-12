import React, { useEffect, useState } from 'react';
import { useGetMessagesQuery, useSendMessageMutation } from '@/app/api/messagesSlice';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import Button from '@/shared/ui/Button';
import socket from '@/app/api/socket';
import styles from './styles.module.scss';

interface ChatProps {
  userId: string;
  chatId: string;
  onLogout: () => void;
}

const Chat: React.FC<ChatProps> = ({ userId, chatId, onLogout }) => {
  const { data: messages = [], isLoading, error } = useGetMessagesQuery(chatId);
  const [sendMessageMutation] = useSendMessageMutation();
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    socket.emit('joinChat', chatId);

    return () => {
      socket.emit('leaveChat', chatId);
    };
  }, [chatId]);

  const sendMessage = async (content: string) => {
    try {
      await sendMessageMutation({
        chatId,
        senderId: userId,
        content,
      }).unwrap();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return <div className={styles.chat}>Загрузка сообщений...</div>;
  }

  if (error) {
    return <div className={styles.chat}>Ошибка загрузки сообщений</div>;
  }

  return (
    <div className={styles.chat}>
      <div className={styles.title}>
        <Button text="Выйти из чата" color="blue" size="small" onClick={onLogout} />
        <div>
          Ключ: {showKey ? chatId : '*******'}
          <Button
            text={showKey ? 'Скрыть' : 'Показать'}
            color="blue"
            size="small"
            onClick={() => setShowKey(!showKey)}
            style={{ marginLeft: '10px' }}
          />
        </div>
      </div>
      <MessageList messages={messages} currentUserId={userId} />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default Chat;