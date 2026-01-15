interface ResultCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'neutral';
  size?: 'normal' | 'large';
}

export function ResultCard({
  label,
  value,
  sublabel,
  variant = 'default',
  size = 'normal',
}: ResultCardProps) {
  const variantStyles = {
    default: 'text-[var(--color-accent)]',
    success: 'text-[var(--color-benefit)]',
    warning: 'text-[var(--color-cost)]',
    neutral: 'text-[var(--color-text-primary)]',
  };

  const sizeStyles = {
    normal: 'text-2xl',
    large: 'text-3xl',
  };

  return (
    <div className="card p-3 flex flex-col items-center justify-center text-center min-h-[80px]">
      <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wide mb-0.5">
        {label}
      </div>
      <div className={`font-bold result-value ${sizeStyles[size]} ${variantStyles[variant]}`}>
        {value}
      </div>
      {sublabel && (
        <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
          {sublabel}
        </div>
      )}
    </div>
  );
}
