import React from 'react';
import styles from './styles.module.scss';

interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className={styles['message-list']}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${message.senderId === currentUserId ? styles.sent : styles.received}`}
        >
          <p className={styles.content}><strong>{message.senderUsername}:</strong> {message.content}</p>
          <span className={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;