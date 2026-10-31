import React, { useState, useRef, useEffect, useId } from 'react';
import type { ThemeId } from '../themes';
import { ThemeSelector } from './ThemeSelector';
import { X } from 'lucide-react';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speechSeconds: number;
  researchSeconds: number;
  onChangeSpeech: (seconds: number) => void;
  onChangeResearch: (seconds: number) => void;
  muted: boolean;
  onChangeMuted: (muted: boolean) => void;
  currentTheme: ThemeId;
  onChangeTheme: (themeId: ThemeId) => void;
  dayCounterEnabled: boolean;
  onChangeDayCounterEnabled: (enabled: boolean) => void;
  currentDay: number;
  onChangeCurrentDay: (day: number) => void;
  totalDays: number;
  onChangeTotalDays: (total: number) => void;
}

function formatMinutes(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins && secs) return `${mins} min ${secs} sec`;
  if (mins) return `${mins} min`;
  if (seconds === 0) return '0 min';
  return `${secs} sec`;
}

function formatDayNumber(n: number): string {
  return String(Math.max(1, Math.floor(n))).padStart(2, '0');
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  speechSeconds,
  researchSeconds,
  onChangeSpeech,
  onChangeResearch,
  muted,
  onChangeMuted,
  currentTheme,
  onChangeTheme,
  dayCounterEnabled,
  onChangeDayCounterEnabled,
  currentDay,
  onChangeCurrentDay,
  totalDays,
  onChangeTotalDays,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const panelId = useId();
  const titleId = useId();
  const muteCheckboxId = useId();
  const speechSliderId = useId();
  const researchSliderId = useId();
  const dayCounterToggleId = useId();
  const currentDayInputId = useId();
  const totalDaysInputId = useId();

  // Day Counter input state & validation
  const [currentDayStr, setCurrentDayStr] = useState<string>(() => String(currentDay));
  const [totalDaysStr, setTotalDaysStr] = useState<string>(() => String(totalDays));
  const [dayError, setDayError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDayStr(String(currentDay));
  }, [currentDay]);

  useEffect(() => {
    setTotalDaysStr(String(totalDays));
  }, [totalDays]);

  const validateAndApplyDays = (cur: string, tot: string) => {
    const trimmedCur = cur.trim();
    const trimmedTot = tot.trim();

    if (trimmedCur === '' || trimmedTot === '') {
      setDayError('Please enter both current day and total days.');
      return;
    }

    if (!/^\d+$/.test(trimmedCur) || !/^\d+$/.test(trimmedTot)) {
      setDayError('Accepts only positive whole numbers.');
      return;
    }

    const c = parseInt(trimmedCur, 10);
    const t = parseInt(trimmedTot, 10);

    if (c < 1 || t < 1) {
      setDayError('Neither value can be less than 1.');
      return;
    }

    if (c > t) {
      setDayError('Current Day cannot exceed Total Days.');
      return;
    }

    setDayError(null);
    onChangeCurrentDay(c);
    onChangeTotalDays(t);
  };

  const handleCurrentDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentDayStr(val);
    validateAndApplyDays(val, totalDaysStr);
  };

  const handleTotalDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTotalDaysStr(val);
    validateAndApplyDays(currentDayStr, val);
  };

  const speechMinutes = Math.round(speechSeconds / 60);
  const researchMinutes = Math.round(researchSeconds / 60);

  // Escape key listener & focus management
  useEffect(() => {
    if (!isOpen) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="settings-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="settings-panel"
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
      >
        <header className="settings-panel-head">
          <div className="settings-panel-header-row">
            <h2 className="settings-panel-title" id={titleId}>
              Settings
            </h2>
            <button
              type="button"
              className="settings-close-btn"
              onClick={onClose}
              ref={closeBtnRef}
              aria-label="Close settings"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
          <p className="settings-panel-blurb">
            Customize timers, colour theme, and practice preferences.
          </p>
        </header>

        {/* Theme Palette Selector */}
        <ThemeSelector
          currentTheme={currentTheme}
          onSelectTheme={onChangeTheme}
        />

        {/* Speech Duration Slider */}
        <div className="duration-field">
          <div className="duration-head">
            <label className="duration-label" htmlFor={speechSliderId}>
              Speech
            </label>
            <span className="duration-value" aria-live="polite">
              {formatMinutes(speechSeconds)}
            </span>
          </div>
          <input
            id={speechSliderId}
            className="duration-slider"
            type="range"
            min={1}
            max={10}
            step={1}
            value={speechMinutes}
            onChange={(e) => onChangeSpeech(Number(e.target.value) * 60)}
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={speechMinutes}
            aria-valuetext={formatMinutes(speechSeconds)}
          />
          <div className="duration-ends" aria-hidden="true">
            <span>1 min</span>
            <span>10 min</span>
          </div>
        </div>

        {/* Research Duration Slider */}
        <div className="duration-field">
          <div className="duration-head">
            <label className="duration-label" htmlFor={researchSliderId}>
              Research
            </label>
            <span className="duration-value" aria-live="polite">
              {formatMinutes(researchSeconds)}
            </span>
          </div>
          <input
            id={researchSliderId}
            className="duration-slider"
            type="range"
            min={1}
            max={60}
            step={1}
            value={researchMinutes}
            onChange={(e) => onChangeResearch(Number(e.target.value) * 60)}
            aria-valuemin={1}
            aria-valuemax={60}
            aria-valuenow={researchMinutes}
            aria-valuetext={formatMinutes(researchSeconds)}
          />
          <div className="duration-ends" aria-hidden="true">
            <span>1 min</span>
            <span>60 min</span>
          </div>
          <p className="duration-hint">Deep research only</p>
        </div>

        {/* Sound Toggle */}
        <div className="settings-mute">
          <input
            id={muteCheckboxId}
            type="checkbox"
            checked={muted}
            onChange={(e) => onChangeMuted(e.target.checked)}
          />
          <label htmlFor={muteCheckboxId}>Mute sound effects</label>
        </div>

        {/* Day Counter Section */}
        <div className="settings-section-divider">
          <div className="settings-section-head">
            <span className="duration-label">Day Counter</span>
            <span className="text-xs text-[var(--muted)]">Habit / Challenge</span>
          </div>

          <div className="settings-mute">
            <input
              id={dayCounterToggleId}
              type="checkbox"
              checked={dayCounterEnabled}
              onChange={(e) => onChangeDayCounterEnabled(e.target.checked)}
            />
            <label htmlFor={dayCounterToggleId}>Enable Day Counter</label>
          </div>

          {dayCounterEnabled && (
            <div className="day-counter-inputs-container">
              <div className="day-counter-grid">
                <div className="day-counter-field">
                  <label htmlFor={currentDayInputId} className="day-counter-label">
                    Current Day
                  </label>
                  <input
                    id={currentDayInputId}
                    type="number"
                    min="1"
                    step="1"
                    value={currentDayStr}
                    onChange={handleCurrentDayChange}
                    className="day-counter-input"
                    placeholder="04"
                  />
                </div>

                <div className="day-counter-field">
                  <label htmlFor={totalDaysInputId} className="day-counter-label">
                    Total Days
                  </label>
                  <input
                    id={totalDaysInputId}
                    type="number"
                    min="1"
                    step="1"
                    value={totalDaysStr}
                    onChange={handleTotalDaysChange}
                    className="day-counter-input"
                    placeholder="30"
                  />
                </div>
              </div>

              {dayError ? (
                <p className="day-counter-error" role="alert">
                  {dayError}
                </p>
              ) : (
                <div className="day-counter-preview">
                  <span>Preview:</span>
                  <span className="day-counter-preview-pill">
                    DAY {formatDayNumber(currentDay)} / {formatDayNumber(totalDays)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="settings-note">Saved for next time.</p>

        <button
          type="button"
          className="btn primary settings-done"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
};
