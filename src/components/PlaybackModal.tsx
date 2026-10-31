import React, { useRef, useState } from 'react';
import { Download, X, Play, Pause, RotateCcw, FlipHorizontal } from 'lucide-react';

interface PlaybackModalProps {
  videoUrl: string;
  topic: string;
  isInitiallyMirrored?: boolean;
  onClose: () => void;
}

export const PlaybackModal: React.FC<PlaybackModalProps> = ({
  videoUrl,
  topic,
  isInitiallyMirrored = false,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMirrored, setIsMirrored] = useState(isInitiallyMirrored);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    const sanitizedTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `bolchal-practice-${sanitizedTopic}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="playback-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="playback-title"
    >
      <div className="playback-panel">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs uppercase tracking-wider text-[var(--accent)] font-semibold">
              Speaking Review
            </span>
            <h3 id="playback-title" className="text-xl font-medium text-[var(--ink)] font-serif mt-0.5">
              {topic}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded-full transition-colors"
            aria-label="Close review"
          >
            <X size={20} />
          </button>
        </div>

        <div className="playback-video-container relative">
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            className={`w-full h-full object-cover transition-transform ${isMirrored ? 'is-mirrored' : ''}`}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
          />
        </div>

        {/* Video controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn secondary py-1.5 px-3 text-xs"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              className="btn secondary py-1.5 px-3 text-xs"
              onClick={restartVideo}
              title="Restart playback"
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              className={`btn secondary py-1.5 px-3 text-xs ${isMirrored ? 'is-active text-[var(--accent)]' : ''}`}
              onClick={() => setIsMirrored((m) => !m)}
              title="Toggle mirrored orientation"
            >
              <FlipHorizontal size={14} />
              <span>Mirror: {isMirrored ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn primary py-1.5 px-3.5 text-xs"
              onClick={handleDownload}
            >
              <Download size={14} />
              <span>Download Recording</span>
            </button>
            <button
              type="button"
              className="btn ghost py-1 px-2.5 text-xs"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
