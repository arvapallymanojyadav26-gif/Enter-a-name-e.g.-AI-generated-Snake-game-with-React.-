import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, ListMusic, Music2 } from 'lucide-react';

type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  color: string;
};

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyberfunk City',
    artist: 'AI Virtuoso',
    url: 'https://cdn.pixabay.com/audio/2021/11/23/audio_0c93a0d5c0.mp3',
    color: 'cyan'
  },
  {
    id: '2',
    title: 'Neon Nightride',
    artist: 'Digital Dreamer',
    url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_1399478e1b.mp3',
    color: 'pink'
  },
  {
    id: '3',
    title: 'Synth Orbit',
    artist: 'Electronic Soul',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c36399088a.mp3',
    color: 'lime'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div className="glass-morphism rounded-3xl p-6 relative overflow-hidden">
        {/* Animated Background Glow */}
        <div 
          className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-30 transition-colors duration-1000 ${
            currentTrack.color === 'cyan' ? 'bg-cyan-500' : 
            currentTrack.color === 'pink' ? 'bg-pink-500' : 'bg-lime-500'
          }`}
        />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-mono">Now Playing</span>
              <h3 className={`text-xl font-black tracking-tight ${
                currentTrack.color === 'cyan' ? 'neon-text-cyan' : 
                currentTrack.color === 'pink' ? 'neon-text-pink' : 'neon-text-lime'
              }`}>
                {currentTrack.title}
              </h3>
              <p className="text-white/60 text-sm font-mono uppercase tracking-wider">{currentTrack.artist}</p>
            </div>
            <button 
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ListMusic className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Simple Visualizer */}
          <div className="h-16 flex items-center justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlaying ? [10, 40, 20, 50, 15] : 4,
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
                className={`w-1 rounded-full ${
                  currentTrack.color === 'cyan' ? 'bg-cyan-500/60' : 
                  currentTrack.color === 'pink' ? 'bg-pink-500/60' : 'bg-lime-500/60'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  currentTrack.color === 'cyan' ? 'bg-cyan-500' : 
                  currentTrack.color === 'pink' ? 'bg-pink-500' : 'bg-lime-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            <button onClick={skipBackward} className="text-white/70 hover:text-white transition-colors">
              <SkipBack className="w-6 h-6" />
            </button>
            <button 
              onClick={togglePlay}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                currentTrack.color === 'cyan' ? 'neon-bg-cyan' : 
                currentTrack.color === 'pink' ? 'neon-bg-pink' : 'neon-bg-lime'
              } bg-opacity-100`}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-black text-black" /> : <Play className="w-6 h-6 fill-black text-black ml-1" />}
            </button>
            <button onClick={skipForward} className="text-white/70 hover:text-white transition-colors">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Playlist Overlay */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '100%', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute inset-0 z-20 glass-morphism p-6 overflow-y-auto pt-16"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-mono uppercase tracking-[0.3em] text-white/50">Playlist</h4>
                <button 
                  onClick={() => setShowPlaylist(false)}
                  className="text-xs font-mono uppercase tracking-widest text-white/30 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {TRACKS.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(idx)}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                      currentTrackIndex === idx ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      track.color === 'cyan' ? 'bg-cyan-500/20' : 
                      track.color === 'pink' ? 'bg-pink-500/20' : 'bg-lime-500/20'
                    }`}>
                      <Music2 className={`w-5 h-5 ${
                        track.color === 'cyan' ? 'text-cyan-400' : 
                        track.color === 'pink' ? 'text-pink-400' : 'text-lime-400'
                      }`} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`text-sm font-bold ${currentTrackIndex === idx ? 'text-white' : 'text-white/70'}`}>
                        {track.title}
                      </span>
                      <span className="text-[10px] text-white/40 uppercase font-mono">{track.artist}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
