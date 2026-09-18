import React from 'react';
import { Delete } from 'lucide-react';
import { motion } from 'motion/react';
import { Operator, CalculatorMode, AngleUnit } from '../types';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: Operator) => void;
  onClear: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onDecimal: () => void;
  onEquals: () => void;
  onBackspace: () => void;
  onScientific: (fn: 'sin' | 'cos' | 'tan' | 'log' | 'ln' | 'sqrt' | 'power' | 'pi' | 'e' | 'openParen' | 'closeParen') => void;
  activeOperator: Operator | null;
  waitingForOperand: boolean;
  clearLabel: 'C' | 'AC';
  mode: CalculatorMode;
  angleUnit: AngleUnit;
  onToggleAngleUnit: () => void;
}

export function Keypad({
  onDigit,
  onOperator,
  onClear,
  onToggleSign,
  onPercentage,
  onDecimal,
  onEquals,
  onBackspace,
  onScientific,
  activeOperator,
  waitingForOperand,
  clearLabel,
  mode,
  angleUnit,
  onToggleAngleUnit,
}: KeypadProps) {
  const isOpActive = (op: Operator) => activeOperator === op && waitingForOperand;

  return (
    <div
      id="calculator-keypad"
      className="w-full flex-1 flex flex-col justify-end gap-2 pb-safe select-none"
    >
      {/* SCIENTIFIC EXPANDABLE RACK - 2 rows of 6 buttons */}
      <motion.div
        id="scientific-rack"
        initial={false}
        animate={{
          height: mode === 'scientific' ? 'auto' : 0,
          opacity: mode === 'scientific' ? 1 : 0,
          marginTop: mode === 'scientific' ? 4 : 0,
          marginBottom: mode === 'scientific' ? 4 : 0,
          scale: mode === 'scientific' ? 1 : 0.92,
          filter: mode === 'scientific' ? 'blur(0px)' : 'blur(8px)'
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full grid grid-cols-6 gap-1.5 sm:gap-2 origin-top overflow-hidden"
        style={{ pointerEvents: mode === 'scientific' ? 'auto' : 'none' }}
      >
        {/* Row 1 of Scientific functions */}
        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-sin"
          type="button"
          onClick={() => onScientific('sin')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-xs sm:text-sm font-medium text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          sin
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-cos"
          type="button"
          onClick={() => onScientific('cos')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-xs sm:text-sm font-medium text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          cos
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-tan"
          type="button"
          onClick={() => onScientific('tan')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-xs sm:text-sm font-medium text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          tan
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-log"
          type="button"
          onClick={() => onScientific('log')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-xs sm:text-sm font-medium text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          log
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-ln"
          type="button"
          onClick={() => onScientific('ln')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-xs sm:text-sm font-medium text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          ln
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-angle"
          type="button"
          onClick={onToggleAngleUnit}
          aria-label={`Angle mode: ${angleUnit}`}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-xs font-semibold tracking-wider text-[#b86e7a] glass-pearl-fn-button border border-[#b86e7a]/30  transition-all cursor-pointer"
        >
          {angleUnit}
        </motion.button>

        {/* Row 2 of Scientific functions */}
        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-sqrt"
          type="button"
          onClick={() => onScientific('sqrt')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-sm sm:text-base font-medium text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          √
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-power"
          type="button"
          onClick={() => onScientific('power')}
          className={`h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-xs sm:text-sm font-medium  transition-all cursor-pointer ${
            isOpActive('^')
              ? 'glass-rose-gold-active text-white'
              : 'text-[#7c545e] glass-sci-button hover:bg-white/80'
          }`}
          aria-label="Power"
        >
          <span>x<sup className="text-[10px] -top-1">y</sup></span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-pi"
          type="button"
          onClick={() => onScientific('pi')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-sm sm:text-base font-serif text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          π
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-e"
          type="button"
          onClick={() => onScientific('e')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-sm sm:text-base font-serif italic text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          e
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-open-paren"
          type="button"
          onClick={() => onScientific('openParen')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-sm sm:text-base font-light text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          (
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sci-close-paren"
          type="button"
          onClick={() => onScientific('closeParen')}
          className="h-10 sm:h-11 rounded-[20px] flex items-center justify-center text-sm sm:text-base font-light text-[#7c545e] glass-sci-button hover:bg-white/80  transition-all cursor-pointer"
        >
          )
        </motion.button>
      </motion.div>

      {/* PRIMARY 4x5 CSS GRID KEYPAD */}
      <motion.div 
        initial={false}
        animate={{
          height: mode === 'scientific' ? '50vh' : '60vh',
          minHeight: mode === 'scientific' ? '340px' : '390px'
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full grid grid-cols-4 grid-rows-5 gap-2 sm:gap-2.5"
      >
        {/* ROW 1: Clear, +/-, %, ÷ */}
        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-clear"
          type="button"
          onClick={onClear}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-lg sm:text-xl font-medium tracking-wide transition-all duration-150  glass-pearl-fn-button text-[#945561] cursor-pointer"
          aria-label="Clear"
        >
          {clearLabel}
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-sign"
          type="button"
          onClick={onToggleSign}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-xl sm:text-2xl font-light transition-all duration-150  glass-pearl-fn-button text-[#7c545e] cursor-pointer select-none"
          aria-label="Toggle Sign (Plus/Minus)"
        >
          ±
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-percent"
          type="button"
          onClick={onPercentage}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-lg sm:text-xl font-light transition-all duration-150  glass-pearl-fn-button text-[#7c545e] cursor-pointer"
          aria-label="Percentage"
        >
          %
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-op-divide"
          type="button"
          onClick={() => onOperator('÷')}
          className={`w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-normal text-white transition-all duration-150  cursor-pointer ${
            isOpActive('÷')
              ? 'glass-rose-gold-active scale-[0.97]'
              : 'glass-rose-gold-operator'
          }`}
          aria-label="Divide"
        >
          ÷
        </motion.button>

        {/* ROW 2: 7, 8, 9, × */}
        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-7"
          type="button"
          onClick={() => onDigit('7')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          7
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-8"
          type="button"
          onClick={() => onDigit('8')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          8
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-9"
          type="button"
          onClick={() => onDigit('9')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          9
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-op-multiply"
          type="button"
          onClick={() => onOperator('×')}
          className={`w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-normal text-white transition-all duration-150  cursor-pointer ${
            isOpActive('×')
              ? 'glass-rose-gold-active scale-[0.97]'
              : 'glass-rose-gold-operator'
          }`}
          aria-label="Multiply"
        >
          ×
        </motion.button>

        {/* ROW 3: 4, 5, 6, − */}
        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-4"
          type="button"
          onClick={() => onDigit('4')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          4
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-5"
          type="button"
          onClick={() => onDigit('5')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          5
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-6"
          type="button"
          onClick={() => onDigit('6')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          6
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-op-subtract"
          type="button"
          onClick={() => onOperator('-')}
          className={`w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-normal text-white transition-all duration-150  cursor-pointer ${
            isOpActive('-')
              ? 'glass-rose-gold-active scale-[0.97]'
              : 'glass-rose-gold-operator'
          }`}
          aria-label="Subtract"
        >
          −
        </motion.button>

        {/* ROW 4: 1, 2, 3, + */}
        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-1"
          type="button"
          onClick={() => onDigit('1')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          1
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-2"
          type="button"
          onClick={() => onDigit('2')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          2
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-3"
          type="button"
          onClick={() => onDigit('3')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          3
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-op-add"
          type="button"
          onClick={() => onOperator('+')}
          className={`w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-normal text-white transition-all duration-150  cursor-pointer ${
            isOpActive('+')
              ? 'glass-rose-gold-active scale-[0.97]'
              : 'glass-rose-gold-operator'
          }`}
          aria-label="Add"
        >
          +
        </motion.button>

        {/* ROW 5: 0, ., DEL, = */}
        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-num-0"
          type="button"
          onClick={() => onDigit('0')}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
        >
          0
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-decimal"
          type="button"
          onClick={onDecimal}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-light text-[#3a2c30] transition-all duration-150  glass-pearl-button cursor-pointer"
          aria-label="Decimal point"
        >
          .
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-backspace"
          type="button"
          onClick={onBackspace}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-[#7c545e] transition-all duration-150  glass-pearl-fn-button cursor-pointer"
          aria-label="Backspace"
        >
          <Delete className="w-5 h-5 text-[#8c5a66]" />
        </motion.button>

        <motion.button whileTap={{ scale: 0.88, filter: "brightness(1.15)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
          id="btn-equals"
          type="button"
          onClick={onEquals}
          className="w-full h-full min-h-[68px] sm:min-h-[72px] rounded-[32px] flex items-center justify-center text-2xl sm:text-3xl font-medium text-white transition-all duration-150  glass-rose-gold-operator cursor-pointer"
          aria-label="Equals"
        >
          =
        </motion.button>
      </motion.div>
    </div>
  );
}
