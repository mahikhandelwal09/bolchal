import { useState, useEffect, useRef, useCallback } from 'react';
import {
  DEEP_RESEARCH_NICHE,
  getNicheById,
  getRandomTopic,
} from './data/topics';
import {
  setAudioMuted,
  initAudio,
  playReelTick,
  playLandingChime,
  playTimerDoneChime,
} from './utils/audio';
import { applyTheme } from './themes';
import type { ThemeId } from './themes';
import { ModeSwitch } from './components/ModeSwitch';
import { NicheSelect } from './components/NicheSelect';
import { Reel } from './components/Reel';
import { SettingsModal } from './components/SettingsModal';
import { CameraView } from './components/CameraView';
import { TimerOverlay } from './components/TimerOverlay';
import { PlaybackModal } from './components/PlaybackModal';
import { ThemeSelector } from './components/ThemeSelector';
import { Sparkles, Camera, Video, Palette, FlipHorizontal } from 'lucide-react';

const SPIN_DURATION_MS = 4800;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function calculateSpinPlan(currentIndex: number, totalTopics: number) {
  const rotations = 3 + Math.floor(Math.random() * 3);
  const extraSteps = totalTopics > 1 ? 1 + Math.floor(Math.random() * (totalTopics - 1)) : 0;
  const totalSteps = rotations * totalTopics + extraSteps;
  const landIndex = (currentIndex + totalSteps) % totalTopics;
  return { totalSteps, landIndex };
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

export function App() {
  // Theme state (defaulting to Sage Studio, our intelligent recommended palette)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const saved = (localStorage.getItem('bolchal:theme') || localStorage.getItem('unprompted:theme')) as ThemeId;
      if (saved && ['original', 'warm-ivory', 'sage-studio', 'midnight', 'lavender-mist', 'low-glare'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'sage-studio';
  });

  const [showQuickTheme, setShowQuickTheme] = useState(false);

  // Apply theme on load and changes
  useEffect(() => {
    applyTheme(currentTheme);
    try {
      localStorage.setItem('bolchal:theme', currentTheme);
      localStorage.setItem('unprompted:theme', currentTheme);
    } catch {
      // ignore
    }
  }, [currentTheme]);

  // Mode and topic state
  const [practiceMode, setPracticeMode] = useState<'off-the-cuff' | 'deep-research'>('off-the-cuff');
  const [selectedNicheId, setSelectedNicheId] = useState<string>('general');

  // Timer configuration
  const [speechSeconds, setSpeechSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bolchal:speech') || localStorage.getItem('unprompted:speech');
      const num = Number(saved);
      return Number.isFinite(num) && num > 0 ? num : 60;
    } catch {
      return 60;
    }
  });

  const [researchSeconds, setResearchSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bolchal:research') || localStorage.getItem('unprompted:research');
      const num = Number(saved);
      return Number.isFinite(num) && num > 0 ? num : 600;
    } catch {
      return 600;
    }
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return (localStorage.getItem('bolchal:muted') || localStorage.getItem('unprompted:muted')) === 'true';
    } catch {
      return false;
    }
  });

  // Mirror control state (Feature One)
  const [isMirrored, setIsMirrored] = useState<boolean>(() => {
    try {
      return (localStorage.getItem('bolchal:mirrored') || localStorage.getItem('unprompted:mirrored')) === 'true';
    } catch {
      return false;
    }
  });

  // Day Counter state (Optional Habit / Streak Tracker)
  const [dayCounterEnabled, setDayCounterEnabled] = useState<boolean>(() => {
    try {
      return (localStorage.getItem('bolchal:dayCounterEnabled') || localStorage.getItem('unprompted:dayCounterEnabled')) === 'true';
    } catch {
      return false;
    }
  });

  const [currentDay, setCurrentDay] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bolchal:currentDay') || localStorage.getItem('unprompted:currentDay');
      const num = Number(saved);
      return Number.isInteger(num) && num >= 1 ? num : 4;
    } catch {
      return 4;
    }
  });

  const [totalDays, setTotalDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bolchal:totalDays') || localStorage.getItem('unprompted:totalDays');
      const num = Number(saved);
      return Number.isInteger(num) && num >= 1 ? num : 30;
    } catch {
      return 30;
    }
  });

  // Camera and recording state
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
  const [autoRecord, setAutoRecord] = useState<boolean>(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recTimerIntervalRef = useRef<number | null>(null);

  // Reel states
  const activeTopics = practiceMode === 'deep-research' ? DEEP_RESEARCH_NICHE.topics : getNicheById(selectedNicheId).topics;
  const currentTopicIndexRef = useRef<number>(0);
  const [displayedTopic, setDisplayedTopic] = useState<string>(() => getRandomTopic(activeTopics));
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasLanded, setHasLanded] = useState<boolean>(false);
  const [keyTick, setKeyTick] = useState<number>(0);

  // Active timers & practice lifecycle
  const [timerState, setTimerState] = useState<'idle' | 'research' | 'ready' | 'speech' | 'done'>('idle');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(speechSeconds);

  const spinAnimFrameRef = useRef<number | null>(null);
  const spinTimeoutRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Sync mute state
  useEffect(() => {
    setAudioMuted(isMuted);
    try {
      localStorage.setItem('bolchal:muted', String(isMuted));
      localStorage.setItem('unprompted:muted', String(isMuted));
    } catch {
      // ignore
    }
  }, [isMuted]);

  // Sync timers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bolchal:speech', String(speechSeconds));
      localStorage.setItem('unprompted:speech', String(speechSeconds));
    } catch {
      // ignore
    }
  }, [speechSeconds]);

  useEffect(() => {
    try {
      localStorage.setItem('bolchal:research', String(researchSeconds));
      localStorage.setItem('unprompted:research', String(researchSeconds));
    } catch {
      // ignore
    }
  }, [researchSeconds]);

  // Sync Day Counter to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bolchal:dayCounterEnabled', String(dayCounterEnabled));
      localStorage.setItem('unprompted:dayCounterEnabled', String(dayCounterEnabled));
    } catch {
      // ignore
    }
  }, [dayCounterEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('bolchal:currentDay', String(currentDay));
      localStorage.setItem('unprompted:currentDay', String(currentDay));
    } catch {
      // ignore
    }
  }, [currentDay]);

  useEffect(() => {
    try {
      localStorage.setItem('bolchal:totalDays', String(totalDays));
      localStorage.setItem('unprompted:totalDays', String(totalDays));
    } catch {
      // ignore
    }
  }, [totalDays]);

  // Sync mirror state
  const handleToggleMirror = useCallback(() => {
    setIsMirrored((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('bolchal:mirrored', String(next));
        localStorage.setItem('unprompted:mirrored', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Update remaining seconds if idle
  useEffect(() => {
    if (timerState === 'idle') {
      setRemainingSeconds(speechSeconds);
    }
  }, [timerState, speechSeconds]);

  // Camera stream management
  const requestCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: true,
      });
      setCameraStream(stream);
      setCameraEnabled(true);
    } catch (err: unknown) {
      console.warn('Camera/Microphone access error:', err);
      const message =
        err instanceof Error
          ? err.name === 'NotAllowedError'
            ? 'Camera permission denied. Allow camera in your browser settings.'
            : err.message
          : 'Unable to access camera or microphone.';
      setCameraError(message);
      setCameraEnabled(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraEnabled(false);
  }, [cameraStream]);

  const toggleCamera = () => {
    if (cameraEnabled) {
      stopCamera();
    } else {
      requestCamera();
    }
  };

  // Video recording controls
  const startRecording = useCallback(() => {
    if (!cameraStream) return;
    try {
      recordedChunksRef.current = [];
      const options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
        options.mimeType = 'video/webm;codecs=vp9,opus';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options.mimeType = 'video/webm';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        options.mimeType = 'video/mp4';
      }

      const recorder = new MediaRecorder(cameraStream, options);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (recordedChunksRef.current.length > 0) {
          const blob = new Blob(recordedChunksRef.current, {
            type: recordedChunksRef.current[0].type || 'video/webm',
          });
          const url = URL.createObjectURL(blob);
          setRecordedVideoUrl(url);
        }
        setIsRecording(false);
        setRecordingSeconds(0);
        if (recTimerIntervalRef.current) {
          window.clearInterval(recTimerIntervalRef.current);
          recTimerIntervalRef.current = null;
        }
      };

      recorder.start(500);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      recTimerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Failed to start recording:', err);
    }
  }, [cameraStream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recTimerIntervalRef.current) {
      window.clearInterval(recTimerIntervalRef.current);
      recTimerIntervalRef.current = null;
    }
  }, []);

  // Topic changes when niche or mode switches
  const handleNicheChange = (newNicheId: string) => {
    if (isSpinning || timerState !== 'idle') return;
    setSelectedNicheId(newNicheId);
    const topics = getNicheById(newNicheId).topics;
    const randomOne = getRandomTopic(topics);
    currentTopicIndexRef.current = Math.max(0, topics.indexOf(randomOne));
    setDisplayedTopic(randomOne);
    setHasLanded(false);
  };

  const handleModeChange = (newMode: 'off-the-cuff' | 'deep-research') => {
    if (isSpinning || timerState !== 'idle' || newMode === practiceMode) return;
    setPracticeMode(newMode);
    const topics = newMode === 'deep-research' ? DEEP_RESEARCH_NICHE.topics : getNicheById(selectedNicheId).topics;
    const randomOne = getRandomTopic(topics);
    currentTopicIndexRef.current = Math.max(0, topics.indexOf(randomOne));
    setDisplayedTopic(randomOne);
    setHasLanded(false);
  };

  // Spin topic generator logic
  const handleSpin = useCallback(() => {
    if (isSpinning || timerState !== 'idle') return;

    initAudio();
    setIsSpinning(true);
    setHasLanded(false);

    if (spinAnimFrameRef.current) {
      window.cancelAnimationFrame(spinAnimFrameRef.current);
      spinAnimFrameRef.current = null;
    }
    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }

    const topics = activeTopics;
    const count = topics.length;
    const startIndex = currentTopicIndexRef.current % count;
    const { totalSteps, landIndex } = calculateSpinPlan(startIndex, count);

    const startTime = performance.now();
    let lastStep = -1;
    let completed = false;

    const finishSpin = () => {
      if (completed) return;
      completed = true;

      if (spinAnimFrameRef.current) {
        window.cancelAnimationFrame(spinAnimFrameRef.current);
        spinAnimFrameRef.current = null;
      }
      if (spinTimeoutRef.current) {
        window.clearTimeout(spinTimeoutRef.current);
        spinTimeoutRef.current = null;
      }

      currentTopicIndexRef.current = landIndex;
      setDisplayedTopic(topics[landIndex]);
      setHasLanded(true);
      setIsSpinning(false);
      playLandingChime();
    };

    const stepFrame = (now: number) => {
      const elapsed = Math.min(1, (now - startTime) / SPIN_DURATION_MS);
      const eased = easeOutCubic(elapsed);
      const currentStep = Math.min(totalSteps, Math.floor(eased * totalSteps));

      if (currentStep !== lastStep) {
        const itemIdx = (startIndex + currentStep) % count;
        currentTopicIndexRef.current = itemIdx;
        setDisplayedTopic(topics[itemIdx]);
        setKeyTick((k) => k + 1);
        playReelTick(1 - elapsed * 0.6);
        lastStep = currentStep;
      }

      if (elapsed < 1) {
        spinAnimFrameRef.current = window.requestAnimationFrame(stepFrame);
      } else {
        finishSpin();
      }
    };

    spinAnimFrameRef.current = window.requestAnimationFrame(stepFrame);
    spinTimeoutRef.current = window.setTimeout(finishSpin, SPIN_DURATION_MS + 300);
  }, [isSpinning, timerState, activeTopics]);

  // Clean timer interval
  const clearPracticeTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Start countdown timer
  const runCountdown = useCallback(
    (durationSec: number, onComplete: () => void) => {
      clearPracticeTimer();
      setRemainingSeconds(durationSec);
      const targetTime = Date.now() + durationSec * 1000;

      timerIntervalRef.current = window.setInterval(() => {
        const diff = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
        setRemainingSeconds(diff);
        if (diff <= 0) {
          clearPracticeTimer();
          onComplete();
        }
      }, 100);
    },
    [clearPracticeTimer]
  );

  // Transition to speaking timer
  const startSpeechPhase = useCallback(() => {
    setTimerState('speech');
    if (cameraEnabled && autoRecord && cameraStream) {
      startRecording();
    }
    runCountdown(speechSeconds, () => {
      setTimerState('done');
      playTimerDoneChime();
      stopRecording();
    });
  }, [runCountdown, speechSeconds, cameraEnabled, autoRecord, cameraStream, startRecording, stopRecording]);

  // Start practice session button handler
  const handleStartPractice = useCallback(() => {
    if (!hasLanded || isSpinning || timerState !== 'idle') return;
    initAudio();

    if (practiceMode === 'deep-research') {
      setTimerState('research');
      runCountdown(researchSeconds, () => {
        setTimerState('ready');
        setRemainingSeconds(speechSeconds);
        playLandingChime();
      });
    } else {
      startSpeechPhase();
    }
  }, [hasLanded, isSpinning, timerState, practiceMode, researchSeconds, speechSeconds, runCountdown, startSpeechPhase]);

  // Advance from research to ready
  const handleDoneResearching = useCallback(() => {
    clearPracticeTimer();
    setTimerState('ready');
    setRemainingSeconds(speechSeconds);
    playLandingChime();
  }, [clearPracticeTimer, speechSeconds]);

  // Close timer overlay
  const handleCloseTimer = useCallback(() => {
    clearPracticeTimer();
    stopRecording();
    setTimerState('idle');
    setRemainingSeconds(speechSeconds);
  }, [clearPracticeTimer, stopRecording, speechSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinAnimFrameRef.current) window.cancelAnimationFrame(spinAnimFrameRef.current);
      if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current);
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
      if (recTimerIntervalRef.current) window.clearInterval(recTimerIntervalRef.current);
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const isTimerActive = timerState !== 'idle';
  const isControlsDisabled = isSpinning || isTimerActive;

  return (
    <div className="app-shell">
      <div className="page">
        {/* Atmosphere Background */}
        <div className="atmosphere" aria-hidden="true" />

        {/* Top Header & Navigation Bar */}
        <header className="top-bar">
          <div className="brand-badge">
            <span className="brand-badge-dot" />
            <span>Speech Practice</span>
          </div>

          {/* Unified Top Controls Toolbar: Theme, Camera, and Mirror */}
          <div className="top-controls-toolbar" role="toolbar" aria-label="Quick controls">
            <button
              type="button"
              className={`toolbar-btn ${showQuickTheme ? 'is-active' : ''}`}
              onClick={() => setShowQuickTheme((prev) => !prev)}
              title="Toggle theme palette selector"
              aria-expanded={showQuickTheme}
            >
              <Palette size={13} className="toolbar-btn-icon text-[var(--accent)]" />
              <span className="toolbar-btn-label">Theme</span>
            </button>

            <button
              type="button"
              className={`toolbar-btn ${cameraEnabled ? 'is-active' : ''}`}
              onClick={toggleCamera}
              title={cameraEnabled ? 'Turn camera off' : 'Turn camera on for speaking stage'}
              aria-pressed={cameraEnabled}
            >
              {cameraEnabled ? (
                <Video size={13} className="toolbar-btn-icon text-[var(--accent)]" />
              ) : (
                <Camera size={13} className="toolbar-btn-icon" />
              )}
              <span className="toolbar-btn-label">{cameraEnabled ? 'Camera On' : 'Camera'}</span>
            </button>

            <button
              type="button"
              className={`toolbar-btn ${isMirrored ? 'is-active' : ''}`}
              onClick={handleToggleMirror}
              title={isMirrored ? 'Turn mirror mode off' : 'Turn mirror mode on (flip horizontally)'}
              aria-pressed={isMirrored}
            >
              <FlipHorizontal size={13} className={`toolbar-btn-icon ${isMirrored ? 'text-[var(--accent)]' : ''}`} />
              <span className="toolbar-btn-label">{isMirrored ? 'Mirror On' : 'Mirror'}</span>
            </button>
          </div>
        </header>

        {/* Quick Theme Dropdown Banner */}
        {showQuickTheme && (
          <div className="w-full max-w-[720px] mb-6 animate-in fade-in duration-200">
            <ThemeSelector
              currentTheme={currentTheme}
              onSelectTheme={(id) => {
                setCurrentTheme(id);
                setShowQuickTheme(false);
              }}
              compact
            />
          </div>
        )}

        {/* Mirrored Stage Area */}
        <div className={`mirror-content-wrapper ${isMirrored ? 'is-mirrored-page' : ''}`}>
          {/* Brand Heading */}
          <div className="brand" inert={isTimerActive || undefined}>
            <h1 className="brand-mark">BolChal</h1>
          </div>

          {/* Main Practice Stage Container */}
          <div className="stage-container">
            <main className="stage">
              <div className="stage-body" inert={isTimerActive || undefined}>
                {/* Mode & Niche Controls */}
                <div className="controls">
                  <ModeSwitch
                    value={practiceMode}
                    onChange={handleModeChange}
                    disabled={isControlsDisabled}
                  />

                  <p className="mode-blurb">
                    {practiceMode === 'off-the-cuff'
                      ? 'Minimal prep. Try to think quick on your feet.'
                      : "Spin a topic, set a research timer, then start the speech timer whenever you're ready."}
                  </p>

                  {practiceMode === 'off-the-cuff' && (
                    <NicheSelect
                      value={selectedNicheId}
                      onChange={handleNicheChange}
                      disabled={isControlsDisabled}
                    />
                  )}
                </div>

                {/* Topic Slot Reel */}
                <Reel
                  currentTopic={displayedTopic}
                  isSpinning={isSpinning}
                  hasLanded={hasLanded}
                  keyTick={keyTick}
                />

                <p className="sr-only" aria-live="polite">
                  {hasLanded ? `Your topic: ${displayedTopic}` : ''}
                </p>

                {/* Live Camera Practice Card (if enabled) */}
                {cameraEnabled && (
                  <CameraView
                    stream={cameraStream}
                    isMirrored={isMirrored}
                    isRecording={isRecording}
                    recordingSeconds={recordingSeconds}
                    cameraError={cameraError}
                    onRetry={requestCamera}
                    onToggleCamera={toggleCamera}
                  />
                )}
              </div>

              {/* Day Counter: Inline between Topic Reel and Actions */}
              {dayCounterEnabled && currentDay >= 1 && totalDays >= 1 && currentDay <= totalDays && (
                <div
                  className="day-counter-inline"
                  aria-label="Practice streak day counter"
                  inert={isTimerActive || undefined}
                >
                  <span className="day-counter-text">
                    DAY {String(currentDay).padStart(2, '0')} / {String(totalDays).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="actions">
                <div className="actions-main" inert={isTimerActive || undefined}>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={handleSpin}
                    disabled={isControlsDisabled}
                  >
                    <Sparkles size={16} />
                    {isSpinning ? 'Spinning…' : hasLanded ? 'Spin again' : 'Spin'}
                  </button>

                  <button
                    type="button"
                    className="btn secondary"
                    onClick={handleStartPractice}
                    disabled={!hasLanded || isControlsDisabled}
                  >
                    {practiceMode === 'deep-research'
                      ? `Start ${formatMinutesText(researchSeconds)} research`
                      : `Start ${formatMinutesText(speechSeconds)} timer`}
                  </button>
                </div>

                {/* Settings Trigger & Dialog */}
                <SettingsModal
                  speechSeconds={speechSeconds}
                  researchSeconds={researchSeconds}
                  onChangeSpeech={setSpeechSeconds}
                  onChangeResearch={setResearchSeconds}
                  muted={isMuted}
                  onChangeMuted={setIsMuted}
                  currentTheme={currentTheme}
                  onChangeTheme={setCurrentTheme}
                  cameraEnabled={cameraEnabled}
                  onChangeCameraEnabled={(enabled) => {
                    if (enabled && !cameraStream) {
                      requestCamera();
                    } else if (!enabled && cameraStream) {
                      stopCamera();
                    }
                  }}
                  autoRecord={autoRecord}
                  onChangeAutoRecord={setAutoRecord}
                  dayCounterEnabled={dayCounterEnabled}
                  onChangeDayCounterEnabled={setDayCounterEnabled}
                  currentDay={currentDay}
                  onChangeCurrentDay={setCurrentDay}
                  totalDays={totalDays}
                  onChangeTotalDays={setTotalDays}
                  disabled={isControlsDisabled}
                />
              </div>
            </main>
          </div>
        </div>

        {/* Fullscreen Timer Practice Overlay */}
        {isTimerActive && (
          <TimerOverlay
            topic={displayedTopic}
            mode={practiceMode}
            timerState={timerState}
            remainingSeconds={remainingSeconds}
            totalDurationSeconds={timerState === 'research' ? researchSeconds : speechSeconds}
            speechDurationSeconds={speechSeconds}
            cameraStream={cameraStream}
            cameraEnabled={cameraEnabled}
            isMirrored={isMirrored}
            isRecording={isRecording}
            onDoneResearching={handleDoneResearching}
            onStartSpeech={startSpeechPhase}
            onClose={handleCloseTimer}
            onToggleCameraInTimer={() => {
              if (!cameraStream) {
                requestCamera();
              } else {
                setCameraEnabled((c) => !c);
              }
            }}
          />
        )}

        {/* Playback Review & Download Modal */}
        {recordedVideoUrl && (
          <PlaybackModal
            videoUrl={recordedVideoUrl}
            topic={displayedTopic}
            isInitiallyMirrored={isMirrored}
            onClose={() => setRecordedVideoUrl(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
