import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-r from-green-primary to-green-dark text-bg-dark py-3 px-6 hover:brightness-110 hover:shadow-lg hover:shadow-green-primary/20 active:scale-[0.98]',
    ghost:
      'text-green-primary hover:text-green-dark underline underline-offset-2',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${base} ${variants[variant]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
