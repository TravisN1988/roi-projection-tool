import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo placeholder - can be replaced with actual logo */}
          <div className="w-8 h-8 rounded bg-[var(--color-accent)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">ROI</span>
          </div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            ROI Projection Tool
          </h1>
        </div>

        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </header>
  );
}
