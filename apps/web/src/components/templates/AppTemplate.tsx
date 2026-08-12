import { type ReactNode } from 'react';
import Sidebar from '../organisms/Sidebar';

interface AppTemplateProps {
  children: ReactNode;
}

export default function AppTemplate({ children }: AppTemplateProps) {
  return (
    <div className="flex min-h-screen bg-bg-dark">
      <Sidebar />
      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  );
}
