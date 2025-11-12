import React, { useState } from 'react';
import ButtonIcon from '@/shared/ui/ButtonIcon';
import Input from '@/shared/ui/Input';
import styles from './styles.module.scss';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <form className={styles['message-input']} onSubmit={handleSubmit}>
      <Input
        type="textarea"
        value={input}
        onChange={setInput}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        className={styles.textarea}
      />
      <ButtonIcon icon="➤" size="big" type="submit" />
    </form>
  );
};

export default MessageInput;