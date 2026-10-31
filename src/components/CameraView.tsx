import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Video } from 'lucide-react';

interface CameraViewProps {
  stream: MediaStream | null;
  isMirrored: boolean;
  isRecording: boolean;
  recordingSeconds: number;
  cameraError: string | null;
  onRetry: () => void;
  onToggleCamera: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  stream,
  isMirrored,
  isRecording,
  recordingSeconds,
  cameraError,
  onRetry,
  onToggleCamera,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideoTrack, setHasVideoTrack] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      const tracks = stream.getVideoTracks();
      setHasVideoTrack(tracks.length > 0 && tracks[0].enabled);
    } else {
      setHasVideoTrack(false);
    }
  }, [stream]);

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="camera-stage-card relative" role="region" aria-label="Camera practice preview">
      {stream && hasVideoTrack ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`camera-video ${isMirrored ? 'is-mirrored' : ''}`}
          />

          {isRecording && (
            <div className="camera-overlay-badge" aria-label="Recording in progress">
              <span className="rec-pulse-dot" />
              <span>REC {formatRecTime(recordingSeconds)}</span>
            </div>
          )}

          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs text-white/90">
            <span className="text-[0.7rem] uppercase tracking-wider font-semibold opacity-80">
              {isMirrored ? 'Mirrored' : 'Natural'}
            </span>
            <button
              type="button"
              onClick={onToggleCamera}
              className="hover:text-red-300 ml-1 transition-colors"
              title="Turn off camera"
            >
              <CameraOff size={13} />
            </button>
          </div>
        </>
      ) : cameraError ? (
        <div className="camera-placeholder">
          <CameraOff size={28} className="text-[var(--accent)] opacity-80" />
          <p className="font-medium text-[var(--ink)]">Camera Unavailable</p>
          <p className="text-xs text-[var(--muted)] max-w-[26ch]">{cameraError}</p>
          <button
            type="button"
            className="btn secondary text-xs py-1.5 px-3 mt-1"
            onClick={onRetry}
          >
            Retry Permission
          </button>
        </div>
      ) : (
        <div className="camera-placeholder">
          <Camera size={30} className="text-[var(--muted)] opacity-70" />
          <p className="font-medium text-[var(--ink)]">Camera Preview Ready</p>
          <p className="text-xs text-[var(--muted)] max-w-[28ch]">
            Practice with your live video feed to improve body language and eye contact.
          </p>
          <button
            type="button"
            className="btn primary text-xs py-1.5 px-3.5 mt-1"
            onClick={onToggleCamera}
          >
            <Video size={13} />
            Enable Camera
          </button>
        </div>
      )}
    </div>
  );
};
