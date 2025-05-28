import { PowerUp as PowerUpType, POWERUP_CONFIGS } from '@/types/powerup';

interface PowerUpProps {
  powerUp: PowerUpType;
  ctx: CanvasRenderingContext2D;
  frame: number;
}

export function drawPowerUp({ powerUp, ctx, frame }: PowerUpProps) {
  if (powerUp.collected) return;
  
  const config = POWERUP_CONFIGS[powerUp.type];
  
  // Floating animation
  const floatY = Math.sin(frame * 0.05) * 5;
  
  // Glow effect
  const glowSize = 20 + Math.sin(frame * 0.1) * 5;
  const gradient = ctx.createRadialGradient(
    powerUp.position.x + powerUp.width / 2,
    powerUp.position.y + powerUp.height / 2 + floatY,
    0,
    powerUp.position.x + powerUp.width / 2,
    powerUp.position.y + powerUp.height / 2 + floatY,
    glowSize
  );
  gradient.addColorStop(0, config.color + '88');
  gradient.addColorStop(1, config.color + '00');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(
    powerUp.position.x - glowSize + powerUp.width / 2,
    powerUp.position.y - glowSize + powerUp.height / 2 + floatY,
    glowSize * 2,
    glowSize * 2
  );
  
  // Power-up circle
  ctx.fillStyle = config.color;
  ctx.beginPath();
  ctx.arc(
    powerUp.position.x + powerUp.width / 2,
    powerUp.position.y + powerUp.height / 2 + floatY,
    powerUp.width / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Inner circle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(
    powerUp.position.x + powerUp.width / 2,
    powerUp.position.y + powerUp.height / 2 + floatY,
    powerUp.width / 2 - 4,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Icon
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    config.icon,
    powerUp.position.x + powerUp.width / 2,
    powerUp.position.y + powerUp.height / 2 + floatY
  );
}

export function updatePowerUp(powerUp: PowerUpType, speed: number): PowerUpType {
  return {
    ...powerUp,
    position: {
      ...powerUp.position,
      x: powerUp.position.x - speed,
    },
  };
}

export function createPowerUp(x: number, y: number): PowerUpType | null {
  // 20% chance to spawn a power-up
  if (Math.random() > 0.2) return null;
  
  const types: PowerUpType['type'][] = ['shield', 'slowmo', 'tiny', 'magnet'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  return {
    type: randomType,
    position: { x, y },
    width: 40,
    height: 40,
    collected: false,
    active: false,
    duration: POWERUP_CONFIGS[randomType].duration,
  };
}

export function drawActivePowerUp(
  ctx: CanvasRenderingContext2D,
  powerUp: PowerUpType,
  x: number,
  y: number,
  timeRemaining: number
) {
  const config = POWERUP_CONFIGS[powerUp.type];
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x, y, 200, 40);
  
  // Icon
  ctx.font = '24px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.icon, x + 10, y + 20);
  
  // Progress bar
  const progress = timeRemaining / powerUp.duration;
  ctx.fillStyle = config.color + '44';
  ctx.fillRect(x + 45, y + 10, 140, 20);
  ctx.fillStyle = config.color;
  ctx.fillRect(x + 45, y + 10, 140 * progress, 20);
  
  // Border
  ctx.strokeStyle = config.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 45, y + 10, 140, 20);
} 