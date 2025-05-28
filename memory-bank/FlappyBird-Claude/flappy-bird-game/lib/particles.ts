export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  active: boolean;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private particlePool: Particle[] = [];
  private maxParticles: number = 100;

  constructor() {
    // Pre-allocate particles
    for (let i = 0; i < this.maxParticles; i++) {
      this.particlePool.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      size: 0,
      color: '',
      active: false,
    };
  }

  private getParticle(): Particle | null {
    // Try to get from pool first
    const particle = this.particlePool.pop();
    if (particle) {
      particle.active = true;
      return particle;
    }
    
    // If pool is empty and we haven't hit max, create new
    if (this.particles.length < this.maxParticles) {
      const newParticle = this.createParticle();
      newParticle.active = true;
      return newParticle;
    }
    
    return null;
  }

  private releaseParticle(particle: Particle) {
    particle.active = false;
    this.particlePool.push(particle);
  }

  addFlap(x: number, y: number) {
    // Create feather particles when bird flaps
    for (let i = 0; i < 5; i++) {
      const particle = this.getParticle();
      if (!particle) break;
      
      particle.x = x;
      particle.y = y;
      particle.vx = (Math.random() - 0.5) * 3;
      particle.vy = Math.random() * 2 + 1;
      particle.life = 30;
      particle.maxLife = 30;
      particle.size = Math.random() * 3 + 2;
      particle.color = `hsl(${45 + Math.random() * 15}, 100%, ${60 + Math.random() * 20}%)`;
      
      this.particles.push(particle);
    }
  }

  addCollision(x: number, y: number) {
    // Create impact particles on collision
    for (let i = 0; i < 15; i++) {
      const particle = this.getParticle();
      if (!particle) break;
      
      const angle = (Math.PI * 2 * i) / 15;
      const speed = Math.random() * 5 + 2;
      
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.life = 40;
      particle.maxLife = 40;
      particle.size = Math.random() * 4 + 2;
      particle.color = `hsl(${Math.random() * 60}, 100%, 50%)`;
      
      this.particles.push(particle);
    }
  }

  addScore(x: number, y: number) {
    // Create sparkle particles when scoring
    for (let i = 0; i < 8; i++) {
      const particle = this.getParticle();
      if (!particle) break;
      
      const angle = (Math.PI * 2 * i) / 8;
      
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * 2;
      particle.vy = Math.sin(angle) * 2 - 1;
      particle.life = 50;
      particle.maxLife = 50;
      particle.size = 3;
      particle.color = '#FFD700';
      
      this.particles.push(particle);
    }
  }

  update() {
    // Update particles and return dead ones to pool
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2; // Gravity
      particle.life--;
      
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        this.releaseParticle(particle);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Batch similar particles together for better performance
    ctx.save();
    
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }
} 