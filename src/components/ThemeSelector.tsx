import React from 'react';
import { THEME_LIST } from '../themes';
import type { ThemeId } from '../themes';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  compact = false,
}) => {
  return (
    <div
      className="palette-selector"
      role="region"
      aria-label="Color Theme Switcher"
    >
      <div className="palette-selector-head">
        <span className="palette-selector-label">Colour Palette</span>
        <span className="text-xs text-[var(--muted)]">{THEME_LIST.length} Adaptive Themes</span>
      </div>

      <div
        className="palette-grid"
        role="radiogroup"
        aria-label="Select website palette"
      >
        {THEME_LIST.map((theme) => {
          const isSelected = theme.id === currentTheme;
          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectTheme(theme.id)}
              className={`palette-card ${isSelected ? 'is-selected' : ''}`}
              title={`${theme.name} — ${theme.tagline}${
                theme.isRecommended ? ' (Recommended for optimal speaking focus)' : ''
              }`}
            >
              {/* Swatch row */}
              <div className="palette-swatches" aria-hidden="true">
                {theme.swatchColors.map((color, i) => (
                  <div
                    key={i}
                    className="palette-swatch-dot"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Title and tags */}
              <div className="palette-name-row">
                <span className="palette-title">{theme.name}</span>
                {isSelected && (
                  <Check
                    size={13}
                    className="text-[var(--accent)] flex-shrink-0"
                    strokeWidth={2.6}
                  />
                )}
              </div>

              {theme.isRecommended && (
                <div className="flex items-center justify-between">
                  <span className="palette-recommended-badge">
                    Recommended
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!compact && (
        <p className="text-[0.76rem] text-[var(--muted)] mt-1 leading-relaxed">
          <strong className="text-[var(--accent)]">Sage Studio</strong> is recommended for
          impromptu speaking: soft forest greens calm sympathetic nervous arousal while
          offering 12.8:1 AAA contrast.
        </p>
      )}
    </div>
  );
};
