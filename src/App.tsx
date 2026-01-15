import { useCallback, useEffect } from 'react';
import type { RoiInputs } from './types';
import { DEFAULT_INPUTS } from './types';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useRoiCalculation } from './hooks/useRoiCalculation';
import { AppShell } from './components/layout';
import { InputPanel } from './components/inputs';
import { OutputPanel } from './components/outputs';
import { RoiChart } from './components/chart';

// Migration: Check if stored data has old structure and needs migration
function migrateStoredInputs(stored: unknown): RoiInputs {
  // If null/undefined, use defaults
  if (!stored || typeof stored !== 'object') {
    return DEFAULT_INPUTS;
  }

  const data = stored as Record<string, unknown>;

  // Check if it has old 'milestones' array instead of 'paymentSchedule'
  if ('milestones' in data && !('paymentSchedule' in data)) {
    console.log('Migrating old data structure to new paymentSchedule format');
    // Clear old data and use defaults
    localStorage.removeItem('roi-inputs');
    return DEFAULT_INPUTS;
  }

  // Check if paymentSchedule exists and has required fields
  if ('paymentSchedule' in data) {
    const schedule = data.paymentSchedule as Record<string, unknown>;
    if (
      typeof schedule.downpaymentPercent !== 'number' ||
      !Array.isArray(schedule.optionalMilestones) ||
      typeof schedule.preShipmentPercent !== 'number' ||
      typeof schedule.finalPaymentPercent !== 'number'
    ) {
      console.log('Invalid paymentSchedule structure, resetting to defaults');
      localStorage.removeItem('roi-inputs');
      return DEFAULT_INPUTS;
    }
  }

  // Data looks valid, return it (with defaults for any missing fields)
  return { ...DEFAULT_INPUTS, ...data } as RoiInputs;
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [inputs, setInputs] = useLocalStorage<RoiInputs>('roi-inputs', DEFAULT_INPUTS);

  // Run migration on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('roi-inputs');
      if (stored) {
        const parsed = JSON.parse(stored);
        const migrated = migrateStoredInputs(parsed);
        // If migration happened, update state
        if (migrated !== parsed) {
          setInputs(migrated);
        }
      }
    } catch (e) {
      console.warn('Error during migration, resetting to defaults:', e);
      localStorage.removeItem('roi-inputs');
      setInputs(DEFAULT_INPUTS);
    }
  }, []);

  const outputs = useRoiCalculation(inputs);

  const handleInputChange = useCallback(<K extends keyof RoiInputs>(
    key: K,
    value: RoiInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, [setInputs]);

  // Safety check: if inputs don't have paymentSchedule, reset to defaults
  if (!inputs.paymentSchedule) {
    return (
      <AppShell theme={theme} onThemeToggle={toggleTheme}>
        <div className="flex items-center justify-center h-64">
          <p className="text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell theme={theme} onThemeToggle={toggleTheme}>
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        {/* Left Panel - Inputs */}
        <div className="lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <InputPanel inputs={inputs} onInputChange={handleInputChange} />
        </div>

        {/* Right Panel - Outputs & Chart */}
        <div className="space-y-6">
          <OutputPanel outputs={outputs} commissioningMonth={inputs.commissioningMonth} />
          <RoiChart data={outputs.chartData} breakEvenMonth={outputs.breakEvenProjectMonth} />
        </div>
      </div>
    </AppShell>
  );
}

export default App;
