import { useCallback } from 'react';
import type { RoiInputs } from './types';
import { DEFAULT_INPUTS } from './types';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useRoiCalculation } from './hooks/useRoiCalculation';
import { AppShell } from './components/layout';
import { InputPanel } from './components/inputs';
import { OutputPanel } from './components/outputs';
import { RoiChart } from './components/chart';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [inputs, setInputs] = useLocalStorage<RoiInputs>('roi-inputs', DEFAULT_INPUTS);
  const outputs = useRoiCalculation(inputs);

  const handleInputChange = useCallback(<K extends keyof RoiInputs>(
    key: K,
    value: RoiInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, [setInputs]);

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
