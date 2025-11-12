import React, { useState } from 'react';
import { useJoinChatMutation } from '@/app/api/chatsSlice';
import { getApiErrorMessage } from '@/shared/utils/apiErrorUtils';
import { saveChatSession } from '@/shared/utils/localStorageService';
import { toast } from 'react-toastify';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import styles from './styles.module.scss';

interface LoginProps {
  onLogin: (userId: string, chatId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [chatKey, setChatKey] = useState('');
  const [joinChat, { isLoading }] = useJoinChatMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && chatKey.trim()) {
      try {
        const result = await joinChat({
          username: username.trim(),
          chatKey: chatKey.trim(),
        }).unwrap();
        saveChatSession({
          username: username.trim(),
          userId: result.userId,
          chatId: result.chatId,
        });
        toast.success('Успешный вход в чат!');
        onLogin(result.userId, result.chatId);
      } catch (error: unknown) {
        console.error('Error joining chat:', error);
        toast.error(getApiErrorMessage(error));
      }
    }
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.title}>Вход в чат</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">Ваше имя:</label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={setUsername}
            placeholder="Введите ваше имя"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="chatKey">Ключ чата:</label>
          <Input
            type="text"
            id="chatKey"
            value={chatKey}
            onChange={setChatKey}
            placeholder="Введите ключ чата"
            required
          />
        </div>
        <Button
          text={isLoading ? 'Вход...' : 'Войти'}
          color="green"
          size="medium"
          type="submit"
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default Login;