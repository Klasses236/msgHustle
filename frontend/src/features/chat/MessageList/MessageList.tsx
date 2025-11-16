import React, { useEffect, useRef, useState } from 'react';
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
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (!sentinelRef.current || !onLoadMore || !hasMore || isLoadingMore)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          if (listRef.current) {
            previousScrollHeightRef.current = listRef.current.scrollHeight;
          }
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoadingMore]);

  // Корректировка скролла после загрузки больше сообщений
  useEffect(() => {
    if (listRef.current && previousScrollHeightRef.current !== null) {
      const delta =
        listRef.current.scrollHeight - previousScrollHeightRef.current;
      listRef.current.scrollTop += delta;
      previousScrollHeightRef.current = null;
    }
  }, [messages]);

  // Прокрутка вниз при новых сообщениях, если пользователь внизу
  useEffect(() => {
    if (listRef.current && isAtBottom && !isLoadingMore) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isAtBottom, isLoadingMore]);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  return (
    <div
      ref={listRef}
      className={styles['message-list']}
      onScroll={handleScroll}
    >
      {isLoadingMore && (
        <div className={styles['loading-more']}>Загрузка...</div>
      )}
      <div ref={sentinelRef} className={styles.sentinel} />
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${message.senderId === currentUserId ? styles.sent : styles.received}`}
        >
          <p className={styles.content}>
            <strong>{message.senderUsername}:</strong> {message.content}
          </p>
          <span className={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
