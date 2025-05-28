import { Bird as BirdType, GAME_CONFIG } from '@/types/game';

interface BirdProps {
  bird: BirdType;
  ctx: CanvasRenderingContext2D;
}

export function drawBird({ bird, ctx }: BirdProps) {
  ctx.save();
  
  // Move to bird position
  ctx.translate(bird.position.x + bird.width / 2, bird.position.y + bird.height / 2);
  
  // Calculate rotation based on velocity
  const rotation = Math.min(Math.max(bird.velocity.y * 3, -30), 90) * (Math.PI / 180);
  ctx.rotate(rotation);
  
  // Draw bird (simple rectangle for now, will be replaced with sprite)
  ctx.fillStyle = '#FFD700'; // Gold color
  ctx.fillRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height);
  
  // Draw eye
  ctx.fillStyle = 'white';
  ctx.fillRect(bird.width / 4, -bird.height / 4, 8, 8);
  ctx.fillStyle = 'black';
  ctx.fillRect(bird.width / 4 + 2, -bird.height / 4 + 2, 4, 4);
  
  // Draw beak
  ctx.fillStyle = '#FF6347';
  ctx.fillRect(bird.width / 2 - 2, 0, 8, 4);
  
  ctx.restore();
}

export function updateBird(bird: BirdType, canvasHeight: number): BirdType {
  // Apply gravity
  const newVelocityY = bird.velocity.y + GAME_CONFIG.GRAVITY;
  
  // Update position
  const newY = bird.position.y + newVelocityY;
  
  // Keep bird within canvas bounds
  const clampedY = Math.max(0, Math.min(newY, canvasHeight - GAME_CONFIG.GROUND_HEIGHT - bird.height));
  
  return {
    ...bird,
    position: {
      ...bird.position,
      y: clampedY,
    },
    velocity: {
      ...bird.velocity,
      y: newVelocityY,
    },
  };
}

export function jumpBird(bird: BirdType): BirdType {
  return {
    ...bird,
    velocity: {
      ...bird.velocity,
      y: GAME_CONFIG.JUMP_STRENGTH,
    },
  };
} 