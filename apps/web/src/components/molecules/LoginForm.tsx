import { type FormEvent, useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Checkbox from '../atoms/Checkbox';

interface LoginFormProps {
  onSubmit?: (data: { identifier: string; password: string; rememberMe: boolean }) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.({ identifier, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="login-identifier"
        label="Email ou usuário"
        type="text"
        placeholder="usuario123"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        autoComplete="username"
      />

      <Input
        id="login-password"
        label="Senha"
        type="password"
        placeholder="••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <Checkbox
          id="login-remember"
          label="Lembrar-me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <a
          href="#"
          className="text-sm text-text-secondary underline underline-offset-2 transition-colors hover:text-text-primary"
        >
          Esqueci a senha
        </a>
      </div>

      <Button type="submit" fullWidth>
        Login
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Button>
    </form>
  );
}
