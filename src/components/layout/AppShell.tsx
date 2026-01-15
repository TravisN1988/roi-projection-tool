import type { ReactNode } from 'react';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function AppShell({ children, theme, onThemeToggle }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Header theme={theme} onThemeToggle={onThemeToggle} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
        ROI Projection Tool v1.0 MVP
      </footer>
    </div>
  );
}
