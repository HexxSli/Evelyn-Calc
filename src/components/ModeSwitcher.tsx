import { motion } from 'motion/react';
import { CalculatorMode, AngleUnit } from '../types';

interface ModeSwitcherProps {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  angleUnit: AngleUnit;
  onToggleAngleUnit: () => void;
}

export function ModeSwitcher({
  mode,
  onModeChange,
  angleUnit,
  onToggleAngleUnit,
}: ModeSwitcherProps) {
  return (
    <div
      id="mode-switcher-container"
      className="w-full flex items-center justify-between px-1 py-1.5 shrink-0 select-none z-20"
    >
      {/* Sleek Dual Toggle Pill */}
      <div 
        role="tablist"
        aria-label="Calculator mode"
        className="flex-1 max-w-[220px] mx-auto p-1 rounded-full flex items-center justify-between relative shadow-[0_4px_16px_rgba(180,130,138,0.08)] border border-white/60 bg-white/40 backdrop-blur-xl"
      >
        <motion.button whileTap={{ scale: 0.95 }}
          id="mode-tab-basic"
          role="tab"
          aria-selected={mode === 'basic'}
          type="button"
          onClick={() => onModeChange('basic')}
          className={`relative flex-1 py-1.5 px-3 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 cursor-pointer ${
            mode === 'basic'
              ? 'text-white shadow-sm'
              : 'text-[#6e565f] hover:text-[#382b31] bg-transparent'
          }`}
        >
          {mode === 'basic' && (
            <motion.div 
              layoutId="activeModePill" 
              className="absolute inset-0 rounded-full glass-rose-gold-operator shadow-md shadow-[#b86e7a]/25 -z-10" 
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <span className="relative z-10">Basic</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.95 }}
          id="mode-tab-scientific"
          role="tab"
          aria-selected={mode === 'scientific'}
          type="button"
          onClick={() => onModeChange('scientific')}
          className={`relative flex-1 py-1.5 px-3 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 cursor-pointer ${
            mode === 'scientific'
              ? 'text-white shadow-sm'
              : 'text-[#6e565f] hover:text-[#382b31] bg-transparent'
          }`}
        >
          {mode === 'scientific' && (
            <motion.div 
              layoutId="activeModePill" 
              className="absolute inset-0 rounded-full glass-rose-gold-operator shadow-md shadow-[#b86e7a]/25 -z-10" 
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <span className="relative z-10">Scientific</span>
        </motion.button>
      </div>

      {/* Angle Mode Badge (DEG / RAD) - Visible and interactive when in Scientific Mode */}
      {mode === 'scientific' && (
        <motion.button whileTap={{ scale: 0.95 }}
          id="btn-angle-unit"
          type="button"
          onClick={onToggleAngleUnit}
          aria-label={`Toggle angle unit (Current: ${angleUnit})`}
          title="Click to toggle DEG / RAD"
          className="ml-2 px-2.5 py-1 rounded-full glass-pearl-button text-[11px] font-semibold tracking-wider text-[#9e5462] hover:text-[#7d3b48] border border-[#b86e7a]/30 transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          {angleUnit}
        </motion.button>
      )}
    </div>
  );
}
