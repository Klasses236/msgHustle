import React from 'react';
import { useGetReleaseNewsQuery } from '@/app/api/newsSlice';
import MessageList from '../MessageList/MessageList';
import styles from './styles.module.scss';

interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: string;
}

const NewsChat: React.FC = () => {
  const { data: news = [], isLoading, error } = useGetReleaseNewsQuery();

  if (isLoading) {
    return <div className={styles.newsChat}>Загрузка новостей...</div>;
  }

  if (error) {
    return <div className={styles.newsChat}>Ошибка загрузки новостей</div>;
  }

  // Преобразуем новости в сообщения от команды разработчиков
  const messages: Message[] = news.map((item) => ({
    id: item.id,
    senderId: 'system', // Фиктивный ID для системы
    senderUsername: 'Команда разработчиков',
    content: `${item.title}\n\n${item.content}`,
    timestamp: item.date,
  }));

  return (
    <div className={styles.newsChat}>
      <MessageList messages={messages} currentUserId="" />
    </div>
  );
};

export default NewsChat;