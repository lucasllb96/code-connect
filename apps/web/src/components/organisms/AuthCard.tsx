import { type ReactNode } from 'react';

interface AuthCardProps {
  bannerSrc: string;
  bannerAlt?: string;
  children: ReactNode;
}

export default function AuthCard({
  bannerSrc,
  bannerAlt = 'Code Connect',
  children,
}: AuthCardProps) {
  return (
    <div className="animate-fade-in mx-4 flex w-full max-w-[820px] overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-2xl shadow-black/30">
      {/* Banner */}
      <div className="relative hidden w-[340px] shrink-0 md:block">
        <img
          src={bannerSrc}
          alt={bannerAlt}
          className="h-full w-full object-cover"
        />
        {/* Logo overlay */}
        <div className="absolute bottom-5 left-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-primary/20">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide text-white">
            code<span className="text-green-primary"> connect</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-10">
        {children}
      </div>
    </div>
  );
}
