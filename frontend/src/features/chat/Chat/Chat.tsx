import React, { useEffect, useState } from 'react';
import {
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} from '@/app/api/messagesSlice';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import Button from '@/shared/ui/Button';
import socket from '@/app/api/socket';
import styles from './styles.module.scss';

interface ChatProps {
  userId: string;
  chatId: string;
  onLeaveChat?: () => void;
  onLogout?: () => void;
}

const Chat: React.FC<ChatProps> = ({ userId, chatId, onLeaveChat }) => {
  const { data, isLoading, error } = useGetMessagesQuery({
    chatId,
    offset: 0,
    limit: 50,
  });
  const messages = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const [loadMoreTrigger, { isFetching: isLoadingMore }] =
    useLazyGetMessagesQuery();
  const [sendMessageMutation] = useSendMessageMutation();
  const [showKey, setShowKey] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setHasMore(messages.length < totalCount);
  }, [messages.length, totalCount]);

  useEffect(() => {
    socket.emit('joinChat', chatId);
    setHasMore(true); // Сброс при смене чата

    return () => {
      socket.emit('leaveChat', chatId);
    };
  }, [chatId]);

  const loadMore = async () => {
    if (!hasMore || isLoadingMore || messages.length === 0) return;
    try {
      const result = await loadMoreTrigger({
        chatId,
        offset: messages.length,
        limit: 50,
      }).unwrap();
      if (result.items.length < 50) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    }
  };

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
        <div>
          {onLeaveChat && (
            <Button
              text="Покинуть чат"
              color="blue"
              size="small"
              onClick={onLeaveChat}
            />
          )}
        </div>
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
      <MessageList
        messages={messages}
        currentUserId={userId}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
