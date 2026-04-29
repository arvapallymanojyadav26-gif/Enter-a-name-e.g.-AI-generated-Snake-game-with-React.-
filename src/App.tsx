/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Volume2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <header className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl neon-bg-cyan flex items-center justify-center">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter neon-text-cyan m-0 leading-none mb-1">
              Neon Snake
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-[0.4em] text-white/40">Retro Strike v2.0</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-6"
        >
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <Volume2 className="w-4 h-4 text-white/40" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Audio Status: Active</span>
            </div>
            <div className="flex gap-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-full ${i < 6 ? 'bg-cyan-500' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        </motion.div>
      </header>

      <main className="relative z-10 w-full max-w-7xl grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Stats/Leaderboard (Empty for now) */}
        <div className="hidden xl:flex xl:col-span-3 flex-col gap-6">
          <div className="glass-morphism rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 mb-4">Mission Intel</h3>
            <ul className="flex flex-col gap-4 text-sm font-mono">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Difficulty</span>
                <span className="neon-text-cyan">Hardcore</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Environment</span>
                <span className="neon-text-pink">Grid-7</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Latency</span>
                <span className="neon-text-lime">12ms</span>
              </li>
            </ul>
          </div>

          <div className="glass-morphism rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 mb-4">How To Play</h3>
            <p className="text-xs text-white/60 leading-relaxed font-mono">
              Navigate the grid to collect energy spikes. Each spike increases your length and velocity. Avoid terminal perimeter impact.
            </p>
          </div>
        </div>

        {/* Center: Snake Game */}
        <div className="xl:col-span-6 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Side: Music Player */}
        <div className="xl:col-span-3">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MusicPlayer />
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 mt-12 py-8 border-t border-white/5 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
          © 2026 Neon Syndicate Labs • Terminal Session Established
        </p>
        <div className="flex gap-6 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Override</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">System Logs</a>
        </div>
      </footer>
    </div>
  );
}
