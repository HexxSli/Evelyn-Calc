// Soft, elegant acoustic feedback using Web Audio API
let audioCtx: AudioContext | null = null;

export function playKeySound(type: 'num' | 'op' | 'equals' | 'clear' | 'sci' = 'num', enabled: boolean = false) {
  if (!enabled) return;

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const now = audioCtx.currentTime;
    let freq = 523.25; // C5 warm chime

    if (type === 'op') freq = 659.25; // E5 soft rose chime
    else if (type === 'equals') freq = 783.99; // G5 delicate bell
    else if (type === 'clear') freq = 392.00; // G4 warm tone
    else if (type === 'sci') freq = 739.99; // F#5 soft acoustic chime

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Very gentle envelope
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // AudioContext blocked or not supported
  }
}
