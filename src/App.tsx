/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { ModeSwitcher } from './components/ModeSwitcher';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryModal } from './components/HistoryModal';
import { Operator, CalculationHistoryItem, CalculatorMode, AngleUnit } from './types';
import {
  calculate,
  applyUnaryFunction,
  evaluateExpression,
  formatResult,
  triggerHaptic,
} from './utils/calculator';
import { playKeySound } from './utils/audio';

export default function App() {
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForNewOperand, setWaitingForNewOperand] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [burstKey, setBurstKey] = useState<number>(0);

  // Clear button label logic: 'C' if user has entered digits, 'AC' if reset
  const clearLabel: 'C' | 'AC' = displayValue !== '0' || previousValue !== null || isError ? 'C' : 'AC';

  /**
   * Appends or inputs a digit
   */
  const handleDigit = useCallback((digit: string) => {
    triggerHaptic('light');
    playKeySound('num', soundEnabled);

    if (isError) {
      setIsError(false);
      setDisplayValue(digit);
      setWaitingForNewOperand(false);
      return;
    }

    if (waitingForNewOperand) {
      setDisplayValue(digit);
      setWaitingForNewOperand(false);
    } else {
      // If display is currently '0' and not e.g. '0.' or an expression
      if (displayValue === '0') {
        setDisplayValue(digit);
      } else if (displayValue === 'π' || displayValue === 'e') {
        // Replace constant with digit if typing directly over it
        setDisplayValue(digit);
      } else {
        // Prevent exceeding 18 characters
        if (displayValue.length >= 18) return;
        setDisplayValue(displayValue + digit);
      }
    }
  }, [displayValue, isError, waitingForNewOperand, soundEnabled]);

  /**
   * Handles decimal point input (prevents multiple decimals within the same token)
   */
  const handleDecimal = useCallback(() => {
    triggerHaptic('light');
    playKeySound('num', soundEnabled);

    if (isError) {
      setIsError(false);
      setDisplayValue('0.');
      setWaitingForNewOperand(false);
      return;
    }

    if (waitingForNewOperand) {
      setDisplayValue('0.');
      setWaitingForNewOperand(false);
      return;
    }

    // Split by operators/parentheses to check if current active number token already has a dot
    const tokens = displayValue.split(/[+\-×÷^()]/);
    const lastToken = tokens[tokens.length - 1];

    if (!lastToken.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  }, [displayValue, isError, waitingForNewOperand, soundEnabled]);

  /**
   * Handles binary operators (+, -, ×, ÷, ^)
   */
  const handleOperator = useCallback((nextOperator: Operator) => {
    triggerHaptic('medium');
    playKeySound('op', soundEnabled);

    if (isError) return;

    // Check if the current display contains composite expression syntax (e.g. parentheses, functions)
    const hasComplexSyntax = /[()√sincolgtq]/.test(displayValue);

    if (hasComplexSyntax) {
      // In composite scientific expressions, evaluate the current expression first
      const evalRes = evaluateExpression(displayValue, angleUnit);
      if (evalRes === 'Error') {
        setIsError(true);
        setDisplayValue('Error');
        triggerHaptic('error');
        return;
      }
      const formatted = formatResult(evalRes);
      setDisplayValue(formatted);
      setPreviousValue(formatted);
      setOperator(nextOperator);
      setWaitingForNewOperand(true);
      return;
    }

    const inputValue = parseFloat(displayValue);

    // If an operator is already queued and we are waiting for a new operand,
    // swap the operator directly
    if (operator && waitingForNewOperand) {
      setOperator(nextOperator);
      return;
    }

    if (previousValue === null) {
      setPreviousValue(displayValue);
    } else if (operator) {
      // Evaluate intermediate operation
      const prevNum = parseFloat(previousValue);
      const result = calculate(prevNum, inputValue, operator);

      if (typeof result === 'string') {
        setIsError(true);
        setDisplayValue(result);
        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewOperand(true);
        triggerHaptic('error');
        return;
      }

      const formatted = formatResult(result);
      setDisplayValue(formatted);
      setPreviousValue(formatted);
    }

    setWaitingForNewOperand(true);
    setOperator(nextOperator);
  }, [displayValue, isError, operator, previousValue, waitingForNewOperand, angleUnit, soundEnabled]);

  /**
   * Evaluates current calculation or expression
   */
  const handleEquals = useCallback(() => {
    triggerHaptic('medium');
    playKeySound('equals', soundEnabled);

    if (isError) return;

    // 1. Check if the display contains a complex scientific expression or parentheses or constants
    const hasScientificTokens = /[()√^πesincolgtq]/.test(displayValue);

    if (hasScientificTokens) {
      const evalRes = evaluateExpression(displayValue, angleUnit);

      if (typeof evalRes === 'string') {
        setIsError(true);
        setDisplayValue(evalRes);
        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewOperand(true);
        triggerHaptic('error');
        return;
      }

      const formattedResult = formatResult(evalRes);
      const historyItem: CalculationHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        expression: `${displayValue}`,
        result: formattedResult,
        timestamp: new Date(),
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);
      setDisplayValue(formattedResult);
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewOperand(true);
      setBurstKey(prev => prev + 1);
      return;
    }

    // 2. Standard binary calculation with previousValue and operator
    if (operator === null || previousValue === null) return;

    const prevNum = parseFloat(previousValue);
    const currentNum = parseFloat(displayValue);
    const result = calculate(prevNum, currentNum, operator);

    if (typeof result === 'string') {
      setIsError(true);
      setDisplayValue(result);
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewOperand(true);
      triggerHaptic('error');
      return;
    }

    const formattedResult = formatResult(result);
    const expressionString = `${previousValue} ${operator} ${displayValue}`;

    const historyItem: CalculationHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      expression: expressionString,
      result: formattedResult,
      timestamp: new Date(),
    };

    setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);
    setDisplayValue(formattedResult);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewOperand(true);
    setBurstKey(prev => prev + 1);
  }, [displayValue, isError, operator, previousValue, angleUnit, soundEnabled]);

  /**
   * Scientific functions handler (sin, cos, tan, log, ln, sqrt, power, pi, e, parentheses)
   */
  const handleScientific = useCallback((fn: 'sin' | 'cos' | 'tan' | 'log' | 'ln' | 'sqrt' | 'power' | 'pi' | 'e' | 'openParen' | 'closeParen') => {
    triggerHaptic('light');
    playKeySound('sci', soundEnabled);

    if (isError) {
      setIsError(false);
      setDisplayValue('0');
      setWaitingForNewOperand(false);
    }

    // Constant PI
    if (fn === 'pi') {
      if (displayValue === '0' || waitingForNewOperand) {
        setDisplayValue('π');
      } else if (/[0-9πe)]$]/.test(displayValue)) {
        setDisplayValue(displayValue + '×π');
      } else {
        setDisplayValue(displayValue + 'π');
      }
      setWaitingForNewOperand(false);
      return;
    }

    // Constant E
    if (fn === 'e') {
      if (displayValue === '0' || waitingForNewOperand) {
        setDisplayValue('e');
      } else if (/[0-9πe)]$]/.test(displayValue)) {
        setDisplayValue(displayValue + '×e');
      } else {
        setDisplayValue(displayValue + 'e');
      }
      setWaitingForNewOperand(false);
      return;
    }

    // Power operator ^
    if (fn === 'power') {
      handleOperator('^');
      return;
    }

    // Open Parenthesis
    if (fn === 'openParen') {
      if (displayValue === '0' || waitingForNewOperand) {
        setDisplayValue('(');
      } else if (/[0-9πe)]$]/.test(displayValue)) {
        setDisplayValue(displayValue + '×(');
      } else {
        setDisplayValue(displayValue + '(');
      }
      setWaitingForNewOperand(false);
      return;
    }

    // Close Parenthesis
    if (fn === 'closeParen') {
      if (waitingForNewOperand) return;
      setDisplayValue(displayValue + ')');
      return;
    }

    // Unary functions: sin, cos, tan, log, ln, sqrt
    // If the display already shows a simple single number and we're not inside an active expression:
    const isSingleNumber = !isNaN(Number(displayValue)) && !/[()√^×÷+\-]/.test(displayValue);

    if (isSingleNumber && displayValue !== '0' && !waitingForNewOperand) {
      const currentNum = parseFloat(displayValue);
      const res = applyUnaryFunction(currentNum, fn, angleUnit);

      if (typeof res === 'string') {
        setIsError(true);
        setDisplayValue(res);
        triggerHaptic('error');
        return;
      }

      const formatted = formatResult(res);
      const fnLabel = fn === 'sqrt' ? '√' : fn;
      const historyItem: CalculationHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        expression: `${fnLabel}(${displayValue})`,
        result: formatted,
        timestamp: new Date(),
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);
      setDisplayValue(formatted);
      setWaitingForNewOperand(true);
      return;
    }

    // Otherwise, start an expression with the function: e.g. "sin(", "cos(", "√("
    const fnPrefixMap: Record<string, string> = {
      sin: 'sin(',
      cos: 'cos(',
      tan: 'tan(',
      log: 'log(',
      ln: 'ln(',
      sqrt: '√(',
    };

    const prefix = fnPrefixMap[fn];
    if (!prefix) return;

    if (displayValue === '0' || waitingForNewOperand) {
      setDisplayValue(prefix);
      setWaitingForNewOperand(false);
    } else if (/[0-9πe)]$]/.test(displayValue)) {
      setDisplayValue(displayValue + '×' + prefix);
      setWaitingForNewOperand(false);
    } else {
      setDisplayValue(displayValue + prefix);
      setWaitingForNewOperand(false);
    }
  }, [displayValue, isError, waitingForNewOperand, angleUnit, soundEnabled, handleOperator]);

  /**
   * Clears the calculator state
   */
  const handleClear = useCallback(() => {
    triggerHaptic('light');
    playKeySound('clear', soundEnabled);

    setDisplayValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewOperand(false);
    setIsError(false);
  }, [soundEnabled]);

  /**
   * Backspace: removes last digit/symbol or resets to 0
   */
  const handleBackspace = useCallback(() => {
    triggerHaptic('light');
    playKeySound('clear', soundEnabled);

    if (isError) {
      handleClear();
      return;
    }

    if (waitingForNewOperand) return;

    if (displayValue.length > 1) {
      // If ending with a function like "sin(", "cos(", "tan(", "log(", "ln(", "√("
      if (displayValue.endsWith('sin(') || displayValue.endsWith('cos(') || displayValue.endsWith('tan(') || displayValue.endsWith('log(')) {
        const trimmed = displayValue.slice(0, -4);
        setDisplayValue(trimmed || '0');
      } else if (displayValue.endsWith('ln(') || displayValue.endsWith('√(')) {
        const trimmed = displayValue.slice(0, -3);
        setDisplayValue(trimmed || '0');
      } else {
        const trimmed = displayValue.slice(0, -1);
        setDisplayValue(trimmed === '-' || trimmed === '' ? '0' : trimmed);
      }
    } else {
      setDisplayValue('0');
    }
  }, [displayValue, handleClear, isError, waitingForNewOperand, soundEnabled]);

  /**
   * Toggles positive/negative sign (+/-)
   */
  const handleToggleSign = useCallback(() => {
    triggerHaptic('light');
    playKeySound('num', soundEnabled);

    if (isError || displayValue === '0') return;

    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.slice(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  }, [displayValue, isError, soundEnabled]);

  /**
   * Percentage calculation
   */
  const handlePercentage = useCallback(() => {
    triggerHaptic('light');
    playKeySound('op', soundEnabled);

    if (isError) return;

    const current = parseFloat(displayValue);
    if (isNaN(current)) return;

    if (previousValue !== null && operator !== null) {
      const prev = parseFloat(previousValue);
      const percentVal = (prev * current) / 100;
      setDisplayValue(formatResult(percentVal));
    } else {
      const percentVal = current / 100;
      setDisplayValue(formatResult(percentVal));
    }
  }, [displayValue, isError, operator, previousValue, soundEnabled]);

  /**
   * Recalls an item from history
   */
  const handleSelectHistoryItem = (item: CalculationHistoryItem) => {
    setDisplayValue(item.result);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewOperand(true);
    setIsError(false);
  };

  /**
   * Toggles angle unit (DEG / RAD)
   */
  const handleToggleAngleUnit = () => {
    triggerHaptic('light');
    playKeySound('sci', soundEnabled);
    setAngleUnit((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  };

  /**
   * Keyboard support for standard typing & desktop testing
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '^') {
        e.preventDefault();
        handleOperator('^');
      } else if (e.key === '(') {
        e.preventDefault();
        handleScientific('openParen');
      } else if (e.key === ')') {
        e.preventDefault();
        handleScientific('closeParen');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleClear();
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      } else if (e.key.toLowerCase() === 's' && mode === 'scientific') {
        e.preventDefault();
        handleScientific('sin');
      } else if (e.key.toLowerCase() === 'p' && mode === 'scientific') {
        e.preventDefault();
        handleScientific('pi');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClear,
    handlePercentage,
    handleScientific,
    mode,
  ]);

  return (
    <main
      id="evelyn-calculator-app"
      className="relative w-full h-[100dvh] overflow-hidden bg-gradient-to-b from-[#fffefc] via-[#faeff0] to-[#f3e1e4] text-[#3a2c30] flex flex-col justify-between select-none"
    >
      {/* Soft, delicate ambient warm glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/6 -left-16 w-80 h-80 rounded-full bg-[#fce3e1]/60 blur-[100px] pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-1/4 -right-20 w-88 h-88 rounded-full bg-[#ecd2d7]/60 blur-[110px] pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute top-2/3 left-1/4 w-72 h-72 rounded-full bg-[#f7e5dc]/50 blur-[90px] pointer-events-none" 
      />

      {/* Epic Wow Burst Effect on Calculate */}
      <AnimatePresence>
        {burstKey > 0 && (
          <motion.div
            key={burstKey}
            initial={{ scale: 0.2, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-[#cb8d92] via-[#dfafb9] to-transparent rounded-full blur-[60px] pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Main Container - full screen on mobile, comfortably centered on wider screens */}
      <div className="relative z-10 w-full h-full max-w-md mx-auto flex flex-col justify-between px-3.5 sm:px-4 py-1.5 sm:py-2.5">
        {/* Top Header */}
        <Header
          onToggleHistory={() => setIsHistoryOpen(true)}
          hasHistory={history.length > 0}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />

        {/* Mode Switcher Tabs (Basic vs Scientific) - Positioned right above the display */}
        <ModeSwitcher
          mode={mode}
          onModeChange={setMode}
          angleUnit={angleUnit}
          onToggleAngleUnit={handleToggleAngleUnit}
        />

        {/* Display Screen */}
        <Display
          displayValue={displayValue}
          previousValue={previousValue}
          operator={operator}
          waitingForNewOperand={waitingForNewOperand}
          isError={isError}
          mode={mode}
          angleUnit={angleUnit}
          onBackspace={handleBackspace}
        />

        {/* Keypad occupying lower ~60% with responsive grid */}
        <Keypad
          onDigit={handleDigit}
          onOperator={handleOperator}
          onClear={handleClear}
          onToggleSign={handleToggleSign}
          onPercentage={handlePercentage}
          onDecimal={handleDecimal}
          onEquals={handleEquals}
          onBackspace={handleBackspace}
          onScientific={handleScientific}
          activeOperator={operator}
          waitingForOperand={waitingForNewOperand}
          clearLabel={clearLabel}
          mode={mode}
          angleUnit={angleUnit}
          onToggleAngleUnit={handleToggleAngleUnit}
        />
      </div>

      {/* History Slide-over Drawer */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        onSelectHistoryItem={handleSelectHistoryItem}
      />
    </main>
  );
}
