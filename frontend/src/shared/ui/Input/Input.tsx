import React from 'react';
import styles from './styles.module.scss';

interface InputProps {
  type: 'text' | 'password' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  className?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  onKeyDown,
  onBlur,
  className,
  id,
  required,
  disabled,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const inputClass = `${styles.input} ${type === 'textarea' ? styles.textarea : ''} ${error ? styles.error : ''} ${className || ''}`.trim();

  const commonProps = {
    className: inputClass,
    placeholder,
    value,
    onChange: handleChange,
    onKeyDown,
    onBlur,
    id,
    required,
    disabled,
  };

  const inputElement = type === 'textarea' ? <textarea {...commonProps} /> : <input {...commonProps} type={type} />;

  return (
    <div className={styles.wrapper}>
      {inputElement}
      <span className={styles.errorText}>{error || ''}</span>
    </div>
  );
};

export default Input;