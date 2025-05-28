import { GAME_CONFIG } from '@/types/game';

interface BackgroundProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  groundOffset: number;
}

export function drawBackground({ ctx, width, height, groundOffset }: BackgroundProps) {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height - GAME_CONFIG.GROUND_HEIGHT);
  gradient.addColorStop(0, '#4EC0CA');
  gradient.addColorStop(1, '#70C5CE');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height - GAME_CONFIG.GROUND_HEIGHT);
  
  // Clouds (simple circles for now)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  
  // Cloud 1
  ctx.beginPath();
  ctx.arc(50, 100, 25, 0, Math.PI * 2);
  ctx.arc(80, 100, 35, 0, Math.PI * 2);
  ctx.arc(110, 100, 25, 0, Math.PI * 2);
  ctx.fill();
  
  // Cloud 2
  ctx.beginPath();
  ctx.arc(200, 150, 20, 0, Math.PI * 2);
  ctx.arc(225, 150, 30, 0, Math.PI * 2);
  ctx.arc(250, 150, 20, 0, Math.PI * 2);
  ctx.fill();
}

export function drawGround({ ctx, width, height, groundOffset }: BackgroundProps) {
  const groundY = height - GAME_CONFIG.GROUND_HEIGHT;
  
  // Ground base
  ctx.fillStyle = '#DED895';
  ctx.fillRect(0, groundY, width, GAME_CONFIG.GROUND_HEIGHT);
  
  // Ground top stripe
  ctx.fillStyle = '#E5D99F';
  ctx.fillRect(0, groundY, width, 20);
  
  // Grass pattern
  ctx.fillStyle = '#73C843';
  const grassHeight = 10;
  const grassWidth = 20;
  
  // Draw two sets of grass to create seamless scrolling
  for (let i = 0; i < 2; i++) {
    for (let x = i * width - groundOffset; x < (i + 1) * width - groundOffset; x += grassWidth) {
      if (x + grassWidth > 0 && x < width) {
        // Simple triangle grass
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x + grassWidth / 2, groundY - grassHeight);
        ctx.lineTo(x + grassWidth, groundY);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
  
  // Ground texture lines
  ctx.strokeStyle = '#C4B581';
  ctx.lineWidth = 1;
  for (let y = groundY + 30; y < height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
} 