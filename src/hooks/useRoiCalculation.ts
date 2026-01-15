import { useMemo } from 'react';
import type { RoiInputs, RoiOutputs } from '../types';
import { calculateRoi } from '../calculations/engine';

export function useRoiCalculation(inputs: RoiInputs): RoiOutputs {
  // Memoize calculation to prevent unnecessary recalculations
  const outputs = useMemo(() => {
    return calculateRoi(inputs);
  }, [inputs]);

  return outputs;
}
