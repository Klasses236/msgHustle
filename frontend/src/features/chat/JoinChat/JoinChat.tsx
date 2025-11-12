import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useJoinChatMutation } from '@/app/api/chatsSlice';
import { getApiErrorMessage } from '@/shared/utils/apiErrorUtils';
import { saveChatSession } from '@/shared/utils/localStorageService';
import { toast } from 'react-toastify';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import styles from './styles.module.scss';

interface JoinChatProps {
  onJoin: (userId: string, chatId: string, username: string) => void;
  onClose?: () => void;
}

interface JoinFormData {
  chatKey: string;
  nickname: string;
}

const JoinChat: React.FC<JoinChatProps> = ({ onJoin, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFormData>();
  const [joinChat, { isLoading }] = useJoinChatMutation();
  const defaultNickname = (() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).username : '';
  })();

  const onSubmit = handleSubmit(async (data: JoinFormData) => {
    const nickname = data.nickname.trim() || defaultNickname;
    if (!nickname || !data.chatKey.trim()) {
      toast.error('Заполните все поля');
      return;
    }
    try {
      const result = await joinChat({
        username: nickname,
        chatKey: data.chatKey.trim(),
      }).unwrap();
      saveChatSession({
        username: nickname,
        userId: result.userId,
        chatId: result.chatId,
      });
      toast.success('Успешное присоединение к чату!');
      onJoin(result.userId, result.chatId, nickname);
      if (onClose) onClose();
    } catch (error: unknown) {
      console.error('Error joining chat:', error);
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <div className={styles.join}>
      <h1 className={styles.title}>Присоединиться к чату</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="chatKey">
            Ключ чата:
          </label>
          <Controller
            name="chatKey"
            control={control}
            rules={{ required: 'Ключ чата обязателен' }}
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
          {errors.chatKey && (
            <span className={styles.error}>{errors.chatKey.message}</span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="nickname">
            Никнейм (опционально):
          </label>
          <Controller
            name="nickname"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                id="nickname"
                value={field.value || ''}
                onChange={field.onChange}
                placeholder={`По умолчанию: ${defaultNickname}`}
              />
            )}
          />
        </div>
        <Button
          text={isLoading ? 'Присоединение...' : 'Присоединиться'}
          color="green"
          size="medium"
          type="submit"
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default JoinChat;
