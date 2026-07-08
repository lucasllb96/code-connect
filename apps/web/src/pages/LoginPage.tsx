import { Link, useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import AuthCard from '../components/organisms/AuthCard';
import LoginForm from '../components/molecules/LoginForm';
import SocialLoginGroup from '../components/molecules/SocialLoginGroup';
import { useAuth } from '../contexts/AuthContext';

const LOGIN_BANNER = '/login-banner-new.png';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    await login(data);
    navigate('/');
  };

  return (
    <AuthTemplate>
      <AuthCard bannerSrc={LOGIN_BANNER} bannerAlt="Desenvolvedora trabalhando">
        <div className="animate-slide-up flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary">Login</h1>
            <p className="text-sm text-text-secondary">
              Boas-vindas! Faça seu login.
            </p>
          </div>

          {/* Form */}
          <LoginForm onSubmit={handleLogin} />

          {/* Social login */}
          <SocialLoginGroup />

          {/* Register link */}
          <div className="flex flex-col items-center gap-1 text-sm">
            <span className="text-text-muted">Ainda não tem conta?</span>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 font-semibold text-green-primary transition-colors hover:text-green-dark"
            >
              Crie seu cadastro!
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthTemplate>
  );
}
