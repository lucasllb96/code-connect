import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

export default function SocialButton({ icon, label, ...props }: SocialButtonProps) {
  return (
    <button
      type="button"
      className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg p-3 text-text-secondary transition-all duration-200 hover:bg-input-bg hover:text-text-primary"
      {...props}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}
