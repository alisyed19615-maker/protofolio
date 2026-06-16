'use client';

import React, { useState, useEffect, useRef } from 'react';
import { playClick, playBeep } from './sound';

interface SnakeGameProps {
  onExit: () => void;
  terminalTheme: string;
}

export default function SnakeGame({ onExit, terminalTheme }: SnakeGameProps) {
  const GRID_WIDTH = 20;
  const GRID_HEIGHT = 12;

  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 6 },
    { x: 10, y: 7 },
    { x: 10, y: 8 }
  ]);
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // moving up
  const [food, setFood] = useState({ x: 5, y: 3 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Spawn food at random coordinates not occupied by the snake
  const spawnFood = (currentSnake: { x: number; y: number }[]) => {
    let newFood;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
      };
      isOnSnake = currentSnake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y);
    }
    setFood(newFood!);
  };

  // Handle keypress direction changes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'r' || e.key === 'R') {
          // Restart game
          setSnake([
            { x: 10, y: 6 },
            { x: 10, y: 7 },
            { x: 10, y: 8 }
          ]);
          setDirection({ x: 0, y: -1 });
          setScore(0);
          setGameOver(false);
          playClick();
        } else if (e.key === 'Escape') {
          onExit();
        }
        return;
      }

      if (e.key === 'Escape') {
        onExit();
        return;
      }

      let newDir = { ...direction };
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) {
            newDir = { x: 0, y: -1 };
            playClick();
          }
          break;
        case 'ArrowDown':
          if (direction.y === 0) {
            newDir = { x: 0, y: 1 };
            playClick();
          }
          break;
        case 'ArrowLeft':
          if (direction.x === 0) {
            newDir = { x: -1, y: 0 };
            playClick();
          }
          break;
        case 'ArrowRight':
          if (direction.x === 0) {
            newDir = { x: 1, y: 0 };
            playClick();
          }
          break;
        case ' ':
          setIsPaused(prev => !prev);
          playClick();
          break;
      }
      setDirection(newDir);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, onExit]);

  // Main game tick loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    gameIntervalRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y
        };

        // Collision Check: Walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_WIDTH ||
          newHead.y < 0 ||
          newHead.y >= GRID_HEIGHT
        ) {
          setGameOver(true);
          playBeep();
          return prevSnake;
        }

        // Collision Check: Self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          playBeep();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food Check
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10);
          spawnFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    }, 180);

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [direction, food, gameOver, isPaused]);

  // Render game board as text grid
  const renderBoard = () => {
    const board: string[][] = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      board[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        board[y][x] = '.'; // empty cell
      }
    }

    // Place Food
    if (food.x >= 0 && food.x < GRID_WIDTH && food.y >= 0 && food.y < GRID_HEIGHT) {
      board[food.y][food.x] = '*'; // food symbol
    }

    // Place Snake
    snake.forEach((segment, idx) => {
      if (segment.x >= 0 && segment.x < GRID_WIDTH && segment.y >= 0 && segment.y < GRID_HEIGHT) {
        board[segment.y][segment.x] = idx === 0 ? '@' : 'o'; // head vs body
      }
    });

    return board;
  };

  const boardGrid = renderBoard();

  return (
    <div className="flex flex-col items-center justify-center p-4 font-mono select-none" style={{ color: terminalTheme }}>
      <div className="w-full max-w-md border border-slate-800 bg-[#0c0c0e]/95 p-6 rounded-lg text-center space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2 text-xs">
          <span>🎮 CLI-SNAKE v1.0</span>
          <span>SCORE: <span className="font-bold text-white">{score}</span></span>
        </div>

        <div className="bg-black/90 p-3 rounded border border-slate-900 leading-none">
          <pre className="text-sm tracking-widest inline-block select-none font-bold">
            {boardGrid.map(row => row.join(' ')).join('\n')}
          </pre>
        </div>

        {gameOver ? (
          <div className="space-y-1 py-2 text-red-400">
            <p className="font-bold text-sm">❌ GAME OVER</p>
            <p className="text-[10px] text-slate-500">Press [R] to Restart | [ESC] to Exit</p>
          </div>
        ) : isPaused ? (
          <p className="text-xs text-yellow-500 py-2">⏸ GAME PAUSED (Press [Space] to Resume)</p>
        ) : (
          <p className="text-[10px] text-slate-500 py-2">Controls: Arrow keys to steer | [Space] to Pause | [ESC] to Exit</p>
        )}

        <button 
          onClick={onExit}
          className="px-4 py-1 text-xs border border-slate-800 rounded hover:bg-slate-900 text-slate-400 hover:text-white transition-all cursor-default"
        >
          Exit to Shell
        </button>
      </div>
    </div>
  );
}
