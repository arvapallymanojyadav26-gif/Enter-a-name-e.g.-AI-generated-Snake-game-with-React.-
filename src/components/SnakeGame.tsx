import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Gamepad2 } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const move = () => {
      setSnake(prevSnake => {
        const head = { 
          x: prevSnake[0].x + direction.x, 
          y: prevSnake[0].y + direction.y 
        };

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(prev - 2, 60)); // Increase speed
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    const gameLoop = setInterval(move, speed);
    return () => clearInterval(gameLoop);
  }, [direction, food, isPaused, isGameOver, speed, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : '#0891b2';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#22d3ee';
      
      // Rounded rectangles for snake parts
      const radius = 4;
      const x = segment.x * CELL_SIZE + 1;
      const y = segment.y * CELL_SIZE + 1;
      const size = CELL_SIZE - 2;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();
    });

    // Draw Food
    ctx.fillStyle = '#ec4899';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ec4899';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[400px] font-mono">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-white/50">Score</span>
          <span className="text-2xl font-bold neon-text-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] uppercase tracking-wider text-white/50">Best</span>
          <span className="text-2xl font-bold neon-text-pink">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative p-1 rounded-lg neon-border bg-black/50 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="rounded-sm"
        />

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center glass-morphism rounded-lg"
            >
              {isGameOver ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Trophy className="w-16 h-16 neon-text-pink animate-bounce" />
                  <h2 className="text-4xl font-black uppercase tracking-tighter neon-text-pink">Game Over</h2>
                  <p className="text-white/70 font-mono">Final Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="mt-4 px-8 py-3 rounded-full neon-bg-pink hover:scale-105 transition-transform flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <Gamepad2 className="w-16 h-16 neon-text-cyan animate-pulse" />
                  <div className="text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tighter neon-text-cyan mb-2">Neon Snake</h2>
                    <p className="text-white/50 text-xs uppercase tracking-widest font-mono">Use Arrows to Move</p>
                  </div>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-10 py-4 rounded-full neon-bg-cyan hover:scale-105 transition-transform font-bold uppercase tracking-widest"
                  >
                    Start Mission
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex gap-4 text-xs font-mono text-white/30 uppercase tracking-[0.2em]">
        <span>↑↓←→ to move</span>
        <span>•</span>
        <span>Space to Pause</span>
      </div>
    </div>
  );
}
