import React from 'react';
import { useForm, Controller } from 'react-hook-form';
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

interface LoginFormData {
  username: string;
  chatKey: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [joinChat, { isLoading }] = useJoinChatMutation();

  const onSubmit = handleSubmit(async (data: LoginFormData) => {
    if (data.username.trim() && data.chatKey.trim()) {
      try {
        const result = await joinChat({
          username: data.username.trim(),
          chatKey: data.chatKey.trim(),
        }).unwrap();
        saveChatSession({
          username: data.username.trim(),
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
  });

  return (
    <div className={styles.login}>
      <h1 className={styles.title}>Вход в чат</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">Ваше имя:</label>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Имя обязательно" }}
            render={({ field }) => (
              <Input
                type="text"
                id="username"
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Введите ваше имя"
                required
              />
            )}
          />
          {errors.username && <span className={styles.error}>{errors.username.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="chatKey">Ключ чата:</label>
          <Controller
            name="chatKey"
            control={control}
            rules={{ required: "Ключ чата обязателен" }}
            render={({ field }) => (
              <Input
                type="text"
                id="chatKey"
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Введите ключ чата"
                required
              />
            )}
          />
          {errors.chatKey && <span className={styles.error}>{errors.chatKey.message}</span>}
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