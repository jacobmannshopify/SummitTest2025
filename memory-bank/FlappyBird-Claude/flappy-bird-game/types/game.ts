export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Bird {
  position: Position;
  velocity: Velocity;
  width: number;
  height: number;
  rotation: number;
}

export interface Pipe {
  position: Position;
  width: number;
  gapY: number;
  gapHeight: number;
  passed: boolean;
}

export interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  highScore: number;
  gameOver: boolean;
  started: boolean;
  gamePhase: 'MENU' | 'PLAYING' | 'GAME_OVER';
}

export const GAME_CONFIG = {
  GRAVITY: 0.3,
  JUMP_STRENGTH: -4.5,
  PIPE_WIDTH: 80,
  PIPE_GAP: 180,
  PIPE_SPEED: 2.5,
  BIRD_SIZE: 40,
  GROUND_HEIGHT: 120,
  PIPE_SPAWN_INTERVAL: 2000, // milliseconds
}; 