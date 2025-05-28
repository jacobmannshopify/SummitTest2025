import { Pipe as PipeType, GAME_CONFIG } from '@/types/game';

interface PipeProps {
  pipe: PipeType;
  ctx: CanvasRenderingContext2D;
  canvasHeight: number;
}

export function drawPipe({ pipe, ctx, canvasHeight }: PipeProps) {
  const pipeColor = '#73BF2E';
  const pipeHighlight = '#89D33C';
  const pipeShadow = '#547A22';
  
  // Draw top pipe
  const topPipeHeight = pipe.gapY;
  
  // Main pipe body (top)
  ctx.fillStyle = pipeColor;
  ctx.fillRect(pipe.position.x, 0, pipe.width, topPipeHeight);
  
  // Pipe cap (top)
  ctx.fillStyle = pipeColor;
  ctx.fillRect(pipe.position.x - 4, topPipeHeight - 30, pipe.width + 8, 30);
  
  // Highlights (top)
  ctx.fillStyle = pipeHighlight;
  ctx.fillRect(pipe.position.x + 5, 0, 5, topPipeHeight - 30);
  ctx.fillRect(pipe.position.x - 2, topPipeHeight - 28, pipe.width + 4, 5);
  
  // Shadows (top)
  ctx.fillStyle = pipeShadow;
  ctx.fillRect(pipe.position.x + pipe.width - 10, 0, 10, topPipeHeight - 30);
  ctx.fillRect(pipe.position.x - 2, topPipeHeight - 5, pipe.width + 4, 5);
  
  // Draw bottom pipe
  const bottomPipeY = pipe.gapY + pipe.gapHeight;
  const bottomPipeHeight = canvasHeight - bottomPipeY - GAME_CONFIG.GROUND_HEIGHT;
  
  // Main pipe body (bottom)
  ctx.fillStyle = pipeColor;
  ctx.fillRect(pipe.position.x, bottomPipeY, pipe.width, bottomPipeHeight);
  
  // Pipe cap (bottom)
  ctx.fillStyle = pipeColor;
  ctx.fillRect(pipe.position.x - 4, bottomPipeY, pipe.width + 8, 30);
  
  // Highlights (bottom)
  ctx.fillStyle = pipeHighlight;
  ctx.fillRect(pipe.position.x + 5, bottomPipeY + 30, 5, bottomPipeHeight - 30);
  ctx.fillRect(pipe.position.x - 2, bottomPipeY + 2, pipe.width + 4, 5);
  
  // Shadows (bottom)
  ctx.fillStyle = pipeShadow;
  ctx.fillRect(pipe.position.x + pipe.width - 10, bottomPipeY + 30, 10, bottomPipeHeight - 30);
  ctx.fillRect(pipe.position.x - 2, bottomPipeY + 25, pipe.width + 4, 5);
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