import React from 'react';
import { FlipHorizontal } from 'lucide-react';

interface MirrorToggleProps {
  isMirrored: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const MirrorToggle: React.FC<MirrorToggleProps> = ({
  isMirrored,
  onToggle,
  disabled = false,
}) => {
  return (
    <aside
      className="mirror-vertical-rail"
      aria-label="Camera mirror controls"
    >
      <button
        type="button"
        className={`mirror-vertical-control ${isMirrored ? 'is-on' : ''}`}
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={isMirrored}
        aria-label={`Mirror camera preview (${isMirrored ? 'Active' : 'Inactive'})`}
        title="Mirror camera preview"
      >
        <span
          className="mirror-indicator-dot"
          aria-hidden="true"
        />
        <FlipHorizontal
          size={14}
          strokeWidth={2.2}
          aria-hidden="true"
        />
        <span className="mirror-label">Mirror</span>
      </button>
      <div className="mirror-tooltip" role="tooltip">
        Mirror {isMirrored ? 'ON' : 'OFF'}
      </div>
    </aside>
  );
};
