export class MusicGenerator {
  private audioContext: AudioContext | null = null;
  private isPlaying: boolean = false;
  private enabled: boolean = true;
  private volume: number = 0.15;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private getContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  start() {
    if (!this.enabled || this.isPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isPlaying = true;
    this.gainNode = ctx.createGain();
    this.gainNode.gain.value = this.volume;
    this.gainNode.connect(ctx.destination);

    // Simple melody pattern
    const melody = [
      { note: 261.63, duration: 0.5 }, // C4
      { note: 293.66, duration: 0.5 }, // D4
      { note: 329.63, duration: 0.5 }, // E4
      { note: 261.63, duration: 0.5 }, // C4
    ];

    const playMelody = () => {
      if (!this.isPlaying || !this.gainNode) return;

      let time = ctx.currentTime;
      
      melody.forEach((note, index) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        osc.connect(noteGain);
        noteGain.connect(this.gainNode!);
        
        osc.type = 'sine';
        osc.frequency.value = note.note;
        
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.1, time + 0.05);
        noteGain.gain.linearRampToValueAtTime(0, time + note.duration - 0.05);
        
        osc.start(time);
        osc.stop(time + note.duration);
        
        time += note.duration;
      });

      // Schedule next loop
      if (this.isPlaying) {
        setTimeout(playMelody, 2000);
      }
    };

    // Start the melody
    playMelody();

    // Add a subtle bass line
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    
    bass.connect(bassGain);
    bassGain.connect(this.gainNode);
    
    bass.type = 'sine';
    bass.frequency.value = 65.41; // C2
    bassGain.gain.value = 0.05;
    
    bass.start();
    this.oscillators.push(bass);
  }

  stop() {
    this.isPlaying = false;
    
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    
    this.oscillators = [];
    
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stop();
    }
    return this.enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  isEnabled() {
    return this.enabled;
  }
} 