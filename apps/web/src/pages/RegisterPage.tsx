import { Link, useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import AuthCard from '../components/organisms/AuthCard';
import RegisterForm from '../components/molecules/RegisterForm';
import SocialLoginGroup from '../components/molecules/SocialLoginGroup';
import { useAuth } from '../contexts/AuthContext';

const REGISTER_BANNER = '/image.png';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    await register(data);
    navigate('/');
  };

  return (
    <AuthTemplate>
      <AuthCard bannerSrc={REGISTER_BANNER} bannerAlt="Desenvolvedora programando">
        <div className="animate-slide-up flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary">Cadastro</h1>
            <p className="text-sm text-text-secondary">
              Olá! Preencha seus dados.
            </p>
          </div>

          {/* Form */}
          <RegisterForm onSubmit={handleRegister} />

          {/* Social login */}
          <SocialLoginGroup />

          {/* Login link */}
          <div className="flex items-center justify-center gap-1.5 text-sm">
            <span className="text-text-muted">Já tem conta?</span>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-semibold text-green-primary transition-colors hover:text-green-dark"
            >
              Faça seu login!
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
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthTemplate>
  );
}
