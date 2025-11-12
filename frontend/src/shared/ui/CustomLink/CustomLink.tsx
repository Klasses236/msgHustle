import React from 'react';
import styles from './styles.module.scss';

interface LinkProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const CustomLink: React.FC<LinkProps> = ({ children, onClick, href, className }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href || '#'}
      onClick={handleClick}
      className={`${styles.link} ${className || ''}`.trim()}
    >
      {children}
    </a>
  );
};

export default CustomLink;