import { type InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export default function Checkbox({ label, id, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-2 text-sm text-text-secondary select-none"
    >
      <input
        type="checkbox"
        id={id}
        className="h-4 w-4 cursor-pointer rounded border-input-border bg-input-bg accent-green-primary"
        {...props}
      />
      {label}
    </label>
  );
}
