import React, { useState, useRef, useEffect, useId } from 'react';
import type { ThemeId } from '../themes';
import { ThemeSelector } from './ThemeSelector';

interface SettingsModalProps {
  speechSeconds: number;
  researchSeconds: number;
  onChangeSpeech: (seconds: number) => void;
  onChangeResearch: (seconds: number) => void;
  muted: boolean;
  onChangeMuted: (muted: boolean) => void;
  currentTheme: ThemeId;
  onChangeTheme: (themeId: ThemeId) => void;
  cameraEnabled: boolean;
  onChangeCameraEnabled: (enabled: boolean) => void;
  autoRecord: boolean;
  onChangeAutoRecord: (record: boolean) => void;
  dayCounterEnabled: boolean;
  onChangeDayCounterEnabled: (enabled: boolean) => void;
  currentDay: number;
  onChangeCurrentDay: (day: number) => void;
  totalDays: number;
  onChangeTotalDays: (total: number) => void;
  disabled?: boolean;
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
  speechSeconds,
  researchSeconds,
  onChangeSpeech,
  onChangeResearch,
  muted,
  onChangeMuted,
  currentTheme,
  onChangeTheme,
  cameraEnabled,
  onChangeCameraEnabled,
  autoRecord,
  onChangeAutoRecord,
  dayCounterEnabled,
  onChangeDayCounterEnabled,
  currentDay,
  onChangeCurrentDay,
  totalDays,
  onChangeTotalDays,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const panelId = useId();
  const titleId = useId();
  const muteCheckboxId = useId();
  const cameraCheckboxId = useId();
  const recordCheckboxId = useId();
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

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Keyboard navigation & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  return (
    <div className={`settings ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="settings-trigger"
        ref={triggerRef}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-label="Settings"
        title="Settings & Themes"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
          <path d="M19.4 13.05a7.4 7.4 0 0 0 0-2.1l1.7-1.32a.55.55 0 0 0 .13-.7l-1.7-2.94a.55.55 0 0 0-.66-.24l-2 .8a7.6 7.6 0 0 0-1.82-1.05l-.3-2.13A.55.55 0 0 0 14.2 3h-4.4a.55.55 0 0 0-.55.46l-.3 2.13a7.6 7.6 0 0 0-1.82 1.05l-2-.8a.55.55 0 0 0-.66.24L2.77 8.93a.55.55 0 0 0 .13.7L4.6 10.95a7.4 7.4 0 0 0 0 2.1l-1.7 1.32a.55.55 0 0 0-.13.7l1.7 2.94c.14.25.43.35.66.24l2-.8c.55.42 1.16.76 1.82 1.05l.3 2.13c.05.26.28.46.55.46h4.4c.27 0 .5-.2.55-.46l.3-2.13c.66-.29 1.27-.63 1.82-1.05l2 .8c.23.11.52 0 .66-.24l1.7-2.94a.55.55 0 0 0-.13-.7l-1.7-1.32Z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="settings-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleClose();
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
              <h2 className="settings-panel-title" id={titleId}>
                Settings
              </h2>
              <p className="settings-panel-blurb">
                Customize timers, colour theme, camera and practice preferences.
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

            {/* Practice Toggles */}
            <div className="settings-mute">
              <input
                id={muteCheckboxId}
                type="checkbox"
                checked={muted}
                onChange={(e) => onChangeMuted(e.target.checked)}
              />
              <label htmlFor={muteCheckboxId}>Mute sound effects</label>
            </div>

            <div className="settings-mute">
              <input
                id={cameraCheckboxId}
                type="checkbox"
                checked={cameraEnabled}
                onChange={(e) => onChangeCameraEnabled(e.target.checked)}
              />
              <label htmlFor={cameraCheckboxId}>
                Enable camera preview for speaking stage
              </label>
            </div>

            {cameraEnabled && (
              <div className="settings-mute pl-4 border-l-2 border-[var(--border)]">
                <input
                  id={recordCheckboxId}
                  type="checkbox"
                  checked={autoRecord}
                  onChange={(e) => onChangeAutoRecord(e.target.checked)}
                />
                <label htmlFor={recordCheckboxId}>
                  Record speech video for playback review
                </label>
              </div>
            )}

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
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
