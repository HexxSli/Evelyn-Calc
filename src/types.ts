export type Operator = '+' | '-' | '×' | '÷' | '^';

export type CalculatorMode = 'basic' | 'scientific';

export type AngleUnit = 'DEG' | 'RAD';

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export interface CalculatorState {
  displayValue: string;
  previousValue: string | null;
  operator: Operator | null;
  waitingForNewOperand: boolean;
  history: CalculationHistoryItem[];
  isError: boolean;
  mode: CalculatorMode;
  angleUnit: AngleUnit;
}
