import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, id, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-text-primary"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border bg-input-bg px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:ring-1 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
            : 'border-input-border focus:border-input-focus focus:ring-input-focus/30'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
