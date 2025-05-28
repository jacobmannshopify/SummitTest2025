export type PowerUpType = 'shield' | 'slowmo' | 'tiny' | 'magnet';

export interface PowerUp {
  type: PowerUpType;
  position: { x: number; y: number };
  width: number;
  height: number;
  collected: boolean;
  active: boolean;
  duration: number;
  startTime?: number;
}

export interface PowerUpConfig {
  type: PowerUpType;
  color: string;
  icon: string;
  duration: number;
  description: string;
}

export const POWERUP_CONFIGS: Record<PowerUpType, PowerUpConfig> = {
  shield: {
    type: 'shield',
    color: '#00ffff',
    icon: '🛡️',
    duration: 5000,
    description: 'Invincibility for 5 seconds',
  },
  slowmo: {
    type: 'slowmo',
    color: '#ff00ff',
    icon: '⏱️',
    duration: 4000,
    description: 'Slow motion for 4 seconds',
  },
  tiny: {
    type: 'tiny',
    color: '#ffff00',
    icon: '🔬',
    duration: 6000,
    description: 'Smaller bird for 6 seconds',
  },
  magnet: {
    type: 'magnet',
    color: '#ff8800',
    icon: '🧲',
    duration: 8000,
    description: 'Auto-collect points for 8 seconds',
  },
}; 