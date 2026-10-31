import React, { useRef, useEffect } from 'react';
import { SPEECH_STAGES } from '../data/topics';
import { FlipHorizontal } from 'lucide-react';

interface TimerOverlayProps {
  topic: string;
  mode: 'off-the-cuff' | 'deep-research';
  timerState: 'idle' | 'research' | 'ready' | 'speech' | 'done';
  remainingSeconds: number;
  totalDurationSeconds: number;
  speechDurationSeconds: number;
  isMirrored: boolean;
  onToggleMirror: () => void;
  onDoneResearching: () => void;
  onStartSpeech: () => void;
  onClose: () => void;
}

function formatDigits(seconds: number): string {
  const t = Math.max(0, Math.floor(seconds));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatMinutesText(seconds: number): string {
  const t = Math.max(0, Math.floor(seconds));
  const m = Math.floor(t / 60);
  const s = t % 60;
  if (m && s) return `${m} min ${s} sec`;
  if (m) return `${m} min`;
  if (t === 0) return '0 min';
  return `${s} sec`;
}

function computeSpeechArcHitIndex(
  remaining: number,
  total: number,
  isDone: boolean
): number {
  if (isDone || total <= 0) return SPEECH_STAGES.length;
  const elapsed = total - remaining;
  const slice = total / SPEECH_STAGES.length;
  if (elapsed >= slice * 2) return 3;
  if (elapsed >= slice) return 2;
  return 1;
}

function computeProgress(remaining: number, total: number): number {
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, 1 - remaining / total));
}

export const TimerOverlay: React.FC<TimerOverlayProps> = ({
  topic,
  mode,
  timerState,
  remainingSeconds,
  totalDurationSeconds,
  speechDurationSeconds,
  isMirrored,
  onToggleMirror,
  onDoneResearching,
  onStartSpeech,
  onClose,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  const isResearch = timerState === 'research';
  const isSpeech = timerState === 'speech' || timerState === 'done';
  const isDone = timerState === 'done';
  const isReady = timerState === 'ready';

  const progress = isReady
    ? 0
    : computeProgress(remainingSeconds, totalDurationSeconds);

  const hitStages = computeSpeechArcHitIndex(
    remainingSeconds,
    totalDurationSeconds,
    isDone
  );

  const isOffTheCuffSpeech = mode === 'off-the-cuff' && isSpeech;

  // Dialog label and status text
  const ariaLabel = isResearch
    ? 'Research timer'
    : isReady
    ? 'Ready to speak'
    : 'Speech timer';

  const statusText = isResearch
    ? 'Research.'
    : isReady
    ? 'Research done.'
    : isDone
    ? 'Time.'
    : 'Speak.';

  // Focus primary action button or close on mount
  useEffect(() => {
    if (primaryButtonRef.current) {
      primaryButtonRef.current.focus();
    } else if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [timerState]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={`timer-overlay ${isDone ? 'is-done' : 'is-live'} ${
        isResearch ? 'is-research' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div className="timer-overlay-inner">
        {/* Mirrored Stage Content */}
        <div className={`timer-mirrored-content ${isMirrored ? 'is-mirrored-page' : ''}`}>
          {/* Topic Title */}
          {topic && <h3 className="timer-topic">{topic}</h3>}

          {/* Phase eyebrow if in research */}
          {isResearch && <p className="timer-phase">Researching</p>}

          {/* Speech Arc Stages (What? So what? Now what?) */}
          {isOffTheCuffSpeech && (
            <ol className="speech-stages" aria-label="Speech arc">
              {SPEECH_STAGES.map((stage, idx) => (
                <li
                  key={stage}
                  className={`speech-stage ${
                    idx < hitStages ? 'is-hit' : 'is-pending'
                  }`}
                >
                  <span className="speech-stage-label">{stage}</span>
                </li>
              ))}
            </ol>
          )}

          {/* Timer Ring */}
          <div
            className="timer-ring"
            style={{ '--p': progress } as React.CSSProperties}
            role="timer"
            aria-live="polite"
          >
            <span className="timer-digits">{formatDigits(remainingSeconds)}</span>
          </div>

          {/* Status Callout */}
          <p className="timer-status" aria-live="polite">
            {statusText}
          </p>

          {/* Up next message when ready to speak */}
          {isReady && (
            <p className="timer-next">
              Up next: {formatMinutesText(speechDurationSeconds)} to speak.
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="timer-actions">
          {isResearch && (
            <button
              type="button"
              className="btn primary"
              onClick={onDoneResearching}
              ref={primaryButtonRef}
            >
              Done researching
            </button>
          )}

          {isReady && (
            <button
              type="button"
              className="btn primary"
              onClick={onStartSpeech}
              ref={primaryButtonRef}
            >
              I'm ready to speak
            </button>
          )}

          {/* Mirror Toggle Button Inside Timer */}
          <button
            type="button"
            className={`btn secondary timer-mirror-btn ${isMirrored ? 'is-active' : ''}`}
            onClick={onToggleMirror}
            title={isMirrored ? 'Turn mirror mode off' : 'Turn mirror mode on (flip horizontally)'}
            aria-pressed={isMirrored}
          >
            <FlipHorizontal size={14} className={isMirrored ? 'text-[var(--accent)]' : ''} />
            <span>{isMirrored ? 'Mirror On' : 'Mirror'}</span>
          </button>

          <button
            type="button"
            className="btn ghost"
            onClick={onClose}
            ref={isSpeech ? closeButtonRef : undefined}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
