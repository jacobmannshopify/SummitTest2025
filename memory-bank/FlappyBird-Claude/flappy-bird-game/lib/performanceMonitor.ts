export class PerformanceMonitor {
  private fps: number = 0;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private lastFpsUpdate: number = 0;
  private enabled: boolean = false;

  update() {
    if (!this.enabled) return;

    const currentTime = performance.now();
    this.frameCount++;

    // Update FPS every second
    if (currentTime >= this.lastFpsUpdate + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number = 10, y: number = 10) {
    if (!this.enabled) return;

    ctx.save();
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, 100, 30);
    
    // FPS text
    ctx.fillStyle = this.fps < 30 ? '#ff4444' : this.fps < 50 ? '#ffaa44' : '#44ff44';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`FPS: ${this.fps}`, x + 5, y + 8);
    
    ctx.restore();
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.reset();
    }
  }

  reset() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.lastFpsUpdate = performance.now();
  }

  isEnabled() {
    return this.enabled;
  }

  getFPS() {
    return this.fps;
  }
} 