import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ChalkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
  children: ReactNode;
}

export default function ChalkButton({
  variant = 'default',
  children,
  className = '',
  ...props
}: ChalkButtonProps) {
  const variantClass = variant === 'primary' ? 'btn-chalk-primary' : '';
  return (
    <button className={`btn-chalk ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
