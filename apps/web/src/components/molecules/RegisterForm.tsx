import { type FormEvent, useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Checkbox from '../atoms/Checkbox';

interface RegisterFormProps {
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, email, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="register-name"
        label="Nome"
        type="text"
        placeholder="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
      />

      <Input
        id="register-email"
        label="Email"
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <Input
        id="register-password"
        label="Senha"
        type="password"
        placeholder="••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />

      <Checkbox
        id="register-remember"
        label="Lembrar-me"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      />

      <Button type="submit" fullWidth>
        Cadastrar
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
