import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDisplayValue } from '../utils/calculator';
import { Operator, CalculatorMode, AngleUnit } from '../types';

interface DisplayProps {
  displayValue: string;
  previousValue: string | null;
  operator: Operator | null;
  waitingForNewOperand: boolean;
  isError: boolean;
  mode: CalculatorMode;
  angleUnit: AngleUnit;
  onBackspace: () => void;
}

export function Display({
  displayValue,
  previousValue,
  operator,
  waitingForNewOperand,
  isError,
  mode,
  angleUnit,
  onBackspace,
}: DisplayProps) {
  const touchStartX = useRef<number | null>(null);

  // Formatted string to show on the massive screen
  const formattedValue = formatDisplayValue(displayValue);

  // Dynamic font sizing depending on string length to prevent overflow on phone screens
  const getFontSizeClass = (val: string) => {
    const len = val.length;
    if (len <= 5) return 'text-5xl sm:text-6xl';
    if (len <= 8) return 'text-4xl sm:text-5xl';
    if (len <= 12) return 'text-3xl sm:text-4xl';
    if (len <= 16) return 'text-2xl sm:text-3xl';
    if (len <= 20) return 'text-xl sm:text-2xl';
    return 'text-lg sm:text-xl';
  };

  // Construct upper equation line
  let equationPreview = '';
  if (previousValue !== null && operator !== null) {
    equationPreview = `${formatDisplayValue(previousValue)} ${operator}`;
    if (!waitingForNewOperand && !isError) {
      equationPreview += ` ...`;
    }
  }

  // Handle swipe left/right on display to backspace
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;
      if (Math.abs(diff) > 40) {
        onBackspace();
      }
      touchStartX.current = null;
    }
  };

  return (
    <div
      id="calculator-display-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full flex-1 min-h-[115px] max-h-[185px] px-6 py-2 flex flex-col justify-end items-end relative select-none mx-auto my-1 transition-all duration-200 bg-transparent"
    >
      {/* Subtle soft warmth glow behind display (removed for borderless clean look, relying on app bg) */}

      {/* Top Expression/Status Line */}
      <div className="w-full flex items-center justify-between min-h-[24px] mb-1 z-10">
        <div className="flex items-center gap-1.5">
          {mode === 'scientific' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-[#b86e7a]/15 text-[#9e5462]">
              SCI • {angleUnit}
            </span>
          )}
          {operator && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-[#b86e7a]/20 text-[#8c4350]">
              {operator}
            </span>
          )}
          {isError && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-[#d9777f]/20 text-[#b84852]">
              ERROR
            </span>
          )}
        </div>

        <div 
          id="display-equation-preview" 
          className="text-right text-xs sm:text-sm font-normal tracking-wide text-[#947c84] overflow-hidden text-ellipsis whitespace-nowrap max-w-[70%]"
        >
          {equationPreview || '\u00A0'}
        </div>
      </div>

      {/* Massive Main Value Screen */}
      <div 
        id="display-main-value"
        className={`w-full text-right font-extralight tracking-tight break-all select-all leading-none z-10 drop-shadow-sm ${getFontSizeClass(
          formattedValue
        )} ${
          isError
            ? 'text-[#b84852] font-normal'
            : 'text-[#3a2d32]'
        }`}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formattedValue}
            initial={{ opacity: 0.5, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 450, damping: 25, mass: 0.8 }}
            className="inline-block"
          >
            {formattedValue}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Mobile interaction hint */}
      <div className="w-full flex justify-end items-center pt-1 z-10">
        <span className="text-[9px] text-[#ad9ca3] tracking-widest uppercase font-medium">
          {displayValue.length > 1 && !isError ? 'Swipe to delete' : ''}
        </span>
      </div>
    </div>
  );
}
