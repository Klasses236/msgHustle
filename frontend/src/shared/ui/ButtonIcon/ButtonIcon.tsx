import React from 'react';
import styles from './styles.module.scss';

export type ButtonIconSize = 'small' | 'medium' | 'big';

interface ButtonIconProps {
  icon: string;
  size: ButtonIconSize;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon,
  size,
  onClick,
  type = 'button',
  disabled = false,
  className,
}) => {
  const buttonClass = `${styles.button} ${styles[size]} ${className || ''}`.trim();

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

export default ButtonIcon;