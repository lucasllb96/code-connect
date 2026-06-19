import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, id, ...props }: InputProps) {
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
        className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-input-focus focus:ring-1 focus:ring-input-focus/30"
        {...props}
      />
    </div>
  );
}
