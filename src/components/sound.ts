// Client-side Web Audio API Sound Synthesizer for Retro Terminal Sounds

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

export function getMuteState(): boolean {
  return isMuted;
}

// Synthesize a mechanical keyboard keypress sound
export function playClick(keyType: 'space' | 'enter' | 'backspace' | 'default' = 'default') {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    let baseFreq = 1000 + Math.random() * 300;
    let clickGain = 0.08;
    let duration = 0.03;
    let noiseGainAmount = 0.03;

    if (keyType === 'space') {
      baseFreq = 300 + Math.random() * 100;
      clickGain = 0.12;
      duration = 0.06;
      noiseGainAmount = 0.05;
    } else if (keyType === 'enter') {
      baseFreq = 500 + Math.random() * 100;
      clickGain = 0.14;
      duration = 0.08;
      noiseGainAmount = 0.06;
    } else if (keyType === 'backspace') {
      baseFreq = 800 + Math.random() * 150;
      clickGain = 0.07;
      duration = 0.04;
      noiseGainAmount = 0.02;
    }

    // 1. Click transient (metallic sound)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.15, now + duration);
    
    oscGain.gain.setValueAtTime(clickGain, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + duration + 0.01);

    // 2. White noise burst (mechanical friction/clack)
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(keyType === 'space' ? 400 : 1200, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(noiseGainAmount, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  } catch (e) {
    console.warn('Web Audio API click failed', e);
  }
}

// Synthesize a retro terminal error beep
export function playBeep() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now); // classic A4 tone
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {
    console.warn('Web Audio API beep failed', e);
  }
}

// Synthesize an 8-bit retro startup chime (arpeggio)
export function playStartup() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (arpeggio)
    const duration = 0.08;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; // retro 8-bit square wave
      osc.frequency.setValueAtTime(freq, now + idx * duration);

      gain.gain.setValueAtTime(0.05, now + idx * duration);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * duration + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * duration);
      osc.stop(now + idx * duration + 0.16);
    });
  } catch (e) {
    console.warn('Web Audio API startup chime failed', e);
  }
}

// Synthesize a sci-fi UI transition swoosh (for minimize/maximize/close)
export function playSwoosh() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  } catch (e) {
    console.warn('Web Audio API swoosh failed', e);
  }
}

// Synthesize a modern glassmorphic notification sound
export function playNotify() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880.00, now + 0.08); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now); // D6
    osc2.frequency.setValueAtTime(1760.00, now + 0.08); // A6

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  } catch (e) {
    console.warn('Web Audio API notify chime failed', e);
  }
}

