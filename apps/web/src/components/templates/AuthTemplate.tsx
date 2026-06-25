import { type ReactNode } from 'react';

interface AuthTemplateProps {
  children: ReactNode;
}

export default function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-bg-dark p-4">
      {/* Watermark decorations */}
      <WatermarkLogo className="absolute -top-16 -left-12 h-64 w-64 -rotate-12 opacity-100" />
      <WatermarkLogo className="absolute -right-16 -bottom-12 h-72 w-72 rotate-12 opacity-100" />

      {/* Main content */}
      <div className="relative z-10 flex w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function WatermarkLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`text-watermark ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylized "C" bracket shapes inspired by the design */}
      <path
        d="M120 30C85 30 55 55 55 100C55 145 85 170 120 170"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M80 170C115 170 145 145 145 100C145 55 115 30 80 30"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
