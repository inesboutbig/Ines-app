import React from 'react';

interface AudioWaveformProps {
  frequencies: number[];
  isSpeaking: boolean;
  isListening: boolean;
  isLoading: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  frequencies,
  isSpeaking,
  isListening,
  isLoading,
}) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-16 px-4">
      {frequencies.map((freq, idx) => {
        // Compute height based on state
        let height = 8;
        if (isSpeaking) {
          height = Math.max(8, Math.min(60, (freq / 255) * 60 + 10));
        } else if (isListening) {
          height = Math.max(10, Math.min(50, (freq / 80) * 45 + 10));
        } else if (isLoading) {
          height = 14 + Math.sin(Date.now() / 200 + idx) * 10;
        }

        return (
          <div
            key={idx}
            className={`w-1.5 rounded-full transition-all duration-75 ${
              isSpeaking
                ? 'bg-gradient-to-t from-[#B38038] via-[#D4AF37] to-[#F3E5AB] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                : isListening
                ? 'bg-gradient-to-t from-rose-500 via-amber-500 to-amber-300 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                : isLoading
                ? 'bg-stone-300 animate-pulse'
                : 'bg-stone-300/70'
            }`}
            style={{
              height: `${height}px`,
              animationDelay: `${idx * 0.08}s`,
            }}
          />
        );
      })}
    </div>
  );
};
