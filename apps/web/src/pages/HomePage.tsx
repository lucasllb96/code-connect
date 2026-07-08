import { useAuth } from '../contexts/AuthContext';
import Button from '../components/atoms/Button';

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-dark p-6">
      <div className="animate-slide-up w-full max-w-md rounded-2xl border border-card-border bg-card-bg p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-text-primary">
            Olá, {user?.name}!
          </h1>
          <p className="text-text-secondary">
            Você está logado como <span className="text-text-primary font-medium">{user?.email}</span>
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-input-bg p-4 border border-input-border">
            <h2 className="text-sm font-semibold text-text-primary mb-2">Detalhes da conta</h2>
            <ul className="text-sm text-text-secondary flex flex-col gap-1">
              <li><strong className="text-text-primary">ID:</strong> {user?.id}</li>
              <li><strong className="text-text-primary">Membro desde:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</li>
            </ul>
          </div>
          
          <Button onClick={logout} fullWidth className="mt-4">
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
}
