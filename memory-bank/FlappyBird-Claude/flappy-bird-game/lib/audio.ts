export class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    // Initialize sounds
    this.loadSound('flap', '/sounds/flap.mp3');
    this.loadSound('score', '/sounds/score.mp3');
    this.loadSound('hit', '/sounds/hit.mp3');
    this.loadSound('die', '/sounds/die.mp3');
    this.loadSound('swoosh', '/sounds/swoosh.mp3');
    
    // Background music
    this.loadSound('bgm', '/sounds/background.mp3', true);
  }

  private loadSound(name: string, path: string, loop: boolean = false) {
    if (typeof window === 'undefined') return;
    
    const audio = new Audio(path);
    audio.volume = this.volume;
    audio.loop = loop;
    
    // Preload the audio
    audio.load();
    
    this.sounds.set(name, audio);
  }

  play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      // Clone the audio to allow overlapping sounds
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = this.volume;
      clone.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    }
  }

  playMusic() {
    if (!this.enabled) return;
    
    const bgm = this.sounds.get('bgm');
    if (bgm) {
      bgm.volume = this.volume * 0.3; // Background music quieter
      bgm.play().catch(err => {
        console.log('Music play failed:', err);
      });
    }
  }

  stopMusic() {
    const bgm = this.sounds.get('bgm');
    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopMusic();
    }
    return this.enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = sound.loop ? this.volume * 0.3 : this.volume;
    });
  }

  isEnabled() {
    return this.enabled;
  }
} 