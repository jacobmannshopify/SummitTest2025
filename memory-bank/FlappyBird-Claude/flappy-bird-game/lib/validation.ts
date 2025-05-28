export class GameValidator {
  static validateScore(score: number): number {
    if (typeof score !== 'number' || isNaN(score)) {
      console.warn('Invalid score detected, resetting to 0');
      return 0;
    }
    return Math.max(0, Math.floor(score));
  }

  static validateHighScore(score: number, currentHigh: number): number {
    const validScore = this.validateScore(score);
    const validHigh = this.validateScore(currentHigh);
    return Math.max(validScore, validHigh);
  }

  static validatePosition(x: number, y: number, bounds: { width: number; height: number }): { x: number; y: number } {
    return {
      x: Math.max(0, Math.min(x, bounds.width)),
      y: Math.max(0, Math.min(y, bounds.height)),
    };
  }

  static validateVelocity(velocity: number, max: number = 20): number {
    if (typeof velocity !== 'number' || isNaN(velocity)) {
      return 0;
    }
    return Math.max(-max, Math.min(max, velocity));
  }

  static validateGameState(state: any): boolean {
    const requiredFields = ['bird', 'pipes', 'score', 'gamePhase'];
    
    for (const field of requiredFields) {
      if (!(field in state)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    if (!state.bird || typeof state.bird.position !== 'object') {
      console.error('Invalid bird data');
      return false;
    }
    
    if (!Array.isArray(state.pipes)) {
      console.error('Pipes must be an array');
      return false;
    }
    
    return true;
  }

  static sanitizeLocalStorage(key: string, defaultValue: any): any {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      
      const parsed = JSON.parse(stored);
      return parsed;
    } catch (error) {
      console.warn(`Failed to parse localStorage key "${key}", using default value`);
      localStorage.removeItem(key);
      return defaultValue;
    }
  }

  static validateCanvasContext(canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | null {
    if (!canvas) {
      console.error('Canvas element not found');
      return null;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context from canvas');
      return null;
    }
    
    return ctx;
  }

  static validateAudioContext(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.warn('Web Audio API not supported');
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Failed to check audio context:', error);
      return false;
    }
  }
} 