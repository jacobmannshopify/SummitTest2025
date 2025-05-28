import { Bird, Pipe, GAME_CONFIG } from '@/types/game';

const COLLISION_BUFFER = 4; // pixels of forgiveness

export function checkCollision(bird: Bird, pipe: Pipe): boolean {
  // Get bird bounds with buffer
  const birdLeft = bird.position.x + COLLISION_BUFFER;
  const birdRight = bird.position.x + bird.width - COLLISION_BUFFER;
  const birdTop = bird.position.y + COLLISION_BUFFER;
  const birdBottom = bird.position.y + bird.height - COLLISION_BUFFER;

  // Get pipe bounds
  const pipeLeft = pipe.position.x;
  const pipeRight = pipe.position.x + pipe.width;
  const pipeTopBottom = pipe.gapY;
  const pipeBottomTop = pipe.gapY + pipe.gapHeight;

  // Check if bird is horizontally aligned with pipe
  if (birdRight > pipeLeft && birdLeft < pipeRight) {
    // Check if bird hits top pipe or bottom pipe
    if (birdTop < pipeTopBottom || birdBottom > pipeBottomTop) {
      return true;
    }
  }

  return false;
}

export function checkGroundCollision(bird: Bird, canvasHeight: number): boolean {
  return bird.position.y + bird.height >= canvasHeight - GAME_CONFIG.GROUND_HEIGHT;
}

export function checkCeilingCollision(bird: Bird): boolean {
  return bird.position.y <= 0;
} 