'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Bird, Pipe, GameState, GAME_CONFIG } from '@/types/game';
import { drawBird, updateBird, jumpBird } from './Bird';
import { drawPipe, updatePipe, createPipe } from './Pipe';
import { drawBackground, drawGround } from './Background';

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
  const lastPipeTimeRef = useRef<number>(0);
  
  const [gameState, setGameState] = useState<GameState>({
    bird: initialBird,
    pipes: [],
    score: 0,
    gameOver: false,
    started: false,
  });
  
  const [groundOffset, setGroundOffset] = useState(0);

  const handleClick = useCallback(() => {
    if (!gameState.started) {
      setGameState(prev => ({ ...prev, started: true }));
    } else if (!gameState.gameOver) {
      setGameState(prev => ({
        ...prev,
        bird: jumpBird(prev.bird),
      }));
    } else {
      // Reset game
      setGameState({
        bird: initialBird,
        pipes: [],
        score: 0,
        gameOver: false,
        started: true,
      });
      lastPipeTimeRef.current = 0;
    }
  }, [gameState.started, gameState.gameOver]);

  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    drawBackground({ ctx, width, height, groundOffset });

    if (gameState.started && !gameState.gameOver) {
      // Update ground offset for scrolling effect
      setGroundOffset(prev => (prev + GAME_CONFIG.PIPE_SPEED) % width);

      // Update bird
      const updatedBird = updateBird(gameState.bird, height);

      // Check if bird hit the ground
      if (updatedBird.position.y + updatedBird.height >= height - GAME_CONFIG.GROUND_HEIGHT) {
        setGameState(prev => ({ ...prev, gameOver: true }));
      }

      // Spawn new pipes
      if (timestamp - lastPipeTimeRef.current > GAME_CONFIG.PIPE_SPAWN_INTERVAL) {
        setGameState(prev => ({
          ...prev,
          pipes: [...prev.pipes, createPipe(width, height)],
        }));
        lastPipeTimeRef.current = timestamp;
      }

      // Update pipes
      const updatedPipes = gameState.pipes
        .map(pipe => updatePipe(pipe))
        .filter(pipe => pipe.position.x + pipe.width > -50); // Remove off-screen pipes

      // Check for score
      let newScore = gameState.score;
      updatedPipes.forEach(pipe => {
        if (!pipe.passed && pipe.position.x + pipe.width < updatedBird.position.x) {
          pipe.passed = true;
          newScore++;
        }
      });

      setGameState(prev => ({
        ...prev,
        bird: updatedBird,
        pipes: updatedPipes,
        score: newScore,
      }));
    }

    // Draw pipes
    gameState.pipes.forEach(pipe => {
      drawPipe({ pipe, ctx, canvasHeight: height });
    });

    // Draw ground (on top of pipes)
    drawGround({ ctx, width, height, groundOffset });

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
  }, [gameState, width, height, groundOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    requestRef.current = requestAnimationFrame((timestamp) => gameLoop(timestamp));

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop, width, height]);

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