import { Trash2, X } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: CalculationHistoryItem) => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectHistoryItem,
}: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="history-modal-backdrop"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/35 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        id="history-modal-content"
        className="w-full max-h-[75vh] bg-[#fdfaf8]/95 border-t border-[#b86e7a]/25 rounded-t-[32px] p-5 flex flex-col shadow-[0_-10px_40px_rgba(180,120,130,0.15)] overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar for native mobile drawer feeling */}
        <div className="w-12 h-1 bg-[#d8c2c7] rounded-full mx-auto mb-4" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ebd7dc] mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium tracking-wider text-[#3c2b32] uppercase">
              CALCULATION HISTORY
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#b86e7a]/15 text-[#9e5462] font-medium">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {history.length > 0 && (
              <button
                id="clear-history-btn"
                onClick={onClearHistory}
                className="p-1.5 text-[#a86571] hover:text-[#84434e] transition-colors rounded-lg hover:bg-[#b86e7a]/10 active:scale-95 cursor-pointer"
                title="Clear All History"
                aria-label="Clear All History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              id="close-history-btn"
              onClick={onClose}
              className="p-1.5 text-[#8c747d] hover:text-[#3c2b32] transition-colors rounded-lg hover:bg-black/5 active:scale-95 cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History Item List */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#f2e2e6] pr-1 space-y-0.5">
          {history.length === 0 ? (
            <div className="py-12 text-center text-[#a8959d] text-sm font-normal">
              No calculations recorded yet
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="w-full text-right py-3 px-3 rounded-2xl hover:bg-[#faeff1] active:bg-[#f6e2e5] transition-colors group flex flex-col items-end cursor-pointer"
              >
                <div className="text-xs text-[#9a848c] tracking-wide group-hover:text-[#b86e7a] transition-colors">
                  {item.expression} =
                </div>
                <div className="text-2xl font-light text-[#2d2227] group-hover:text-[#b86e7a] transition-colors">
                  {item.result}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
