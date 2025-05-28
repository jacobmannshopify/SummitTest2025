'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Bird, Pipe, GameState, GAME_CONFIG } from '@/types/game';
import { drawBird, updateBird, jumpBird } from './Bird';
import { drawPipe, updatePipe, createPipe } from './Pipe';
import { drawBackground, drawGround } from './Background';
import { checkCollision, checkGroundCollision, checkCeilingCollision } from '@/lib/collision';
import { drawStartScreen } from './StartScreen';
import { drawGameOverScreen } from './GameOverScreen';
import { ParticleSystem } from '@/lib/particles';
import { SoundGenerator } from '@/lib/soundGenerator';
import { MusicGenerator } from '@/lib/musicGenerator';

interface GameCanvasProps {
  width?: number;
  height?: number;
}

const initialBird: Bird = {
  position: { x: 100, y: 250 },
  velocity: { x: 0, y: 0 },
  width: GAME_CONFIG.BIRD_SIZE,
  height: GAME_CONFIG.BIRD_SIZE,
  rotation: 0,
};

export default function GameCanvas({ 
  width: propWidth, 
  height: propHeight 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);
  const particleSystemRef = useRef<ParticleSystem>(new ParticleSystem());
  const soundRef = useRef<SoundGenerator>(new SoundGenerator());
  const musicRef = useRef<MusicGenerator>(new MusicGenerator());
  const lastFrameTimeRef = useRef<number>(0);
  
  // Load high score from localStorage
  const getHighScore = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flappyBirdHighScore');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  };
  
  const gameStateRef = useRef<GameState>({
    bird: initialBird,
    pipes: [],
    score: 0,
    highScore: getHighScore(),
    gameOver: false,
    started: false,
    gamePhase: 'MENU',
  });
  const lastPipeTimeRef = useRef<number>(0);
  const groundOffsetRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ 
    width: propWidth || (typeof window !== 'undefined' ? window.innerWidth : 800), 
    height: propHeight || (typeof window !== 'undefined' ? window.innerHeight : 600) 
  });
  
  const [, forceUpdate] = useState({});
  
  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!propWidth || !propHeight) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [propWidth, propHeight]);
  
  const { width, height } = dimensions;
  
  // Reset bird position when dimensions change
  useEffect(() => {
    const gameState = gameStateRef.current;
    if (!gameState.started) {
      gameStateRef.current = {
        ...gameState,
        bird: {
          ...gameState.bird,
          position: { x: 100, y: height / 2 }
        }
      };
    }
  }, [height]);

  const handleClick = useCallback(() => {
    const gameState = gameStateRef.current;
    
    if (gameState.gamePhase === 'MENU') {
      gameStateRef.current = { 
        ...gameState, 
        started: true,
        gamePhase: 'PLAYING'
      };
      lastPipeTimeRef.current = performance.now();
      soundRef.current.playSwoosh();
      // Start music when game starts
      musicRef.current.start();
    } else if (gameState.gamePhase === 'PLAYING' && !gameState.gameOver) {
      gameStateRef.current = {
        ...gameState,
        bird: jumpBird(gameState.bird),
      };
      // Add flap particles
      particleSystemRef.current.addFlap(
        gameState.bird.position.x + gameState.bird.width / 2,
        gameState.bird.position.y + gameState.bird.height / 2
      );
      // Play flap sound
      soundRef.current.playFlap();
    } else if (gameState.gamePhase === 'GAME_OVER') {
      // Reset game
      gameStateRef.current = {
        bird: initialBird,
        pipes: [],
        score: 0,
        highScore: gameState.highScore,
        gameOver: false,
        started: true,
        gamePhase: 'PLAYING',
      };
      lastPipeTimeRef.current = performance.now();
      groundOffsetRef.current = 0;
      soundRef.current.playSwoosh();
      // Stop music on game over
      musicRef.current.stop();
    }
    
    forceUpdate({});
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;
    frameRef.current++;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    drawBackground({ 
      ctx, 
      width, 
      height, 
      groundOffset: groundOffsetRef.current, 
      frame: frameRef.current,
      gamePhase: gameState.gamePhase 
    });

    if (gameState.started && !gameState.gameOver) {
      // Update ground offset for scrolling effect
      groundOffsetRef.current = (groundOffsetRef.current + GAME_CONFIG.PIPE_SPEED) % width;

      // Update bird
      const updatedBird = updateBird(gameState.bird, height);

      // Check collisions
      let collision = false;
      
      // Check ground and ceiling collisions
      if (checkGroundCollision(updatedBird, height) || checkCeilingCollision(updatedBird)) {
        collision = true;
      }
      
      // Check pipe collisions
      for (const pipe of gameState.pipes) {
        if (checkCollision(updatedBird, pipe)) {
          collision = true;
          break;
        }
      }
      
      if (collision) {
        // Add collision particles
        particleSystemRef.current.addCollision(
          gameState.bird.position.x + gameState.bird.width / 2,
          gameState.bird.position.y + gameState.bird.height / 2
        );
        
        // Play collision sounds
        soundRef.current.playHit();
        setTimeout(() => soundRef.current.playDie(), 100);
        
        // Stop music on game over
        musicRef.current.stop();
        
        // Check for new high score
        const isNewHighScore = gameState.score > gameState.highScore;
        if (isNewHighScore) {
          gameStateRef.current.highScore = gameState.score;
          localStorage.setItem('flappyBirdHighScore', gameState.score.toString());
        }
        
        gameStateRef.current = { 
          ...gameState, 
          gameOver: true,
          gamePhase: 'GAME_OVER',
          highScore: isNewHighScore ? gameState.score : gameState.highScore
        };
        forceUpdate({});
      } else {
        // Only update if no collision
        // Spawn new pipes
        if (timestamp - lastPipeTimeRef.current > GAME_CONFIG.PIPE_SPAWN_INTERVAL) {
          gameState.pipes.push(createPipe(width, height));
          lastPipeTimeRef.current = timestamp;
        }

        // Update pipes
        gameState.pipes = gameState.pipes
          .map(pipe => updatePipe(pipe))
          .filter(pipe => pipe.position.x + pipe.width > -50); // Remove off-screen pipes

        // Check for score
        gameState.pipes.forEach(pipe => {
          if (!pipe.passed && pipe.position.x + pipe.width < updatedBird.position.x) {
            pipe.passed = true;
            gameState.score++;
            // Add score particles
            particleSystemRef.current.addScore(
              updatedBird.position.x + updatedBird.width / 2,
              updatedBird.position.y
            );
            // Play score sound
            soundRef.current.playScore();
            forceUpdate({});
          }
        });

        // Update bird position
        gameState.bird = updatedBird;
      }
    }

    // Draw pipes
    gameState.pipes.forEach(pipe => {
      drawPipe({ pipe, ctx, canvasHeight: height });
    });

    // Draw ground (on top of pipes)
    drawGround({ 
      ctx, 
      width, 
      height, 
      groundOffset: groundOffsetRef.current, 
      frame: frameRef.current,
      gamePhase: gameState.gamePhase 
    });

    // Draw bird
    if (gameState.started) {
      drawBird({ bird: gameState.bird, ctx, frame: frameRef.current });
    }

    // Update and draw particles
    particleSystemRef.current.update();
    particleSystemRef.current.draw(ctx);

    // Draw UI
    if (gameState.gamePhase === 'MENU') {
      drawStartScreen({ 
        ctx, 
        width, 
        height, 
        highScore: gameState.highScore 
      });
    } else if (gameState.gamePhase === 'GAME_OVER') {
      const isNewHighScore = gameState.score > 0 && gameState.score >= gameState.highScore;
      drawGameOverScreen({ 
        ctx, 
        width, 
        height, 
        score: gameState.score,
        highScore: gameState.highScore,
        isNewHighScore
      });
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    // Add keyboard listener
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameLoop, width, height, handleClick]);

  const gameState = gameStateRef.current;

  return (
    <div className="relative">
      {gameState.gamePhase === 'PLAYING' && !gameState.gameOver && (
        <>
          <div className="score">{gameState.score}</div>
          <div className="high-score">Best: {gameState.highScore}</div>
        </>
      )}
      <canvas
        ref={canvasRef}
        className="block cursor-pointer"
        style={{ touchAction: 'none' }}
        onClick={handleClick}
        onTouchStart={(e) => {
          e.preventDefault();
          handleClick();
        }}
      />
      {/* Sound toggle button */}
      <button
        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all"
        onClick={() => {
          const soundEnabled = soundRef.current.toggle();
          const musicEnabled = musicRef.current.toggle();
          if (!musicEnabled) {
            musicRef.current.stop();
          } else if (gameState.gamePhase === 'PLAYING' && !gameState.gameOver) {
            musicRef.current.start();
          }
          forceUpdate({});
        }}
        style={{ fontSize: '20px' }}
      >
        {soundRef.current.isEnabled() ? '🔊' : '🔇'}
      </button>
    </div>
  );
} 