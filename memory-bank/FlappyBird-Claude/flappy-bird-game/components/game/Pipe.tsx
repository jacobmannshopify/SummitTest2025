import { Pipe as PipeType, GAME_CONFIG } from '@/types/game';

interface PipeProps {
  pipe: PipeType;
  ctx: CanvasRenderingContext2D;
  canvasHeight: number;
}

export function drawPipe({ pipe, ctx, canvasHeight }: PipeProps) {
  const pipeColor = '#73BF2E';
  const pipeColorDark = '#5A9623';
  const pipeColorLight = '#8FD146';
  const capHeight = 40;
  const capOverhang = 10;
  
  // Top pipe
  const topPipeHeight = pipe.gapY;
  
  // Draw top pipe body with gradient
  const topGradient = ctx.createLinearGradient(pipe.position.x, 0, pipe.position.x + pipe.width, 0);
  topGradient.addColorStop(0, pipeColorLight);
  topGradient.addColorStop(0.1, pipeColor);
  topGradient.addColorStop(0.9, pipeColorDark);
  topGradient.addColorStop(1, '#4A7A1C');
  
  ctx.fillStyle = topGradient;
  ctx.fillRect(pipe.position.x, 0, pipe.width, topPipeHeight - capHeight);
  
  // Top pipe highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(pipe.position.x + 5, 0, 10, topPipeHeight - capHeight);
  
  // Top pipe cap with 3D effect
  const topCapGradient = ctx.createLinearGradient(
    pipe.position.x - capOverhang, 
    topPipeHeight - capHeight, 
    pipe.position.x - capOverhang + pipe.width + capOverhang * 2, 
    topPipeHeight - capHeight
  );
  topCapGradient.addColorStop(0, pipeColorLight);
  topCapGradient.addColorStop(0.1, pipeColor);
  topCapGradient.addColorStop(0.9, pipeColorDark);
  topCapGradient.addColorStop(1, '#4A7A1C');
  
  ctx.fillStyle = topCapGradient;
  ctx.fillRect(
    pipe.position.x - capOverhang,
    topPipeHeight - capHeight,
    pipe.width + capOverhang * 2,
    capHeight
  );
  
  // Top cap highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(pipe.position.x - capOverhang + 5, topPipeHeight - capHeight + 5, 15, capHeight - 10);
  
  // Top cap shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(
    pipe.position.x - capOverhang,
    topPipeHeight - 5,
    pipe.width + capOverhang * 2,
    5
  );
  
  // Bottom pipe
  const bottomPipeY = pipe.gapY + pipe.gapHeight;
  const bottomPipeHeight = canvasHeight - bottomPipeY - GAME_CONFIG.GROUND_HEIGHT;
  
  // Draw bottom pipe cap first
  const bottomCapGradient = ctx.createLinearGradient(
    pipe.position.x - capOverhang,
    bottomPipeY,
    pipe.position.x - capOverhang + pipe.width + capOverhang * 2,
    bottomPipeY
  );
  bottomCapGradient.addColorStop(0, pipeColorLight);
  bottomCapGradient.addColorStop(0.1, pipeColor);
  bottomCapGradient.addColorStop(0.9, pipeColorDark);
  bottomCapGradient.addColorStop(1, '#4A7A1C');
  
  ctx.fillStyle = bottomCapGradient;
  ctx.fillRect(
    pipe.position.x - capOverhang,
    bottomPipeY,
    pipe.width + capOverhang * 2,
    capHeight
  );
  
  // Bottom cap highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(pipe.position.x - capOverhang + 5, bottomPipeY + 5, 15, capHeight - 10);
  
  // Bottom cap top shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(
    pipe.position.x - capOverhang,
    bottomPipeY,
    pipe.width + capOverhang * 2,
    5
  );
  
  // Draw bottom pipe body
  const bottomGradient = ctx.createLinearGradient(pipe.position.x, 0, pipe.position.x + pipe.width, 0);
  bottomGradient.addColorStop(0, pipeColorLight);
  bottomGradient.addColorStop(0.1, pipeColor);
  bottomGradient.addColorStop(0.9, pipeColorDark);
  bottomGradient.addColorStop(1, '#4A7A1C');
  
  ctx.fillStyle = bottomGradient;
  ctx.fillRect(pipe.position.x, bottomPipeY + capHeight, pipe.width, bottomPipeHeight);
  
  // Bottom pipe highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(pipe.position.x + 5, bottomPipeY + capHeight, 10, bottomPipeHeight);
  
  // Add subtle inner shadows for depth
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(pipe.position.x + pipe.width - 5, 0, 5, topPipeHeight - capHeight);
  ctx.fillRect(pipe.position.x + pipe.width - 5, bottomPipeY + capHeight, 5, bottomPipeHeight);
}

export function updatePipe(pipe: PipeType): PipeType {
  return {
    ...pipe,
    position: {
      ...pipe.position,
      x: pipe.position.x - GAME_CONFIG.PIPE_SPEED,
    },
  };
}

export function createPipe(x: number, canvasHeight: number): PipeType {
  const minGapY = 100;
  const maxGapY = canvasHeight - GAME_CONFIG.GROUND_HEIGHT - GAME_CONFIG.PIPE_GAP - 100;
  const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
  
  return {
    position: { x, y: 0 },
    width: GAME_CONFIG.PIPE_WIDTH,
    gapY,
    gapHeight: GAME_CONFIG.PIPE_GAP,
    passed: false,
  };
} 