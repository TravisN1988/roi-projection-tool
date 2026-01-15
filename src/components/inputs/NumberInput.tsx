import { useState, useEffect, useRef } from 'react';
import { formatCurrency, formatNumber, parseCurrency, parseNumber } from '../../utils/format';
import { Tooltip } from '../Tooltip';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: 'currency' | 'number' | 'percent';
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  decimals?: number;
  className?: string;
  tooltip?: React.ReactNode;
}

export function NumberInput({
  label,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step = 1,
  suffix,
  decimals = 0,
  className = '',
  tooltip,
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format value for display when not focused
  useEffect(() => {
    if (!isFocused) {
      if (type === 'currency') {
        setDisplayValue(formatCurrency(value, decimals));
      } else if (type === 'percent') {
        // Display as whole number (40 instead of 0.4)
        setDisplayValue(formatNumber(value * 100, decimals));
      } else {
        setDisplayValue(formatNumber(value, decimals));
      }
    }
  }, [value, type, decimals, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number when focused for easier editing
    if (type === 'percent') {
      setDisplayValue(String(value * 100));
    } else {
      setDisplayValue(String(value));
    }
    // Select all text on focus
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Parse and validate value
    let parsed: number;
    if (type === 'currency') {
      parsed = parseCurrency(displayValue);
    } else if (type === 'percent') {
      parsed = parseNumber(displayValue) / 100;
    } else {
      parsed = parseNumber(displayValue);
    }

    // Apply constraints
    if (min !== undefined && parsed < min) parsed = min;
    if (max !== undefined && parsed > max) parsed = max;

    onChange(parsed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm text-[var(--color-text-secondary)]">
          {tooltip ? (
            <Tooltip content={tooltip}>{label}</Tooltip>
          ) : (
            label
          )}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          step={step}
          className="w-full h-10 px-3 rounded-md text-right"
        />
        {suffix && !isFocused && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
