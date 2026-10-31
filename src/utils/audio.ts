// Web Audio API Sound Synthesizer faithfully recreating Unprompted.cool sound effects

let audioCtx: AudioContext | null = null;
let isMuted = false;

export function setAudioMuted(muted: boolean) {
  isMuted = muted;
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function initAudio() {
  if (!isMuted) {
    getAudioContext();
  }
}

function playTone(
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType,
  peakGain: number,
  destination: AudioNode
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

/**
 * Mechanical tick sound played on each reel topic tick during spin
 */
export function playReelTick(volume = 1) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.018;
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < sampleCount; i++) {
    channelData[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2200 + Math.random() * 800, now);
  filter.Q.value = 1.2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.55 * volume, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(now);
  source.stop(now + duration + 0.01);
}

/**
 * Harmonic landing chime when reel settles on a topic
 */
export function playLandingChime() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.45;
  master.connect(ctx.destination);

  // C5 (523.25), E5 (659.25), G5 (783.99)
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, idx) => {
    playTone(freq, now + idx * 0.07, 0.45, 'sine', 0.28, master);
  });
}

/**
 * Celebratory fanfare / time's up chime
 */
export function playTimerDoneChime() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);

  // G4, C5, E5, G5 triangle notes followed by C6 sine peak
  const arpeggio = [392, 523.25, 659.25, 784];
  arpeggio.forEach((freq, idx) => {
    playTone(freq, now + idx * 0.12, 0.55, 'triangle', 0.32, master);
  });
  playTone(1046.5, now + 0.55, 0.9, 'sine', 0.22, master);
}
