interface GameOverScreenProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
}

export function drawGameOverScreen({ ctx, width, height, score, highScore, isNewHighScore }: GameOverScreenProps) {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, width, height);
  
  // Game Over panel background
  const panelWidth = 400;
  const panelHeight = 300;
  const panelX = (width - panelWidth) / 2;
  const panelY = (height - panelHeight) / 2;
  
  // Panel shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(panelX + 10, panelY + 10, panelWidth, panelHeight);
  
  // Panel background
  ctx.fillStyle = '#DED895';
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  
  // Panel border
  ctx.strokeStyle = '#83650A';
  ctx.lineWidth = 4;
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
  
  // Title
  ctx.fillStyle = '#333';
  ctx.font = '36px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', width / 2, panelY + 60);
  
  // Score section
  ctx.font = '20px "Press Start 2P"';
  ctx.fillStyle = '#333';
  ctx.fillText('SCORE', width / 2 - 100, panelY + 120);
  ctx.fillStyle = '#FF6347';
  ctx.font = '28px "Press Start 2P"';
  ctx.fillText(score.toString(), width / 2 - 100, panelY + 155);
  
  // Best score
  ctx.font = '20px "Press Start 2P"';
  ctx.fillStyle = '#333';
  ctx.fillText('BEST', width / 2 + 100, panelY + 120);
  ctx.fillStyle = '#FF6347';
  ctx.font = '28px "Press Start 2P"';
  ctx.fillText(highScore.toString(), width / 2 + 100, panelY + 155);
  
  // New high score indicator
  if (isNewHighScore && score > 0) {
    ctx.fillStyle = '#FFD700';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('NEW BEST!', width / 2, panelY + 200);
  }
  
  // Medal
  const medalX = width / 2;
  const medalY = panelY + 180;
  drawMedal(ctx, medalX, medalY, score);
  
  // Restart instruction
  ctx.fillStyle = '#90EE90';
  ctx.font = '20px "Press Start 2P"';
  ctx.fillText('Click to Retry', width / 2, panelY + panelHeight - 40);
}

function drawMedal(ctx: CanvasRenderingContext2D, x: number, y: number, score: number) {
  if (score === 0) return;
  
  let medalColor = '#CD7F32'; // Bronze
  let medalText = 'BRONZE';
  
  if (score >= 40) {
    medalColor = '#FFD700'; // Gold
    medalText = 'GOLD';
  } else if (score >= 30) {
    medalColor = '#E5E4E2'; // Platinum
    medalText = 'PLATINUM';
  } else if (score >= 20) {
    medalColor = '#C0C0C0'; // Silver
    medalText = 'SILVER';
  } else if (score >= 10) {
    medalColor = '#CD7F32'; // Bronze
    medalText = 'BRONZE';
  } else {
    return; // No medal for scores under 10
  }
  
  // Medal circle
  ctx.beginPath();
  ctx.arc(x, y + 20, 30, 0, Math.PI * 2);
  ctx.fillStyle = medalColor;
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Medal text
  ctx.fillStyle = '#333';
  ctx.font = '10px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText(medalText, x, y + 25);
} 