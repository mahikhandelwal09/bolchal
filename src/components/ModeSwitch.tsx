import React, { useRef } from 'react';
import { PRACTICE_MODES } from '../data/topics';

interface ModeSwitchProps {
  value: 'off-the-cuff' | 'deep-research';
  onChange: (modeId: 'off-the-cuff' | 'deep-research') => void;
  disabled?: boolean;
}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentIndex = Math.max(0, PRACTICE_MODES.findIndex((m) => m.id === value));

  const handleArrowNav = (nextIdx: number) => {
    const wrappedIdx = (nextIdx + PRACTICE_MODES.length) % PRACTICE_MODES.length;
    onChange(PRACTICE_MODES[wrappedIdx].id);
    optionRefs.current[wrappedIdx]?.focus();
  };

  return (
    <div
      className={`mode-switch ${disabled ? 'is-disabled' : ''}`}
      role="radiogroup"
      aria-label="Practice mode"
      onKeyDown={(e) => {
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            handleArrowNav(currentIndex + 1);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            handleArrowNav(currentIndex - 1);
            break;
        }
      }}
    >
      <span
        className="mode-thumb"
        aria-hidden="true"
        style={{ '--i': currentIndex } as React.CSSProperties}
      />
      {PRACTICE_MODES.map((mode, idx) => {
        const isActive = mode.id === value;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            ref={(el) => {
              optionRefs.current[idx] = el;
            }}
            className={`mode-option ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(mode.id)}
          >
            <span className="mode-emoji" aria-hidden="true">
              {mode.emoji}
            </span>
            <span className="mode-label">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};
