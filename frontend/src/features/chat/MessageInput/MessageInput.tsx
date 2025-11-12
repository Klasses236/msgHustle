import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import ButtonIcon from '@/shared/ui/ButtonIcon';
import Input from '@/shared/ui/Input';
import styles from './styles.module.scss';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

interface MessageFormData {
  input: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const { control, handleSubmit, reset } = useForm<MessageFormData>();

  const onSubmit = handleSubmit((data: MessageFormData) => {
    if (data.input.trim()) {
      onSendMessage(data.input.trim());
      reset();
    }
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form className={styles['message-input']} onSubmit={onSubmit}>
      <Controller
        name="input"
        control={control}
        render={({ field }) => (
          <Input
            type="textarea"
            value={field.value || ''}
            onChange={field.onChange}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            className={styles.textarea}
          />
        )}
      />
      <ButtonIcon icon="➤" size="big" type="submit" />
    </form>
  );
};

export default MessageInput;