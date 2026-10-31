import React, { useRef, useEffect } from 'react';
import { SPEECH_STAGES } from '../data/topics';
import { Video, VideoOff } from 'lucide-react';

interface TimerOverlayProps {
  topic: string;
  mode: 'off-the-cuff' | 'deep-research';
  timerState: 'idle' | 'research' | 'ready' | 'speech' | 'done';
  remainingSeconds: number;
  totalDurationSeconds: number;
  speechDurationSeconds: number;
  cameraStream: MediaStream | null;
  cameraEnabled: boolean;
  isMirrored: boolean;
  isRecording: boolean;
  onDoneResearching: () => void;
  onStartSpeech: () => void;
  onClose: () => void;
  onToggleCameraInTimer?: () => void;
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
  cameraStream,
  cameraEnabled,
  isMirrored,
  isRecording,
  onDoneResearching,
  onStartSpeech,
  onClose,
  onToggleCameraInTimer,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Dialog label and status text matching Unprompted
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

  // Connect camera stream if active
  useEffect(() => {
    if (videoRef.current && cameraStream && cameraEnabled) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, cameraEnabled]);

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

        {/* Optional PiP Camera live feedback during practice */}
        {cameraEnabled && cameraStream && (
          <div className="w-48 h-28 rounded-xl overflow-hidden border border-[var(--border)] shadow-xl relative bg-black/60 my-1">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-transform ${
                isMirrored ? 'is-mirrored' : ''
              }`}
            />
            {isRecording && (
              <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center gap-1 text-[0.65rem] text-white">
                <span className="rec-pulse-dot" />
                <span>REC</span>
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[0.6rem] text-white/80">
              {isMirrored ? 'Mirror ON' : 'Mirror OFF'}
            </div>
          </div>
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

          {onToggleCameraInTimer && (
            <button
              type="button"
              className="btn secondary text-xs py-2 px-3"
              onClick={onToggleCameraInTimer}
              title="Toggle camera during practice"
            >
              {cameraEnabled ? <VideoOff size={14} /> : <Video size={14} />}
              <span>{cameraEnabled ? 'Hide Camera' : 'Show Camera'}</span>
            </button>
          )}

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
