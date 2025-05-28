export interface DifficultySettings {
  pipeSpeed: number;
  pipeGap: number;
  pipeSpawnInterval: number;
  gravity: number;
}

export class DifficultyManager {
  private baseSettings: DifficultySettings = {
    pipeSpeed: 2.5,
    pipeGap: 180,
    pipeSpawnInterval: 2000,
    gravity: 0.3,
  };

  getSettings(score: number): DifficultySettings {
    // Difficulty increases every 10 points
    const difficultyLevel = Math.floor(score / 10);
    
    return {
      // Speed increases by 0.2 per level, max 5.5
      pipeSpeed: Math.min(this.baseSettings.pipeSpeed + (difficultyLevel * 0.2), 5.5),
      
      // Gap decreases by 5 per level, min 120
      pipeGap: Math.max(this.baseSettings.pipeGap - (difficultyLevel * 5), 120),
      
      // Spawn interval decreases by 100ms per level, min 1200ms
      pipeSpawnInterval: Math.max(this.baseSettings.pipeSpawnInterval - (difficultyLevel * 100), 1200),
      
      // Gravity increases slightly, max 0.4
      gravity: Math.min(this.baseSettings.gravity + (difficultyLevel * 0.01), 0.4),
    };
  }

  getDifficultyLevel(score: number): string {
    if (score < 10) return 'Easy';
    if (score < 20) return 'Normal';
    if (score < 30) return 'Hard';
    if (score < 50) return 'Expert';
    return 'Master';
  }

  getDifficultyColor(score: number): string {
    if (score < 10) return '#44ff44'; // Green
    if (score < 20) return '#ffff44'; // Yellow
    if (score < 30) return '#ff8844'; // Orange
    if (score < 50) return '#ff4444'; // Red
    return '#ff00ff'; // Purple
  }
} 