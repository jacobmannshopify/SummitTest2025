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
  gameOver: boolean;
  started: boolean;
}

export const GAME_CONFIG = {
  GRAVITY: 0.5,
  JUMP_STRENGTH: -8,
  PIPE_WIDTH: 52,
  PIPE_GAP: 120,
  PIPE_SPEED: 2,
  BIRD_SIZE: 34,
  GROUND_HEIGHT: 112,
  PIPE_SPAWN_INTERVAL: 1500, // milliseconds
}; 