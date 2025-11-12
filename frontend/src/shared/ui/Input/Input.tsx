import React from 'react';
import styles from './styles.module.scss';

interface InputProps {
  type: 'text' | 'password' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  onKeyDown,
  className,
  id,
  required,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const commonProps = {
    className: `${styles.input} ${type === 'textarea' ? styles.textarea : ''} ${className || ''}`.trim(),
    placeholder,
    value,
    onChange: handleChange,
    onKeyDown,
    id,
    required,
    disabled,
  };

  if (type === 'textarea') {
    return <textarea {...commonProps} />;
  }

  return <input {...commonProps} type={type} />;
};

export default Input;