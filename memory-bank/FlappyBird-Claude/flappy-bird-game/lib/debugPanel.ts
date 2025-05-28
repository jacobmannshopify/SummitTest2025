export interface DebugInfo {
  fps: number;
  birdY: number;
  birdVelocity: number;
  pipeCount: number;
  score: number;
  gamePhase: string;
  difficulty: string;
  powerUps: number;
  particles: number;
}

export class DebugPanel {
  private enabled: boolean = false;
  private showHitboxes: boolean = false;
  private godMode: boolean = false;
  private autoPlay: boolean = false;

  toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  toggleHitboxes(): boolean {
    this.showHitboxes = !this.showHitboxes;
    return this.showHitboxes;
  }

  toggleGodMode(): boolean {
    this.godMode = !this.godMode;
    return this.godMode;
  }

  toggleAutoPlay(): boolean {
    this.autoPlay = !this.autoPlay;
    return this.autoPlay;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isGodMode(): boolean {
    return this.godMode;
  }

  isAutoPlay(): boolean {
    return this.autoPlay;
  }

  shouldShowHitboxes(): boolean {
    return this.showHitboxes;
  }

  draw(ctx: CanvasRenderingContext2D, info: DebugInfo, x: number = 10, y: number = 50) {
    if (!this.enabled) return;

    ctx.save();
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x, y, 250, 220);
    
    // Title
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('DEBUG PANEL', x + 10, y + 10);
    
    // Debug info
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    const lines = [
      `FPS: ${info.fps}`,
      `Phase: ${info.gamePhase}`,
      `Score: ${info.score}`,
      `Difficulty: ${info.difficulty}`,
      `Bird Y: ${Math.round(info.birdY)}`,
      `Bird Vel: ${info.birdVelocity.toFixed(2)}`,
      `Pipes: ${info.pipeCount}`,
      `Power-ups: ${info.powerUps}`,
      `Particles: ${info.particles}`,
    ];
    
    lines.forEach((line, index) => {
      ctx.fillText(line, x + 10, y + 35 + index * 15);
    });
    
    // Status indicators
    ctx.fillStyle = this.godMode ? '#00ff00' : '#ff0000';
    ctx.fillText(`God Mode: ${this.godMode ? 'ON' : 'OFF'}`, x + 10, y + 185);
    
    ctx.fillStyle = this.autoPlay ? '#00ff00' : '#ff0000';
    ctx.fillText(`Auto Play: ${this.autoPlay ? 'ON' : 'OFF'}`, x + 10, y + 200);
    
    ctx.restore();
  }

  drawHitbox(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string = '#ff0000') {
    if (!this.showHitboxes) return;
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }

  // Auto-play AI logic
  getAutoPlayDecision(birdY: number, birdVelocity: number, nextPipeGapY: number, nextPipeGapHeight: number): boolean {
    if (!this.autoPlay) return false;
    
    const birdCenter = birdY + 20; // Assuming bird height is 40
    const gapCenter = nextPipeGapY + nextPipeGapHeight / 2;
    const threshold = 30;
    
    // Jump if bird is below gap center and falling
    if (birdCenter > gapCenter + threshold && birdVelocity > -2) {
      return true;
    }
    
    return false;
  }
} 