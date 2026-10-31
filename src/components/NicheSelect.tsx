import React, { useState, useRef, useEffect, useId } from 'react';
import { NICHES } from '../data/topics';

interface NicheSelectProps {
  value: string;
  onChange: (nicheId: string) => void;
  disabled?: boolean;
}

export const NicheSelect: React.FC<NicheSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const menuId = useId();

  const currentIndex = Math.max(0, NICHES.findIndex((n) => n.id === value));
  const currentNiche = NICHES[currentIndex] || NICHES[0];

  const closeMenu = (focusTrigger = false) => {
    setIsOpen(false);
    if (focusTrigger) {
      triggerRef.current?.focus();
    }
  };

  const handleSelect = (index: number) => {
    onChange(NICHES[index].id);
    closeMenu(true);
  };

  // Focus highlighted item when open
  useEffect(() => {
    if (isOpen) {
      optionRefs.current[highlightedIndex]?.focus();
    }
  }, [isOpen, highlightedIndex]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close when disabled
  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  return (
    <div
      className={`niche-select ${isOpen ? 'is-open' : ''}`}
      ref={containerRef}
    >
      <button
        type="button"
        className="niche-trigger"
        ref={triggerRef}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => {
          setHighlightedIndex(currentIndex);
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(currentIndex);
            setIsOpen(true);
          }
        }}
      >
        <span className="niche-emoji" aria-hidden="true">
          {currentNiche.emoji}
        </span>
        <span className="niche-label">{currentNiche.label}</span>
        <span className="niche-caret" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          id={menuId}
          className="niche-menu"
          role="listbox"
          aria-label="Topic niche"
          onKeyDown={(e) => {
            switch (e.key) {
              case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev + 1) % NICHES.length);
                break;
              case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev - 1 + NICHES.length) % NICHES.length);
                break;
              case 'Home':
                e.preventDefault();
                setHighlightedIndex(0);
                break;
              case 'End':
                e.preventDefault();
                setHighlightedIndex(NICHES.length - 1);
                break;
              case 'Enter':
              case ' ':
                e.preventDefault();
                handleSelect(highlightedIndex);
                break;
              case 'Escape':
                e.preventDefault();
                closeMenu(true);
                break;
              case 'Tab':
                closeMenu(false);
                break;
            }
          }}
        >
          {NICHES.map((niche, idx) => {
            const isSelected = niche.id === value;
            return (
              <div
                key={niche.id}
                role="option"
                aria-selected={isSelected}
                tabIndex={idx === highlightedIndex ? 0 : -1}
                ref={(el) => {
                  optionRefs.current[idx] = el;
                }}
                className={`niche-option ${isSelected ? 'is-active' : ''}`}
                onClick={() => handleSelect(idx)}
              >
                <span className="niche-emoji" aria-hidden="true">
                  {niche.emoji}
                </span>
                <span className="niche-label">{niche.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
