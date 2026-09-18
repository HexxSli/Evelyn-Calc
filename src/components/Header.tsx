import { History, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onToggleHistory: () => void;
  hasHistory: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Header({
  onToggleHistory,
  hasHistory,
  soundEnabled,
  onToggleSound,
}: HeaderProps) {
  return (
    <header className="w-full pt-safe px-4 pt-3 pb-1 flex flex-col items-center justify-between shrink-0 select-none">
      {/* Mobile top status bar indicator */}
      <div className="w-full flex items-center justify-between text-[11px] tracking-widest text-[#8d757d] mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#b86e7a] shadow-[0_0_6px_rgba(184,110,122,0.4)]" />
          <span className="font-medium tracking-[0.15em] text-[#8d757d] text-[10px]">
            STUDIO EDITION
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.8 }}
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute acoustic chime' : 'Enable acoustic chime'}
            className={`p-1.5 rounded-full glass-pearl-button transition-all cursor-pointer ${
              soundEnabled ? 'text-[#b86e7a]' : 'text-[#a18e95] hover:text-[#3b2a30]'
            }`}
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </motion.button>
          
          <motion.button whileTap={{ scale: 0.8 }}
            id="history-toggle-btn"
            onClick={onToggleHistory}
            aria-label="View calculation history"
            className={`p-1.5 rounded-full glass-pearl-button transition-all cursor-pointer relative ${
              hasHistory 
                ? 'text-[#b86e7a] border-[#b86e7a]/40 shadow-[0_2px_10px_rgba(184,110,122,0.15)]' 
                : 'text-[#a18e95] hover:text-[#3b2a30]'
            }`}
            title="History"
          >
            <History className="w-3.5 h-3.5" />
            {hasHistory && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#b86e7a]" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Prominent Header Title - Elegant Minimalist Luxury Lifestyle Aesthetic */}
      <div className="flex flex-col items-center justify-center py-0.5">
        <h1 
          id="calculator-title" 
          className="text-xs sm:text-sm font-normal uppercase text-[#5a464c] select-none tracking-[0.4em] opacity-80"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          E V E L Y N
        </h1>
      </div>
    </header>
  );
}
