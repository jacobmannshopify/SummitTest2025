'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Bird, Pipe, GameState, GAME_CONFIG } from '@/types/game';
import { drawBird, updateBird, jumpBird } from './Bird';
import { drawPipe, updatePipe, createPipe } from './Pipe';
import { drawBackground, drawGround } from './Background';
import { checkCollision, checkGroundCollision, checkCeilingCollision } from '@/lib/collision';

interface GameCanvasProps {
  width?: number;
  height?: number;
}

const initialBird: Bird = {
  position: { x: 50, y: 200 },
  velocity: { x: 0, y: 0 },
  width: GAME_CONFIG.BIRD_SIZE,
  height: GAME_CONFIG.BIRD_SIZE,
  rotation: 0,
};

export default function GameCanvas({ 
  width = 288, 
  height = 512 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState>({
    bird: initialBird,
    pipes: [],
    score: 0,
    gameOver: false,
    started: false,
  });
  const lastPipeTimeRef = useRef<number>(0);
  const groundOffsetRef = useRef<number>(0);
  
  const [, forceUpdate] = useState({});

  const handleClick = useCallback(() => {
    const gameState = gameStateRef.current;
    
    if (!gameState.started) {
      gameStateRef.current = { ...gameState, started: true };
      lastPipeTimeRef.current = performance.now();
    } else if (!gameState.gameOver) {
      gameStateRef.current = {
        ...gameState,
        bird: jumpBird(gameState.bird),
      };
    } else {
      // Reset game
      gameStateRef.current = {
        bird: initialBird,
        pipes: [],
        score: 0,
        gameOver: false,
        started: true,
      };
      lastPipeTimeRef.current = performance.now();
      groundOffsetRef.current = 0;
    }
    
    forceUpdate({});
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    drawBackground({ ctx, width, height, groundOffset: groundOffsetRef.current });

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
        gameStateRef.current = { ...gameState, gameOver: true };
        forceUpdate({});
        return; // Stop updating on collision
      }

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
          forceUpdate({});
        }
      });

      // Update bird position
      gameState.bird = updatedBird;
    }

    // Draw pipes
    gameState.pipes.forEach(pipe => {
      drawPipe({ pipe, ctx, canvasHeight: height });
    });

    // Draw ground (on top of pipes)
    drawGround({ ctx, width, height, groundOffset: groundOffsetRef.current });

    // Draw bird
    if (gameState.started) {
      drawBird({ bird: gameState.bird, ctx });
    }

    // Draw UI
    if (!gameState.started) {
      ctx.fillStyle = 'white';
      ctx.font = '20px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('Click to Start', width / 2, height / 2);
    } else if (gameState.gameOver) {
      ctx.fillStyle = 'white';
      ctx.font = '20px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', width / 2, height / 2 - 30);
      ctx.font = '16px "Press Start 2P"';
      ctx.fillText('Click to Retry', width / 2, height / 2 + 10);
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop, width, height]);

  const gameState = gameStateRef.current;

  return (
    <div className="relative">
      {gameState.started && !gameState.gameOver && (
        <div className="score">{gameState.score}</div>
      )}
      <canvas
        ref={canvasRef}
        className="block cursor-pointer"
        onClick={handleClick}
      />
    </div>
  );
} 