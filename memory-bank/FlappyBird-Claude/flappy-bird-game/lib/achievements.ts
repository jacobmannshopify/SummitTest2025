export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  requirement: (stats: GameStats) => boolean;
}

export interface GameStats {
  currentScore: number;
  highScore: number;
  totalGames: number;
  totalScore: number;
  totalPipes: number;
  totalPowerUps: number;
  perfectGames: number; // Games with 10+ score without power-ups
}

export class AchievementManager {
  private achievements: Achievement[] = [
    {
      id: 'first_flight',
      name: 'First Flight',
      description: 'Score your first point',
      icon: '🐣',
      unlocked: false,
      requirement: (stats) => stats.totalScore > 0,
    },
    {
      id: 'high_flyer',
      name: 'High Flyer',
      description: 'Score 10 points in a single game',
      icon: '🦅',
      unlocked: false,
      requirement: (stats) => stats.currentScore >= 10,
    },
    {
      id: 'ace_pilot',
      name: 'Ace Pilot',
      description: 'Score 25 points in a single game',
      icon: '✈️',
      unlocked: false,
      requirement: (stats) => stats.currentScore >= 25,
    },
    {
      id: 'legendary',
      name: 'Legendary',
      description: 'Score 50 points in a single game',
      icon: '🏆',
      unlocked: false,
      requirement: (stats) => stats.currentScore >= 50,
    },
    {
      id: 'power_user',
      name: 'Power User',
      description: 'Collect 10 power-ups total',
      icon: '⚡',
      unlocked: false,
      requirement: (stats) => stats.totalPowerUps >= 10,
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Score 10+ without using power-ups',
      icon: '💎',
      unlocked: false,
      requirement: (stats) => stats.perfectGames > 0,
    },
    {
      id: 'veteran',
      name: 'Veteran',
      description: 'Play 50 games',
      icon: '🎖️',
      unlocked: false,
      requirement: (stats) => stats.totalGames >= 50,
    },
    {
      id: 'pipe_master',
      name: 'Pipe Master',
      description: 'Pass through 500 pipes total',
      icon: '🚰',
      unlocked: false,
      requirement: (stats) => stats.totalPipes >= 500,
    },
  ];

  constructor() {
    this.loadAchievements();
  }

  private loadAchievements() {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('flappyBirdAchievements');
    if (saved) {
      const savedAchievements = JSON.parse(saved);
      this.achievements.forEach(achievement => {
        const savedAchievement = savedAchievements.find((a: any) => a.id === achievement.id);
        if (savedAchievement) {
          achievement.unlocked = savedAchievement.unlocked;
          achievement.unlockedAt = savedAchievement.unlockedAt;
        }
      });
    }
  }

  private saveAchievements() {
    if (typeof window === 'undefined') return;
    
    const toSave = this.achievements.map(a => ({
      id: a.id,
      unlocked: a.unlocked,
      unlockedAt: a.unlockedAt,
    }));
    
    localStorage.setItem('flappyBirdAchievements', JSON.stringify(toSave));
  }

  checkAchievements(stats: GameStats): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    
    this.achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.requirement(stats)) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        newlyUnlocked.push(achievement);
      }
    });
    
    if (newlyUnlocked.length > 0) {
      this.saveAchievements();
    }
    
    return newlyUnlocked;
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getUnlockedCount(): number {
    return this.achievements.filter(a => a.unlocked).length;
  }

  drawAchievementNotification(
    ctx: CanvasRenderingContext2D,
    achievement: Achievement,
    x: number,
    y: number,
    progress: number // 0 to 1
  ) {
    const alpha = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x, y, 300, 80);
    
    // Border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, 300, 80);
    
    // Icon
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(achievement.icon, x + 40, y + 40);
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = '18px "Press Start 2P"';
    ctx.textAlign = 'left';
    ctx.fillText(achievement.name, x + 70, y + 25);
    
    // Description
    ctx.fillStyle = 'white';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText(achievement.description, x + 70, y + 50);
    
    ctx.restore();
  }
} 