export interface PerformanceMetrics {
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  droppedFrames: number;
  renderTime: number;
  updateTime: number;
  memoryUsage?: number;
}

export class PerformanceTest {
  private metrics: PerformanceMetrics = {
    averageFPS: 0,
    minFPS: Infinity,
    maxFPS: 0,
    droppedFrames: 0,
    renderTime: 0,
    updateTime: 0,
  };

  private frameCount: number = 0;
  private totalFPS: number = 0;
  private lastFrameTime: number = 0;
  private testDuration: number = 10000; // 10 seconds
  private startTime: number = 0;
  private isRunning: boolean = false;

  start() {
    this.reset();
    this.isRunning = true;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
  }

  stop(): PerformanceMetrics {
    this.isRunning = false;
    this.metrics.averageFPS = this.frameCount > 0 ? this.totalFPS / this.frameCount : 0;
    
    // Get memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    
    return this.metrics;
  }

  recordFrame(renderTime: number, updateTime: number) {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    const fps = 1000 / deltaTime;

    this.frameCount++;
    this.totalFPS += fps;
    
    // Update min/max FPS
    this.metrics.minFPS = Math.min(this.metrics.minFPS, fps);
    this.metrics.maxFPS = Math.max(this.metrics.maxFPS, fps);
    
    // Count dropped frames (below 30 FPS)
    if (fps < 30) {
      this.metrics.droppedFrames++;
    }
    
    // Update render times (rolling average)
    this.metrics.renderTime = (this.metrics.renderTime * (this.frameCount - 1) + renderTime) / this.frameCount;
    this.metrics.updateTime = (this.metrics.updateTime * (this.frameCount - 1) + updateTime) / this.frameCount;
    
    this.lastFrameTime = currentTime;
    
    // Auto-stop after test duration
    if (currentTime - this.startTime > this.testDuration) {
      this.stop();
    }
  }

  isTestRunning(): boolean {
    return this.isRunning;
  }

  getProgress(): number {
    if (!this.isRunning) return 0;
    return Math.min((performance.now() - this.startTime) / this.testDuration, 1);
  }

  private reset() {
    this.metrics = {
      averageFPS: 0,
      minFPS: Infinity,
      maxFPS: 0,
      droppedFrames: 0,
      renderTime: 0,
      updateTime: 0,
    };
    this.frameCount = 0;
    this.totalFPS = 0;
  }

  generateReport(metrics: PerformanceMetrics): string {
    const report = [
      '=== PERFORMANCE TEST REPORT ===',
      `Average FPS: ${metrics.averageFPS.toFixed(1)}`,
      `Min FPS: ${metrics.minFPS.toFixed(1)}`,
      `Max FPS: ${metrics.maxFPS.toFixed(1)}`,
      `Dropped Frames: ${metrics.droppedFrames}`,
      `Avg Render Time: ${metrics.renderTime.toFixed(2)}ms`,
      `Avg Update Time: ${metrics.updateTime.toFixed(2)}ms`,
    ];
    
    if (metrics.memoryUsage) {
      report.push(`Memory Usage: ${metrics.memoryUsage.toFixed(1)}MB`);
    }
    
    // Performance rating
    let rating = 'EXCELLENT';
    if (metrics.averageFPS < 30) rating = 'POOR';
    else if (metrics.averageFPS < 45) rating = 'FAIR';
    else if (metrics.averageFPS < 55) rating = 'GOOD';
    
    report.push(`Performance Rating: ${rating}`);
    
    return report.join('\n');
  }
} 