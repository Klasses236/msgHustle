import React from 'react';
import styles from './styles.module.scss';

export type ButtonColor = 'red' | 'green' | 'blue';

export type ButtonSize = 'small' | 'medium' | 'big';

interface ButtonProps {
  text: string;
  color: ButtonColor;
  size: ButtonSize;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color,
  size,
  onClick,
  type = 'button',
  disabled = false,
  style,
  className,
}) => {
  const buttonClass = `${styles.button} ${styles[color]} ${styles[size]} ${className || ''}`;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={style}
    >
      {text}
    </button>
  );
};

export default Button;
