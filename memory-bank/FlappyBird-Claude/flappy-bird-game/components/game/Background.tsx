import { GAME_CONFIG } from '@/types/game';

interface BackgroundProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  groundOffset: number;
  frame: number;
  gamePhase?: 'MENU' | 'PLAYING' | 'GAME_OVER';
}

export function drawBackground({ ctx, width, height, groundOffset, frame, gamePhase = 'PLAYING' }: BackgroundProps) {
  // Static gradient based on game phase
  const gradient = ctx.createLinearGradient(0, 0, 0, height - GAME_CONFIG.GROUND_HEIGHT);
  
  if (gamePhase === 'MENU') {
    // Sunset/golden hour for menu
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#FDB813');
    gradient.addColorStop(1, '#FD7813');
  } else {
    // Classic blue sky for gameplay
    gradient.addColorStop(0, '#4EC0CA');
    gradient.addColorStop(1, '#70C5CE');
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height - GAME_CONFIG.GROUND_HEIGHT);
  
  // Animated parallax clouds
  drawClouds(ctx, width, height, frame, gamePhase);
}

function drawClouds(ctx: CanvasRenderingContext2D, width: number, height: number, frame: number, gamePhase: string) {
  // Adjust cloud opacity based on game phase
  const baseOpacity = gamePhase === 'MENU' ? 0.6 : 0.8;
  
  // Layer 1: Far clouds (slow)
  const cloud1Offset = (frame * 0.1) % (width + 200);
  drawCloud(ctx, width - cloud1Offset, 80, baseOpacity * 0.75, 40);
  drawCloud(ctx, width - cloud1Offset + 400, 120, baseOpacity * 0.625, 35);
  
  // Layer 2: Near clouds (faster)
  const cloud2Offset = (frame * 0.2) % (width + 200);
  drawCloud(ctx, width - cloud2Offset + 200, 150, baseOpacity, 50);
  drawCloud(ctx, width - cloud2Offset + 600, 100, baseOpacity * 0.875, 45);
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, opacity: number, size: number) {
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  
  // Create fluffy cloud with multiple circles
  const positions = [
    { x: 0, y: 0, r: size * 0.8 },
    { x: size * 0.6, y: -size * 0.1, r: size },
    { x: size * 1.2, y: 0, r: size * 0.9 },
    { x: size * 0.3, y: size * 0.3, r: size * 0.7 },
    { x: size * 0.9, y: size * 0.3, r: size * 0.6 },
  ];
  
  ctx.beginPath();
  positions.forEach(pos => {
    ctx.arc(x + pos.x, y + pos.y, pos.r, 0, Math.PI * 2);
  });
  ctx.fill();
}

export function drawGround({ ctx, width, height, groundOffset, frame, gamePhase = 'PLAYING' }: BackgroundProps) {
  const groundY = height - GAME_CONFIG.GROUND_HEIGHT;
  
  // Ground base with gradient - slightly different tone for menu vs gameplay
  const groundGradient = ctx.createLinearGradient(0, groundY, 0, height);
  if (gamePhase === 'MENU') {
    // Warmer tones for sunset menu
    groundGradient.addColorStop(0, '#D4C485');
    groundGradient.addColorStop(1, '#B4A571');
  } else {
    // Classic tones for blue sky gameplay
    groundGradient.addColorStop(0, '#DED895');
    groundGradient.addColorStop(1, '#C4B581');
  }
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, groundY, width, GAME_CONFIG.GROUND_HEIGHT);
  
  // Ground top stripe
  ctx.fillStyle = '#E5D99F';
  ctx.fillRect(0, groundY, width, 20);
  
  // Animated grass pattern
  ctx.fillStyle = '#73C843';
  const grassHeight = 10;
  const grassWidth = 20;
  
  // Draw two sets of grass to create seamless scrolling
  for (let i = 0; i < 2; i++) {
    for (let x = i * width - groundOffset; x < (i + 1) * width - groundOffset; x += grassWidth) {
      if (x + grassWidth > 0 && x < width) {
        // Animated grass sway
        const sway = Math.sin((x + frame) * 0.05) * 2;
        
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x + grassWidth / 2 + sway, groundY - grassHeight);
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