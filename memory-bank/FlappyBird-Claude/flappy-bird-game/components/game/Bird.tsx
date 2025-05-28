import { Bird as BirdType, GAME_CONFIG } from '@/types/game';

interface BirdProps {
  bird: BirdType;
  ctx: CanvasRenderingContext2D;
  frame: number;
}

export function drawBird({ bird, ctx, frame }: BirdProps) {
  ctx.save();
  
  // Move to bird position
  ctx.translate(bird.position.x + bird.width / 2, bird.position.y + bird.height / 2);
  
  // Calculate rotation based on velocity (improved formula)
  const rotation = Math.min(Math.max(bird.velocity.y * 2.5, -25), 90) * (Math.PI / 180);
  ctx.rotate(rotation);
  
  // Draw bird body with rounded corners
  ctx.fillStyle = '#FFD700'; // Gold color
  ctx.beginPath();
  ctx.roundRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height, 4);
  ctx.fill();
  
  // Draw animated wing
  const wingFrame = Math.floor(frame / 8) % 3; // 3 frame wing animation
  ctx.fillStyle = '#FFA500'; // Orange
  
  switch(wingFrame) {
    case 0: // Wing up
      ctx.fillRect(-bird.width / 4, -bird.height / 3, bird.width / 3, 8);
      break;
    case 1: // Wing middle
      ctx.fillRect(-bird.width / 4, -2, bird.width / 3, 12);
      break;
    case 2: // Wing down
      ctx.fillRect(-bird.width / 4, bird.height / 6, bird.width / 3, 8);
      break;
  }
  
  // Draw eye with blink animation
  const shouldBlink = frame % 200 < 10; // Blink every ~3 seconds
  
  if (!shouldBlink) {
    // Open eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bird.width / 4, -bird.height / 4, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.width / 4 + 1, -bird.height / 4, 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Closed eye (blink)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bird.width / 4 - 4, -bird.height / 4);
    ctx.lineTo(bird.width / 4 + 4, -bird.height / 4);
    ctx.stroke();
  }
  
  // Draw beak
  ctx.fillStyle = '#FF6347';
  ctx.beginPath();
  ctx.moveTo(bird.width / 2, 0);
  ctx.lineTo(bird.width / 2 + 8, 2);
  ctx.lineTo(bird.width / 2, 4);
  ctx.closePath();
  ctx.fill();
  
  // Add subtle shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, bird.height / 2 + 2, bird.width / 2 - 2, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

export function updateBird(bird: BirdType, canvasHeight: number): BirdType {
  // Apply gravity
  let newVelocityY = bird.velocity.y + GAME_CONFIG.GRAVITY;
  
  // Cap maximum fall velocity
  const MAX_FALL_VELOCITY = 12;
  newVelocityY = Math.min(newVelocityY, MAX_FALL_VELOCITY);
  
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