interface StartScreenProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  highScore: number;
}

export function drawStartScreen({ ctx, width, height, highScore }: StartScreenProps) {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, width, height);
  
  // Title
  ctx.fillStyle = 'white';
  ctx.font = '64px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Title shadow
  ctx.fillStyle = '#333';
  ctx.fillText('FLAPPY', width / 2 + 4, height / 2 - 104);
  ctx.fillText('BIRD', width / 2 + 4, height / 2 - 44);
  
  // Title text
  ctx.fillStyle = '#FFD700';
  ctx.fillText('FLAPPY', width / 2, height / 2 - 100);
  ctx.fillStyle = '#FFA500';
  ctx.fillText('BIRD', width / 2, height / 2 - 40);
  
  // Subtitle
  ctx.fillStyle = 'white';
  ctx.font = '16px "Press Start 2P"';
  ctx.fillText('Claude Version', width / 2, height / 2 + 20);
  
  // Instructions
  ctx.font = '24px "Press Start 2P"';
  ctx.fillStyle = '#90EE90';
  ctx.fillText('Click or Press SPACE', width / 2, height / 2 + 80);
  ctx.font = '20px "Press Start 2P"';
  ctx.fillStyle = 'white';
  ctx.fillText('to Start', width / 2, height / 2 + 120);
  
  // High score
  if (highScore > 0) {
    ctx.font = '20px "Press Start 2P"';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`Best: ${highScore}`, width / 2, height / 2 + 180);
  }
  
  // Flashing effect
  const time = Date.now() / 1000;
  if (Math.sin(time * 3) > 0) {
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Ready?', width / 2, height - 100);
  }
} 