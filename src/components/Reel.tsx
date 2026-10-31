import React from 'react';

interface ReelProps {
  currentTopic: string;
  isSpinning: boolean;
  hasLanded: boolean;
  keyTick: number;
}

export const Reel: React.FC<ReelProps> = ({
  currentTopic,
  isSpinning,
  hasLanded,
  keyTick,
}) => {
  return (
    <section
      className={`reel ${isSpinning ? 'is-spinning' : ''} ${hasLanded ? 'is-landed' : ''}`}
      aria-live="polite"
    >
      <p className="reel-eyebrow">
        {isSpinning ? 'Drawing…' : hasLanded ? 'Your topic' : 'Ready'}
      </p>
      <h2 key={keyTick} className="reel-phrase">
        {currentTopic}
      </h2>
    </section>
  );
};
