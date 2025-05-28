export interface TimeOfDay {
  name: string;
  skyGradient: string[];
  cloudOpacity: number;
  lightLevel: number;
}

export class DayNightCycle {
  private times: TimeOfDay[] = [
    {
      name: 'Dawn',
      skyGradient: ['#FFB6C1', '#87CEEB', '#FFA07A'],
      cloudOpacity: 0.7,
      lightLevel: 0.7,
    },
    {
      name: 'Day',
      skyGradient: ['#4EC0CA', '#70C5CE'],
      cloudOpacity: 0.8,
      lightLevel: 1.0,
    },
    {
      name: 'Sunset',
      skyGradient: ['#87CEEB', '#FDB813', '#FD7813'],
      cloudOpacity: 0.6,
      lightLevel: 0.8,
    },
    {
      name: 'Night',
      skyGradient: ['#0C1445', '#183059', '#2C5F7C'],
      cloudOpacity: 0.3,
      lightLevel: 0.4,
    },
  ];

  getTimeOfDay(score: number): TimeOfDay {
    // Cycle through times every 15 points
    const cycleLength = this.times.length * 15;
    const position = score % cycleLength;
    const timeIndex = Math.floor(position / 15);
    
    return this.times[timeIndex];
  }

  drawSky(ctx: CanvasRenderingContext2D, width: number, height: number, score: number, groundHeight: number) {
    const time = this.getTimeOfDay(score);
    const gradient = ctx.createLinearGradient(0, 0, 0, height - groundHeight);
    
    // Add gradient stops
    const stops = time.skyGradient.length;
    time.skyGradient.forEach((color, index) => {
      gradient.addColorStop(index / (stops - 1), color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height - groundHeight);
    
    // Add stars for night time
    if (time.name === 'Night') {
      this.drawStars(ctx, width, height - groundHeight);
    }
    
    // Add sun/moon
    this.drawCelestialBody(ctx, width, height, time.name);
  }

  private drawStars(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = 'white';
    
    // Draw random stars (use fixed positions based on canvas size for consistency)
    for (let i = 0; i < 50; i++) {
      const x = (i * 73) % width;
      const y = (i * 37) % height;
      const size = (i % 3) + 1;
      
      ctx.globalAlpha = 0.5 + (i % 5) * 0.1;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  }

  private drawCelestialBody(ctx: CanvasRenderingContext2D, width: number, height: number, timeName: string) {
    const x = width * 0.8;
    const y = height * 0.2;
    
    if (timeName === 'Night') {
      // Draw moon
      ctx.fillStyle = '#F0E68C';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Moon craters
      ctx.fillStyle = '#DDD685';
      ctx.beginPath();
      ctx.arc(x - 8, y - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 10, y + 8, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (timeName === 'Day' || timeName === 'Dawn') {
      // Draw sun
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun rays
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const innerRadius = 30;
        const outerRadius = 40;
        
        ctx.beginPath();
        ctx.moveTo(
          x + Math.cos(angle) * innerRadius,
          y + Math.sin(angle) * innerRadius
        );
        ctx.lineTo(
          x + Math.cos(angle) * outerRadius,
          y + Math.sin(angle) * outerRadius
        );
        ctx.stroke();
      }
    }
  }
} 