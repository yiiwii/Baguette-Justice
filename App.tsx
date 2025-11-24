
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, EnemyState, PlayerAction } from './types';
import { 
  WINNING_SCORE, 
  MAX_CHARGE_TIME_MS, 
  BASE_DAMAGE, 
  MAX_BONUS_DAMAGE, 
  MIN_WORK_TIME,
  MAX_WORK_TIME,
  ALERT_DURATION,
  WATCH_DURATION,
  STUN_DURATION
} from './constants';
import Man from './components/Man';
import Baguette from './components/Baguette';
import { 
  Bookshelf, 
  BigMonitor, 
  Plant, 
  StackOfBooks 
} from './components/PixelComponents';

// --- RETRO AUDIO SYNTHESIZER ---
const playRetroSound = (type: 'hit' | 'alert' | 'win' | 'lose' | 'charge' | 'click') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  switch (type) {
    case 'hit': // Low thud
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
      
    case 'alert': // Warning beep
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2); // Faster beep
      osc.start(now);
      osc.stop(now + 0.2);
      break;
      
    case 'win': // Major Arpeggio
      osc.type = 'square';
      gain.gain.value = 0.1;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const t = now + i * 0.1;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'square';
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.1, t);
        g.gain.linearRampToValueAtTime(0, t + 0.1);
        o.start(t);
        o.stop(t + 0.1);
      });
      break;

    case 'lose': // Dissonant slide
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.5);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;

    case 'click': // UI Click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
  }
};

// Seperate function for dynamic charge sound
const chargeOscillatorRef = { current: null as OscillatorNode | null };
const chargeGainRef = { current: null as GainNode | null };
const chargeCtxRef = { current: null as AudioContext | null };

const startChargeSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    if (!chargeCtxRef.current) chargeCtxRef.current = new AudioContext();
    const ctx = chargeCtxRef.current;
    
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + MAX_CHARGE_TIME_MS / 1000);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    chargeOscillatorRef.current = osc;
    chargeGainRef.current = gain;
};

const stopChargeSound = () => {
    if (chargeOscillatorRef.current) {
        const now = chargeCtxRef.current?.currentTime || 0;
        chargeGainRef.current?.gain.cancelScheduledValues(now);
        chargeGainRef.current?.gain.linearRampToValueAtTime(0, now + 0.1);
        chargeOscillatorRef.current.stop(now + 0.1);
        chargeOscillatorRef.current = null;
    }
};


const App: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  
  // Entity States
  const [enemyState, setEnemyState] = useState<EnemyState>(EnemyState.WORKING);
  const [playerAction, setPlayerAction] = useState<PlayerAction>(PlayerAction.IDLE);
  const [chargePercent, setChargePercent] = useState(0);

  // Refs
  const chargeStartTimeRef = useRef<number | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const enemyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- ENEMY AI LOGIC ---
  const scheduleNextEnemyMove = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;

    const timeToWork = Math.random() * (MAX_WORK_TIME - MIN_WORK_TIME) + MIN_WORK_TIME;
    
    enemyTimeoutRef.current = setTimeout(() => {
      // 1. Alert Phase (Head turning start)
      if (gameState === GameState.PLAYING) {
        setEnemyState(EnemyState.ALERT);
        playRetroSound('alert');
      }

      enemyTimeoutRef.current = setTimeout(() => {
        // 2. Watching Phase (Danger)
        if (gameState === GameState.PLAYING) {
          setEnemyState(EnemyState.WATCHING);
        }
        
        enemyTimeoutRef.current = setTimeout(() => {
          // 3. Back to Work (Safe)
          if (gameState === GameState.PLAYING) {
            setEnemyState(EnemyState.WORKING);
            scheduleNextEnemyMove();
          }
        }, WATCH_DURATION);

      }, ALERT_DURATION);
    }, timeToWork);
  }, [gameState]);

  // --- GAME LOOPS ---

  // Main Charge/Check Loop
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const loop = () => {
      // Handle Charging Logic
      if (playerAction === PlayerAction.CHARGING && chargeStartTimeRef.current) {
        const elapsed = Date.now() - chargeStartTimeRef.current;
        const percent = Math.min(elapsed / MAX_CHARGE_TIME_MS, 1);
        setChargePercent(percent);

        // INSTANT LOSE CONDITION: Charging while he watches
        if (enemyState === EnemyState.WATCHING || enemyState === EnemyState.CAUGHT_YOU) {
             handleGameOver();
             return; 
        }
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, playerAction, enemyState]);

  // Start Enemy AI when entering Playing state
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      setScore(0);
      setEnemyState(EnemyState.WORKING);
      setPlayerAction(PlayerAction.IDLE);
      setChargePercent(0);
      scheduleNextEnemyMove();
    }
    return () => {
      if (enemyTimeoutRef.current) clearTimeout(enemyTimeoutRef.current);
      stopChargeSound();
    };
  }, [gameState, scheduleNextEnemyMove]);

  // --- HANDLERS ---

  const handleGameOver = () => {
    setGameState(GameState.GAME_OVER);
    setEnemyState(EnemyState.CAUGHT_YOU);
    setPlayerAction(PlayerAction.IDLE);
    playRetroSound('lose');
    stopChargeSound();
  };

  const handleStartCharge = (e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    if (gameState !== GameState.PLAYING) return;
    // Prevent default context menus
    // e.preventDefault(); 

    if (enemyState === EnemyState.WATCHING) {
      handleGameOver();
      return;
    }

    setPlayerAction(PlayerAction.CHARGING);
    chargeStartTimeRef.current = Date.now();
    startChargeSound();
  };

  const handleReleaseCharge = () => {
    if (gameState !== GameState.PLAYING || playerAction !== PlayerAction.CHARGING) return;
    
    stopChargeSound();
    const finalCharge = chargePercent;
    
    // Animate Swing
    setPlayerAction(PlayerAction.SWINGING);
    chargeStartTimeRef.current = null;

    // Check Hit Logic
    setTimeout(() => {
      if (enemyState === EnemyState.WATCHING || enemyState === EnemyState.CAUGHT_YOU) {
        handleGameOver();
      } else {
        // Successful Hit
        const damage = BASE_DAMAGE + Math.floor(finalCharge * MAX_BONUS_DAMAGE);
        const newScore = Math.min(score + damage, WINNING_SCORE);
        setScore(newScore);
        
        setEnemyState(EnemyState.HIT);
        playRetroSound('hit');

        if (newScore >= WINNING_SCORE) {
          setTimeout(() => {
            setGameState(GameState.VICTORY);
            playRetroSound('win');
          }, 500);
        } else {
          // Recover from hit
          setTimeout(() => {
             // If game isn't over, go back to working or restart cycle
             if (gameState === GameState.PLAYING) {
               setEnemyState(EnemyState.WORKING);
               // Restart AI Loop immediately so he doesn't stay stuck
               if (enemyTimeoutRef.current) clearTimeout(enemyTimeoutRef.current);
               scheduleNextEnemyMove();
             }
          }, STUN_DURATION);
        }
      }
      
      // Reset arm
      setTimeout(() => {
        if (gameState === GameState.PLAYING) {
          setPlayerAction(PlayerAction.IDLE);
          setChargePercent(0);
        }
      }, 300); // Swing duration
    }, 100); // Delay impact slightly for visual sync
  };

  // --- RENDER ---

  return (
    <div 
      className="relative w-full h-screen bg-slate-900 overflow-hidden flex flex-col font-sans select-none"
      onPointerUp={handleReleaseCharge}
      onMouseUp={handleReleaseCharge}
      onTouchEnd={handleReleaseCharge}
      style={{ touchAction: 'none' }} 
    >
      {/* UI HEADER */}
      <div className="absolute top-0 left-0 w-full p-4 z-50 flex justify-between items-start pointer-events-none">
         <div className="bg-slate-800 border-4 border-slate-600 p-3 rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
           <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-widest">Justice Score</div>
           <div className="text-2xl text-yellow-400 font-bold" style={{ fontFamily: '"Press Start 2P", cursive' }}>
             {score}/{WINNING_SCORE}
           </div>
           <div className="w-32 h-4 bg-slate-900 mt-2 border-2 border-slate-600">
             <div 
               className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300" 
               style={{ width: `${(score / WINNING_SCORE) * 100}%` }}
             />
           </div>
         </div>

         {/* Hint */}
         {gameState === GameState.PLAYING && (
           <div className="text-white text-[10px] md:text-xs bg-black/60 p-2 border border-white/20 rounded animate-pulse text-center">
              HOLD to Charge<br/>RELEASE to Hit
           </div>
         )}
      </div>

      {/* GAME SCENE LAYER */}
      <div className="flex-1 relative perspective-1000 overflow-hidden bg-[#1a1c2c]">
        
        {/* WALL & BACKGROUND */}
        <div className="absolute top-0 left-0 w-full h-[65%] bg-[#2d3447] border-b-8 border-[#1f2430]">
             {/* Wallpaper pattern or posters */}
             <div className="absolute top-10 right-20 w-32 h-40 bg-[#1f2430] rotate-2 opacity-50 border-4 border-black/20 flex items-center justify-center">
                 <div className="text-xs text-center opacity-30 font-mono">GAMER<br/>ZONE</div>
             </div>
        </div>

        {/* BOOKSHELF - Moved out of Wall container to fix layering/clipping */}
        {/* Positioned at bottom-[35%] to sit exactly on the floor line */}
        <div className="absolute bottom-[35%] left-[10%] z-0">
             <Bookshelf />
        </div>

        {/* FLOOR */}
        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-[#483b3a] relative overflow-hidden">
             {/* Floorboards effect */}
             <div className="w-full h-full opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, #000 50%)', backgroundSize: '40px 100%' }}></div>
        </div>

        {/* DESK SETUP (Z-index 10) */}
        {/* Adjusted bottom position to match lower chair */}
        <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2 w-full max-w-[800px] z-10 flex justify-center">
             <div className="relative w-[650px]">
                 {/* Table Surface */}
                 <div className="absolute bottom-0 w-full h-20 bg-[#5d4037] border-t-8 border-[#795548] shadow-2xl z-20 rounded-sm">
                      {/* Legs */}
                      <div className="absolute top-full left-4 w-6 h-48 bg-[#3e2723]"></div>
                      <div className="absolute top-full right-4 w-6 h-48 bg-[#3e2723]"></div>
                 </div>

                 {/* Desk Contents */}
                 <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
                     <BigMonitor />
                 </div>

                 <div className="absolute bottom-20 left-10 z-10 scale-90">
                     <Plant />
                 </div>

                 <div className="absolute bottom-20 right-10 z-10 scale-90">
                     <StackOfBooks />
                 </div>
             </div>
        </div>

        {/* MAN LAYER (Z-index 20) */}
        <Man state={enemyState} />
        
        {/* Interaction Layer (Invisible trigger area) */}
        {gameState === GameState.PLAYING && (
           <div 
             className="absolute inset-0 z-50 cursor-crosshair active:cursor-grabbing"
             onPointerDown={handleStartCharge}
             onMouseDown={handleStartCharge}
             onTouchStart={handleStartCharge}
           ></div>
        )}

        {/* Player Weapon (Foreground - Z 60) */}
        <Baguette action={playerAction} chargePercent={chargePercent} />

      </div>


      {/* OVERLAY SCREENS */}
      
      {/* MENU */}
      {gameState === GameState.MENU && (
        <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-5xl text-yellow-400 mb-8 drop-shadow-[4px_4px_0_#000] leading-relaxed tracking-tighter" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            BAGUETTE<br/>JUSTICE<br/>FOR IGNORING<br/>BOYFRIEND
          </h1>
          <p className="text-slate-300 mb-12 text-xs md:text-sm max-w-md leading-6 font-mono">
            MISSION: Hit your boyfriend who keeps ignoring you with a baguette.<br/>
            CONDITION: Don't let him see you!<br/>
            GOAL: 100 Points.
          </p>
          <button 
            onClick={() => {
              playRetroSound('click');
              setGameState(GameState.PLAYING);
            }}
            className="px-8 py-4 bg-yellow-600 text-white font-bold text-xl border-b-8 border-yellow-800 active:border-b-0 active:translate-y-2 hover:bg-yellow-500 transition-all uppercase"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            START JUSTICE
          </button>
        </div>
      )}

      {/* GAME OVER */}
      {gameState === GameState.GAME_OVER && (
        <div className="absolute inset-0 bg-red-900/95 z-50 flex flex-col items-center justify-center text-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="text-8xl mb-4 animate-bounce">👀</div>
          <h2 className="text-3xl text-white mb-4" style={{ fontFamily: '"Press Start 2P", cursive' }}>BUSTED!</h2>
          <p className="text-red-200 mb-8 font-mono">He saw you raising the baguette!</p>
          <div className="text-xl text-yellow-400 mb-8 border-2 border-yellow-400 p-4 rounded bg-black/30">
            JUSTICE SCORE: {score}
          </div>
          <button 
            onClick={() => {
              playRetroSound('click');
              setGameState(GameState.PLAYING);
            }}
            className="px-6 py-3 bg-white text-red-900 font-bold border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 hover:bg-gray-100"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            TRY AGAIN
          </button>
          <button 
            onClick={() => setGameState(GameState.MENU)}
            className="mt-8 text-xs text-white underline opacity-50 hover:opacity-100"
          >
            Return to Menu
          </button>
        </div>
      )}

      {/* VICTORY */}
      {gameState === GameState.VICTORY && (
        <div className="absolute inset-0 bg-green-800/95 z-50 flex flex-col items-center justify-center text-center p-4">
          <div className="text-8xl mb-4 animate-spin-slow">🥖</div>
          <h2 className="text-3xl text-yellow-300 mb-4 drop-shadow-md" style={{ fontFamily: '"Press Start 2P", cursive' }}>JUSTICE SERVED!</h2>
          <p className="text-green-200 mb-8 font-mono max-w-sm">
            You successfully got his attention.<br/>Hopefully.
          </p>
          <button 
            onClick={() => {
               playRetroSound('click');
               setGameState(GameState.MENU);
            }}
            className="px-6 py-3 bg-yellow-500 text-white font-bold border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 hover:bg-yellow-400"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

    </div>
  );
};

export default App;
