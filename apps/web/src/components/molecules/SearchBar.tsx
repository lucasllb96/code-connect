import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({ onSearch, placeholder = 'Digite o que você procura', debounceMs = 500 }: SearchBarProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, onSearch, debounceMs]);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-text-secondary" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        type="text"
        className="w-full rounded-lg border border-card-border bg-card-bg py-3 pl-12 pr-4 text-sm text-text-primary placeholder-text-muted focus:border-input-focus focus:outline-none transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
