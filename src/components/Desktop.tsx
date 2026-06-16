'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  User, 
  Briefcase, 
  Award, 
  Mail, 
  Settings, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Clock, 
  ChevronDown, 
  Check, 
  Send,
  Gamepad2,
  LayoutGrid,
  Sparkles,
  CloudLightning,
  Sun,
  CloudRain,
  BookOpen,
  ListTodo
} from 'lucide-react';
import Window from './Window';
import Terminal from './Terminal';
import SnakeGame from './SnakeGame';
import HtopMonitor from './HtopMonitor';
import { toggleMute, getMuteState, playClick, playBeep, playStartup, playNotify } from './sound';

const GithubIconLocal = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIconLocal = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  icon: React.ReactNode;
}

export default function Desktop({ onSwitchToTerminal }: { onSwitchToTerminal: () => void }) {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'terminal', title: 'Terminal Shell', isOpen: true, isMinimized: false, zIndex: 10, icon: <TerminalIcon size={14} /> },
    { id: 'about', title: 'About Me - Ali Sajjad', isOpen: false, isMinimized: false, zIndex: 1, icon: <User size={14} /> },
    { id: 'projects', title: 'Featured Projects', isOpen: false, isMinimized: false, zIndex: 1, icon: <Briefcase size={14} /> },
    { id: 'certifications', title: 'Certifications & Achievements', isOpen: false, isMinimized: false, zIndex: 1, icon: <Award size={14} /> },
    { id: 'contact', title: 'Contact / Let\'s Connect', isOpen: false, isMinimized: false, zIndex: 1, icon: <Mail size={14} /> },
    { id: 'settings', title: 'Desktop Settings', isOpen: false, isMinimized: false, zIndex: 1, icon: <Settings size={14} /> },
    { id: 'snake', title: 'Retro Snake Game', isOpen: false, isMinimized: false, zIndex: 1, icon: <Gamepad2 size={14} /> },
    { id: 'htop', title: 'System Monitor (htop)', isOpen: false, isMinimized: false, zIndex: 1, icon: <Monitor size={14} /> },
  ]);

  const [maxZIndex, setMaxZIndex] = useState(10);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [crtEffect, setCrtEffect] = useState(true);
  const [flickerEffect, setFlickerEffect] = useState(true);
  const [themeColor, setThemeColor] = useState('#00f0ff'); // modern cyan default
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [widgetsOpen, setWidgetsOpen] = useState(false);
  const [wallpaperStyle, setWallpaperStyle] = useState<'cyber-nebula' | 'tech-matrix' | 'deep-ocean' | 'minimal-dark'>('cyber-nebula');
  
  // Right-click context menu
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  });

  // Dock items hover tooltip state
  const [hoveredDockId, setHoveredDockId] = useState<string | null>(null);

  // Form states for contact window
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSending, setFormSending] = useState(false);

  // Custom checklist state for widgets
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review Ali Sajjad\'s projects', checked: true },
    { id: 2, text: 'Execute ranger CLI explorer', checked: false },
    { id: 3, text: 'Explore deep-ocean wallpaper theme', checked: false },
    { id: 4, text: 'Connect on LinkedIn', checked: false }
  ]);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cpuGaugeRef = useRef<HTMLCanvasElement | null>(null);
  const ramGaugeRef = useRef<HTMLCanvasElement | null>(null);

  // Sync clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    setIsMuted(getMuteState());
    
    // Play desktop startup tone
    playStartup();

    return () => clearInterval(interval);
  }, []);

  // Wallpaper interactive canvas backdrop particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles array
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    // Mouse interactive
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Particle network
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node
        ctx.fillStyle = themeColor + '60';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = themeColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== -1000) {
          const mouseDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (mouseDist < 180) {
            const alpha = (1 - mouseDist / 180) * 0.25;
            ctx.strokeStyle = themeColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeColor]);

  // Widget panel CPU/RAM Gauges loop
  useEffect(() => {
    if (!widgetsOpen) return;

    let frameId: number;
    let cpuVal = 12;
    let ramVal = 42;

    const drawGauge = (canvas: HTMLCanvasElement, value: number, label: string, color: string) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const size = canvas.width;
      const center = size / 2;
      const radius = center - 12;

      ctx.clearRect(0, 0, size, size);

      // Track arc
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(center, center, radius, 0.75 * Math.PI, 2.25 * Math.PI);
      ctx.stroke();

      // Colored value arc
      ctx.strokeStyle = color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(
        center,
        center,
        radius,
        0.75 * Math.PI,
        (0.75 + (1.5 * value) / 100) * Math.PI
      );
      ctx.stroke();

      // Clear shadows for text
      ctx.shadowBlur = 0;

      // Label & Value percentage text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(value)}%`, center, center - 2);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(label, center, center + 14);
    };

    const updateGauges = () => {
      // Simulate resource flux
      cpuVal += (Math.random() - 0.5) * 5;
      if (cpuVal < 5) cpuVal = 5;
      if (cpuVal > 85) cpuVal = 85;

      ramVal += (Math.random() - 0.5) * 1;
      if (ramVal < 35) ramVal = 35;
      if (ramVal > 65) ramVal = 65;

      if (cpuGaugeRef.current) drawGauge(cpuGaugeRef.current, cpuVal, 'CPU LOAD', themeColor);
      if (ramGaugeRef.current) drawGauge(ramGaugeRef.current, ramVal, 'RAM USED', themeColor);

      setTimeout(() => {
        frameId = requestAnimationFrame(updateGauges);
      }, 300);
    };

    updateGauges();
    return () => cancelAnimationFrame(frameId);
  }, [widgetsOpen, themeColor]);

  const focusWindow = (id: string) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w)
    );
  };

  const openWindow = (id: string) => {
    playClick('enter');
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false } : w)
    );
    focusWindow(id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, isOpen: false } : w)
    );
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, isMinimized: true } : w)
    );
  };

  const handleToggleMute = () => {
    const newState = toggleMute();
    setIsMuted(newState);
    playClick('default');
  };

  // Close context menu helper
  useEffect(() => {
    const closeAllPopups = () => {
      setContextMenu(prev => prev.visible ? { ...prev, visible: false } : prev);
    };
    window.addEventListener('click', closeAllPopups);
    return () => window.removeEventListener('click', closeAllPopups);
  }, []);

  // Desktop right-click context menu handler
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    playClick('default');
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Contact form submission simulator
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      playBeep();
      return;
    }
    playClick('enter');
    setFormSending(true);
    setTimeout(() => {
      setFormSending(false);
      setFormSubmitted(true);
      setEmail('');
      setMessage('');
      playNotify();
      setTimeout(() => setFormSubmitted(false), 5000);
    }, 1500);
  };

  // Window cascade offsets
  const getWindowOffset = (id: string) => {
    const order = ['terminal', 'about', 'projects', 'certifications', 'contact', 'settings', 'snake', 'htop'];
    const idx = order.indexOf(id);
    return {
      x: 60 + idx * 30,
      y: 50 + idx * 25
    };
  };

  // Minimize all windows helper
  const handleMinimizeAll = () => {
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
  };

  // Cycle wallpapers
  const cycleWallpaper = () => {
    const styles: Array<'cyber-nebula' | 'tech-matrix' | 'deep-ocean' | 'minimal-dark'> = [
      'cyber-nebula', 'tech-matrix', 'deep-ocean', 'minimal-dark'
    ];
    const nextIdx = (styles.indexOf(wallpaperStyle) + 1) % styles.length;
    setWallpaperStyle(styles[nextIdx]);
    playNotify();
  };

  // Toggle todo check
  const toggleTodo = (id: number) => {
    playClick('default');
    setTodos(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  return (
    <div 
      onContextMenu={handleDesktopContextMenu}
      className={`relative w-full h-screen overflow-hidden select-none flex flex-col font-sans transition-all duration-300 ${
        crtEffect ? 'crt-screen' : ''
      } ${flickerEffect ? 'crt-flicker' : ''}`}
      style={{
        backgroundColor: 
          wallpaperStyle === 'tech-matrix' ? '#020b05' :
          wallpaperStyle === 'deep-ocean' ? '#031720' :
          wallpaperStyle === 'minimal-dark' ? '#050508' : '#03030b'
      }}
    >
      
      {/* Background Wallpaper gradients */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 filter blur-[1px] z-0 transition-all duration-500"
        style={{ 
          backgroundImage: 
            wallpaperStyle === 'tech-matrix' ? 'radial-gradient(circle at 50% 50%, #062b10 0%, #020a04 100%)' :
            wallpaperStyle === 'deep-ocean' ? 'radial-gradient(circle at 50% 50%, #032d3d 0%, #020e15 100%)' :
            wallpaperStyle === 'minimal-dark' ? 'radial-gradient(circle at 50% 50%, #111116 0%, #030304 100%)' :
            'radial-gradient(circle at 50% 50%, #1e123a 0%, #03030b 100%)'
        }}
      />
      
      {/* Ambient Floating Blobs (only in Nebula/Ocean wallpaper styles) */}
      {['cyber-nebula', 'deep-ocean'].includes(wallpaperStyle) && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="blob blob-purple" style={{ background: wallpaperStyle === 'deep-ocean' ? 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)' : undefined }} />
          <div className="blob blob-cyan" style={{ background: wallpaperStyle === 'deep-ocean' ? 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)' : undefined }} />
          <div className="blob blob-magenta" style={{ display: wallpaperStyle === 'deep-ocean' ? 'none' : 'block' }} />
        </div>
      )}
      
      {/* Matrix grid backdrop lines */}
      <div 
        className="absolute inset-0 grid-bg pointer-events-none z-0" 
        style={{ opacity: wallpaperStyle === 'minimal-dark' ? 0.3 : 1 }}
      />

      {/* Interactive Canvas network lines */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none" 
      />

      {/* Top Status Bar */}
      <div className="h-11 bg-[#06060f]/85 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 z-[9998] select-none text-xs text-slate-300">
        <div className="flex items-center gap-4">
          {/* Linux System Icon */}
          <button 
            onClick={() => openWindow('terminal')}
            className="flex items-center gap-1.5 font-bold hover:text-white transition-colors cursor-default"
          >
            <span className="text-sm font-semibold tracking-wider" style={{ color: themeColor }}>AliOS 🐚</span>
          </button>
          
          <button 
            onClick={onSwitchToTerminal}
            className="hover:text-white transition-colors px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px] uppercase tracking-wide cursor-default"
          >
            CLI Mode
          </button>
        </div>

        {/* Live Date/Clock */}
        <div className="flex items-center gap-1.5 font-semibold text-slate-400">
          <Clock size={12} className="opacity-75" />
          <span>{date}</span>
          <span>•</span>
          <span className="text-white">{time}</span>
        </div>

        {/* Quick Settings / Widgets controls */}
        <div className="flex items-center gap-4 relative">
          {/* Dashboard Widgets Panel Button */}
          <button
            onClick={() => { playClick('enter'); setWidgetsOpen(!widgetsOpen); }}
            className={`flex items-center gap-1 hover:text-white transition-colors cursor-default ${widgetsOpen ? 'text-white font-bold' : ''}`}
            title="Toggle Widget Dashboard"
          >
            <LayoutGrid size={14} style={{ color: widgetsOpen ? themeColor : undefined }} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button 
            onClick={handleToggleMute}
            className="hover:text-white transition-colors cursor-default"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} />}
          </button>

          <button 
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-default"
          >
            <Settings size={14} />
            <ChevronDown size={10} />
          </button>

          {/* Quick Settings Dropdown */}
          {settingsOpen && (
            <div className="absolute right-0 top-6 w-48 bg-[#10101f]/95 backdrop-blur-2xl border border-slate-800 rounded-lg p-3 shadow-2xl z-[10000] space-y-3 font-medium text-slate-200">
              <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-2 text-[10px] uppercase tracking-wider">System Toggles</div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs">CRT Scanlines</span>
                <input 
                  type="checkbox" 
                  checked={crtEffect}
                  onChange={(e) => { playClick('default'); setCrtEffect(e.target.checked); }}
                  className="rounded bg-slate-900 border-slate-800 text-green-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs">Monitor Flicker</span>
                <input 
                  type="checkbox" 
                  checked={flickerEffect}
                  onChange={(e) => { playClick('default'); setFlickerEffect(e.target.checked); }}
                  className="rounded bg-slate-900 border-slate-800 text-green-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-xs">Sound Effects</span>
                <input 
                  type="checkbox" 
                  checked={!isMuted}
                  onChange={handleToggleMute}
                  className="rounded bg-slate-900 border-slate-800 text-green-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
              </div>

              <div className="border-t border-slate-800 pt-2 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Desktop Accent</span>
                <div className="flex items-center gap-2 mt-1">
                  {['#4af626', '#ffb000', '#00f0ff', '#bb9af7', '#ec4899', '#ffffff'].map(c => (
                    <button
                      key={c}
                      onClick={() => { playClick('default'); setThemeColor(c); }}
                      className="w-5 h-5 rounded-full border border-slate-900 cursor-pointer flex items-center justify-center transition-all hover:scale-110"
                      style={{ backgroundColor: c }}
                    >
                      {themeColor === c && <Check size={10} className="text-black stroke-[3px]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Workspace Grid (Shortcuts) */}
      <div 
        className="flex-1 p-6 grid grid-flow-col auto-cols-min grid-rows-6 gap-6 relative select-none z-10"
        onClick={() => {
          setSettingsOpen(false);
          setContextMenu(prev => prev.visible ? { ...prev, visible: false } : prev);
        }}
      >
        {/* Terminal Icon */}
        <div 
          onDoubleClick={() => openWindow('terminal')}
          onClick={() => playClick('default')}
          className="w-20 h-20 flex flex-col items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors border border-transparent hover:border-slate-800/40 text-center cursor-default group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-green-400 group-hover:scale-105 transition-transform" style={{ color: themeColor, boxShadow: `0 0 10px -2px ${themeColor}30` }}>
            <TerminalIcon size={24} />
          </div>
          <span className="text-[10px] font-semibold text-slate-300 mt-2 truncate w-full px-1 shadow-sm font-mono">Terminal.sh</span>
        </div>

        {/* About Icon */}
        <div 
          onDoubleClick={() => openWindow('about')}
          onClick={() => playClick('default')}
          className="w-20 h-20 flex flex-col items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors border border-transparent hover:border-slate-800/40 text-center cursor-default group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <User size={24} />
          </div>
          <span className="text-[10px] font-semibold text-slate-300 mt-2 truncate w-full px-1 shadow-sm font-mono">About_Me.txt</span>
        </div>

        {/* Projects Icon */}
        <div 
          onDoubleClick={() => openWindow('projects')}
          onClick={() => playClick('default')}
          className="w-20 h-20 flex flex-col items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors border border-transparent hover:border-slate-800/40 text-center cursor-default group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
            <Briefcase size={24} />
          </div>
          <span className="text-[10px] font-semibold text-slate-300 mt-2 truncate w-full px-1 shadow-sm font-mono">Projects.json</span>
        </div>

        {/* Certifications Icon */}
        <div 
          onDoubleClick={() => openWindow('certifications')}
          onClick={() => playClick('default')}
          className="w-20 h-20 flex flex-col items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors border border-transparent hover:border-slate-800/40 text-center cursor-default group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-yellow-500 group-hover:scale-105 transition-transform">
            <Award size={24} />
          </div>
          <span className="text-[10px] font-semibold text-slate-300 mt-2 truncate w-full px-1 shadow-sm font-mono">Certificates.txt</span>
        </div>

        {/* Contact Icon */}
        <div 
          onDoubleClick={() => openWindow('contact')}
          onClick={() => playClick('default')}
          className="w-20 h-20 flex flex-col items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors border border-transparent hover:border-slate-800/40 text-center cursor-default group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
            <Mail size={24} />
          </div>
          <span className="text-[10px] font-semibold text-slate-300 mt-2 truncate w-full px-1 shadow-sm font-mono">Contact.cfg</span>
        </div>

        {/* Settings Icon */}
        <div 
          onDoubleClick={() => openWindow('settings')}
          onClick={() => playClick('default')}
          className="w-20 h-20 flex flex-col items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors border border-transparent hover:border-slate-800/40 text-center cursor-default group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
            <Settings size={24} />
          </div>
          <span className="text-[10px] font-semibold text-slate-300 mt-2 truncate w-full px-1 shadow-sm font-mono">Settings.desktop</span>
        </div>

        {/* Snake Game Icon */}
        <div 
          onDoubleClick={() => openWindow('snake')}
          onClick={() => playClick('default')}
          className="w-20 h-20 flex flex-col items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors border border-transparent hover:border-slate-800/40 text-center cursor-default group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform">
            <Gamepad2 size={24} />
          </div>
          <span className="text-[10px] font-semibold text-slate-300 mt-2 truncate w-full px-1 shadow-sm font-mono">Snake.sh</span>
        </div>

        {/* System Monitor Icon */}
        <div 
          onDoubleClick={() => openWindow('htop')}
          onClick={() => playClick('default')}
          className="w-20 h-20 flex flex-col items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors border border-transparent hover:border-slate-800/40 text-center cursor-default group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform" style={{ color: themeColor, boxShadow: `0 0 10px -2px ${themeColor}30` }}>
            <Monitor size={24} />
          </div>
          <span className="text-[10px] font-semibold text-slate-300 mt-2 truncate w-full px-1 shadow-sm font-mono">htop.desktop</span>
        </div>
      </div>

      {/* --- WINDOW MANAGER --- */}
      
      {/* 1. Terminal Window */}
      <Window
        id="terminal"
        title="Terminal Shell Emulator"
        isOpen={windows.find(w => w.id === 'terminal')?.isOpen ?? false}
        onClose={() => closeWindow('terminal')}
        onMinimize={() => minimizeWindow('terminal')}
        onFocus={() => focusWindow('terminal')}
        zIndex={windows.find(w => w.id === 'terminal')?.zIndex ?? 1}
        initialX={getWindowOffset('terminal').x}
        initialY={getWindowOffset('terminal').y}
        initialWidth={700}
        initialHeight={460}
        themeColor={themeColor}
        icon={<TerminalIcon size={14} style={{ color: themeColor }} />}
      >
        <Terminal 
          isEmbedded={true} 
          onSwitchToGui={() => {}} 
          terminalTheme={themeColor}
          setTerminalTheme={setThemeColor}
        />
      </Window>

      {/* 2. About Me Window */}
      <Window
        id="about"
        title="About Me - Syed Mohammad Ali Sajjad"
        isOpen={windows.find(w => w.id === 'about')?.isOpen ?? false}
        onClose={() => closeWindow('about')}
        onMinimize={() => minimizeWindow('about')}
        onFocus={() => focusWindow('about')}
        zIndex={windows.find(w => w.id === 'about')?.zIndex ?? 1}
        initialX={getWindowOffset('about').x}
        initialY={getWindowOffset('about').y}
        initialWidth={720}
        initialHeight={480}
        themeColor={themeColor}
        icon={<User size={14} className="text-blue-400" />}
      >
        <div className="grid md:grid-cols-3 gap-6 font-mono text-xs leading-relaxed">
          {/* Portrait Sidebar */}
          <div className="flex flex-col items-center text-center space-y-4 md:border-r border-slate-800 md:pr-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
              <img 
                src="/image.jpg" 
                alt="Portrait of Syed" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300";
                }}
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">Ali Sajjad</h3>
              <p className="text-[10px] text-slate-400">Software Engineer</p>
              <p className="text-[10px] text-green-400 font-bold" style={{ color: themeColor }}>Flutter & Backend Developer</p>
            </div>
            <div className="flex gap-4 pt-2">
              <a href="https://github.com/alisyed19615-maker" target="_blank" className="text-slate-400 hover:text-white transition-colors">
                <GithubIconLocal size={16} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <LinkedinIconLocal size={16} />
              </a>
            </div>
          </div>

          {/* About Text details */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Bio</span>
              <p className="text-slate-300 mt-1">
                I am a full stack software developer centered around writing cleaner, modular codebases. My approach to software architecture highlights automated containerization with **Docker** and continuous integration using **CI/CD pipelines**. I work actively on creating user-centric mobile layouts and scalable server solutions.
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Core Strengths</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 bg-slate-900/60 border border-slate-800 rounded">
                  <span className="text-blue-400 font-bold text-xs">⚡ Flutter Mastery</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">High-fidelity cross platform app development.</p>
                </div>
                <div className="p-2 bg-slate-900/60 border border-slate-800 rounded">
                  <span className="text-purple-400 font-bold text-xs">📦 Docker / DevOps</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Automated scripts, deployment architectures.</p>
                </div>
                <div className="p-2 bg-slate-900/60 border border-slate-800 rounded">
                  <span className="text-yellow-400 font-bold text-xs">🐍 Python Backend</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Robust Django / Flask API design.</p>
                </div>
                <div className="p-2 bg-slate-900/60 border border-slate-800 rounded">
                  <span className="text-green-400 font-bold text-xs" style={{ color: themeColor }}>☕ Java & OOP</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Object-oriented application programming.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Tech Stack Toolkit</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Flutter', 'Django', 'Flask', 'Docker', 'Java', 'Next.js', 'PostgreSQL', 'SQLite', 'Firebase', 'CI/CD', 'Git'].map(s => (
                  <span key={s} className="px-2 py-0.5 text-[9px] font-bold bg-[#11111b] border border-slate-800 rounded-full text-slate-400">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Window>

      {/* 3. Projects Window */}
      <Window
        id="projects"
        title="Featured Projects"
        isOpen={windows.find(w => w.id === 'projects')?.isOpen ?? false}
        onClose={() => closeWindow('projects')}
        onMinimize={() => minimizeWindow('projects')}
        onFocus={() => focusWindow('projects')}
        zIndex={windows.find(w => w.id === 'projects')?.zIndex ?? 1}
        initialX={getWindowOffset('projects').x}
        initialY={getWindowOffset('projects').y}
        initialWidth={760}
        initialHeight={540}
        themeColor={themeColor}
        icon={<Briefcase size={14} className="text-purple-400" />}
      >
        <div className="space-y-6 font-mono text-xs">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm">Directory: /home/sajjad/projects</h3>
            <p className="text-[10px] text-slate-400">Double-click or open any link to view details.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Project 1 */}
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col justify-between hover:border-slate-700/60 transition-colors">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-xs">Medical AI NLP</h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900">Python</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  AI-powered Natural Language Processing app tailored for medical context text classification.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Live on Render</span>
                <a 
                  href="https://medical-ai-nlp.onrender.com" 
                  target="_blank" 
                  className="underline hover:text-white"
                  style={{ color: themeColor }}
                >
                  Launch App ↗
                </a>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col justify-between hover:border-slate-700/60 transition-colors">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-xs">TerraCensus</h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-950 text-yellow-400 border border-yellow-900">React</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Trajectory modeling and interactive distribution maps for species populations.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Live on Vercel</span>
                <a 
                  href="https://species-population-analyzer.vercel.app/index.html" 
                  target="_blank" 
                  className="underline hover:text-white"
                  style={{ color: themeColor }}
                >
                  Launch App ↗
                </a>
              </div>
            </div>

            {/* Project 4 */}
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col justify-between hover:border-slate-700/60 transition-colors">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-xs">Interactive Portfolio</h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-950 text-green-400 border border-green-900" style={{ color: themeColor, borderColor: `${themeColor}40` }}>Next.js</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  This exact site - a responsive simulated Linux operating system and shell environment.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Workspace Root</span>
                <span className="text-slate-500">Completed 🚀</span>
              </div>
            </div>

            {/* Project 5 — Lumina */}
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col justify-between hover:border-slate-700/60 transition-colors">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-xs">Lumina — AI Expense Tracker</h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-900">React/Vite</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  AI-powered personal finance tracker with smart categorization, insights, and budget management.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Live on Vercel</span>
                <a
                  href="https://expence-tracker-lumina.vercel.app/login"
                  target="_blank"
                  className="underline hover:text-white"
                  style={{ color: themeColor }}
                >
                  Launch App ↗
                </a>
              </div>
            </div>

            {/* Project 6 — EqualOom */}
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex flex-col justify-between hover:border-slate-700/60 transition-colors">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-xs">EqualOom — AI Equity Tool</h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-950 text-pink-400 border border-pink-900">AI / React</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  AI-powered equity analysis platform providing data-driven insights for fair compensation decisions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Live on Vercel</span>
                <a
                  href="https://equaloom.vercel.app/"
                  target="_blank"
                  className="underline hover:text-white"
                  style={{ color: themeColor }}
                >
                  Launch App ↗
                </a>
              </div>
            </div>

          </div>
        </div>
      </Window>

      {/* 4. Certifications Window */}
      <Window
        id="certifications"
        title="Certifications & Qualifications"
        isOpen={windows.find(w => w.id === 'certifications')?.isOpen ?? false}
        onClose={() => closeWindow('certifications')}
        onMinimize={() => minimizeWindow('certifications')}
        onFocus={() => focusWindow('certifications')}
        zIndex={windows.find(w => w.id === 'certifications')?.zIndex ?? 1}
        initialX={getWindowOffset('certifications').x}
        initialY={getWindowOffset('certifications').y}
        initialWidth={600}
        initialHeight={400}
        themeColor={themeColor}
        icon={<Award size={14} className="text-yellow-400" />}
      >
        <div className="space-y-4 font-mono text-xs leading-relaxed">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Academic & Professional Credentials</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-500 mt-0.5">🏆</span>
              <div>
                <h4 className="font-bold text-white">Python for Everybody Specialization</h4>
                <p className="text-[10px] text-slate-400">Coursera • University of Michigan</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-yellow-500 mt-0.5">🏆</span>
              <div>
                <h4 className="font-bold text-white">Docker Certified Associate (DCA)</h4>
                <p className="text-[10px] text-slate-400">Docker Inc.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-yellow-500 mt-0.5">🏆</span>
              <div>
                <h4 className="font-bold text-white">Associate Cloud Engineer</h4>
                <p className="text-[10px] text-slate-400">Google Cloud Platform</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-yellow-500 mt-0.5">🏆</span>
              <div>
                <h4 className="font-bold text-white">Django for Everybody Specialization</h4>
                <p className="text-[10px] text-slate-400">Coursera</p>
              </div>
            </div>
          </div>
        </div>
      </Window>

      {/* 5. Contact Window */}
      <Window
        id="contact"
        title="Send a Message"
        isOpen={windows.find(w => w.id === 'contact')?.isOpen ?? false}
        onClose={() => closeWindow('contact')}
        onMinimize={() => minimizeWindow('contact')}
        onFocus={() => focusWindow('contact')}
        zIndex={windows.find(w => w.id === 'contact')?.zIndex ?? 1}
        initialX={getWindowOffset('contact').x}
        initialY={getWindowOffset('contact').y}
        initialWidth={560}
        initialHeight={420}
        themeColor={themeColor}
        icon={<Mail size={14} className="text-red-400" />}
      >
        <div className="font-mono text-xs leading-relaxed space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm">Contact.cfg</h3>
            <p className="text-[10px] text-slate-400">Send an instant email or connect via socials.</p>
          </div>

          {formSubmitted ? (
            <div className="p-6 bg-green-950/20 border border-green-800/50 rounded-lg text-center space-y-2">
              <span className="text-2xl">🎉</span>
              <h4 className="font-bold text-white">Message Transmitted!</h4>
              <p className="text-[10px] text-slate-400">
                Connection established. Ali Sajjad will respond to your packet shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Your Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white text-[10px] outline-none focus:border-slate-700 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Your Message</label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message packet here..."
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white text-[10px] outline-none focus:border-slate-700 font-mono resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={formSending}
                className="w-full py-2 bg-slate-800 border border-slate-700 rounded text-white text-[10px] font-semibold hover:bg-slate-700 active:bg-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {formSending ? (
                  <>Transmitting...</>
                ) : (
                  <>
                    <Send size={11} />
                    <span>Transmit Message</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-800/80 text-[10px] space-y-1">
            <span className="text-slate-500 font-bold uppercase tracking-wider block">Social Hub</span>
            <div className="flex gap-4">
              <a href="mailto:alisyed19615@gmail.com" className="underline hover:text-white" style={{ color: themeColor }}>alisyed19615@gmail.com</a>
              <a href="https://github.com/alisyed19615-maker" target="_blank" className="underline text-blue-400 hover:text-blue-300">GitHub</a>
            </div>
          </div>
        </div>
      </Window>

      {/* 6. Settings Window */}
      <Window
        id="settings"
        title="Settings Manager"
        isOpen={windows.find(w => w.id === 'settings')?.isOpen ?? false}
        onClose={() => closeWindow('settings')}
        onMinimize={() => minimizeWindow('settings')}
        onFocus={() => focusWindow('settings')}
        zIndex={windows.find(w => w.id === 'settings')?.zIndex ?? 1}
        initialX={getWindowOffset('settings').x}
        initialY={getWindowOffset('settings').y}
        initialWidth={480}
        initialHeight={360}
        themeColor={themeColor}
        icon={<Settings size={14} className="text-slate-400" />}
      >
        <div className="font-mono text-xs leading-relaxed space-y-4">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">AliOS Control Panel</h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-300 text-xs">CRT Overlay</span>
                <p className="text-[9px] text-slate-500">Toggles the retro scanline tube monitor filter.</p>
              </div>
              <button 
                onClick={() => { playClick('default'); setCrtEffect(!crtEffect); }}
                className={`w-12 py-1 rounded text-center text-[10px] font-semibold cursor-pointer transition-colors ${
                  crtEffect ? 'bg-green-600/20 border border-green-800 text-green-400' : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                {crtEffect ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-300 text-xs">Screen Flicker</span>
                <p className="text-[9px] text-slate-500">Toggles subtle CRT phosphor brightness flicker.</p>
              </div>
              <button 
                onClick={() => { playClick('default'); setFlickerEffect(!flickerEffect); }}
                className={`w-12 py-1 rounded text-center text-[10px] font-semibold cursor-pointer transition-colors ${
                  flickerEffect ? 'bg-green-600/20 border border-green-800 text-green-400' : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                {flickerEffect ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-300 text-xs">WebAudio Chimes</span>
                <p className="text-[9px] text-slate-500">Synthesize keyboard keystrokes and alerts.</p>
              </div>
              <button 
                onClick={handleToggleMute}
                className={`w-12 py-1 rounded text-center text-[10px] font-semibold cursor-pointer transition-colors ${
                  !isMuted ? 'bg-green-600/20 border border-green-800 text-green-400' : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                {!isMuted ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </Window>

      {/* 7. Snake Game Window */}
      <Window
        id="snake"
        title="Retro Snake Game"
        isOpen={windows.find(w => w.id === 'snake')?.isOpen ?? false}
        onClose={() => closeWindow('snake')}
        onMinimize={() => minimizeWindow('snake')}
        onFocus={() => focusWindow('snake')}
        zIndex={windows.find(w => w.id === 'snake')?.zIndex ?? 1}
        initialX={getWindowOffset('snake').x}
        initialY={getWindowOffset('snake').y}
        initialWidth={460}
        initialHeight={380}
        themeColor={themeColor}
        icon={<Gamepad2 size={14} className="text-red-500" />}
      >
        <SnakeGame onExit={() => closeWindow('snake')} terminalTheme={themeColor} />
      </Window>

      {/* 8. System Monitor Window */}
      <Window
        id="htop"
        title="System Monitor (htop)"
        isOpen={windows.find(w => w.id === 'htop')?.isOpen ?? false}
        onClose={() => closeWindow('htop')}
        onMinimize={() => minimizeWindow('htop')}
        onFocus={() => focusWindow('htop')}
        zIndex={windows.find(w => w.id === 'htop')?.zIndex ?? 1}
        initialX={getWindowOffset('htop').x}
        initialY={getWindowOffset('htop').y}
        initialWidth={680}
        initialHeight={420}
        themeColor={themeColor}
        icon={<Monitor size={14} style={{ color: themeColor }} />}
      >
        <HtopMonitor onExit={() => closeWindow('htop')} terminalTheme={themeColor} />
      </Window>

      {/* --- DASHBOARD SLIDING WIDGET PANEL --- */}
      <div 
        className={`fixed top-11 right-0 h-[calc(100vh-44px)] w-80 widget-panel-glass z-[9997] transition-all duration-300 ease-in-out p-5 overflow-y-auto no-scrollbar flex flex-col gap-6 text-slate-200 border-l border-white/5 ${
          widgetsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="font-bold text-sm tracking-wider flex items-center gap-1.5" style={{ color: themeColor }}>
            <Sparkles size={14} /> SYSTEM DASHBOARD
          </span>
          <button 
            onClick={() => setWidgetsOpen(false)}
            className="text-[10px] text-slate-500 hover:text-white uppercase font-semibold border border-slate-800 hover:border-slate-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

        {/* 1. CPU/RAM Gauge dials widget */}
        <div className="space-y-3">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Monitor size={11} /> Performance Resource Meters
          </div>
          <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <div className="flex flex-col items-center">
              <canvas ref={cpuGaugeRef} width={80} height={80} className="w-20 h-20" />
            </div>
            <div className="flex flex-col items-center">
              <canvas ref={ramGaugeRef} width={80} height={80} className="w-20 h-20" />
            </div>
          </div>
        </div>

        {/* 2. Weather Widget */}
        <div className="space-y-3">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <CloudLightning size={11} /> Micro Weather Station
          </div>
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-white">Neo-Tokyo Region</h4>
                <p className="text-[9px] text-slate-400">Simulated weather logs</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold" style={{ color: themeColor }}>+18°C</span>
                <p className="text-[8px] text-slate-500">Scanline Drizzle</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
              <CloudRain size={14} className="text-cyan-400 shrink-0" />
              <span>Digital particles: 1010 lines/min. High humidity index.</span>
            </div>
          </div>
        </div>

        {/* 3. Tech Quote Widget */}
        <div className="space-y-3">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <BookOpen size={11} /> Tech Wisdom packet
          </div>
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 text-[10px] leading-relaxed italic text-slate-300 relative">
            <span className="absolute top-1 left-2 text-2xl text-slate-800 font-serif leading-none">“</span>
            <p className="pl-4">
              Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make things worse: complexity sells better.
            </p>
            <p className="text-right text-slate-500 mt-2 font-bold not-italic">— Edsger W. Dijkstra</p>
          </div>
        </div>

        {/* 4. Agenda Widget */}
        <div className="space-y-3 flex-1 flex flex-col justify-end">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <ListTodo size={11} /> Portfolio Checklist
          </div>
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-2 text-[10px]">
            {todos.map(todo => (
              <div 
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                  todo.checked ? 'border-transparent text-black' : 'border-slate-700'
                }`} style={{ backgroundColor: todo.checked ? themeColor : undefined }}>
                  {todo.checked && <Check size={10} className="stroke-[3px]" />}
                </div>
                <span className={todo.checked ? 'line-through text-slate-500' : 'text-slate-300'}>
                  {todo.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT-CLICK CUSTOM CONTEXT MENU --- */}
      {contextMenu.visible && (
        <div 
          className="fixed context-menu-glass rounded-lg py-1.5 w-44 z-[10001] flex flex-col font-mono text-[10px] text-slate-300 border border-white/10"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => { openWindow('terminal'); setContextMenu({ ...contextMenu, visible: false }); }}
            className="px-3 py-1.5 text-left hover:bg-slate-800/60 hover:text-white transition-colors flex items-center gap-2 cursor-default"
          >
            🐚 Open Terminal Here
          </button>
          <button 
            onClick={() => { openWindow('htop'); setContextMenu({ ...contextMenu, visible: false }); }}
            className="px-3 py-1.5 text-left hover:bg-slate-800/60 hover:text-white transition-colors flex items-center gap-2 cursor-default"
          >
            🖥️ Launch htop Monitor
          </button>
          <button 
            onClick={() => { openWindow('snake'); setContextMenu({ ...contextMenu, visible: false }); }}
            className="px-3 py-1.5 text-left hover:bg-slate-800/60 hover:text-white transition-colors flex items-center gap-2 cursor-default"
          >
            🎮 Start Snake Game
          </button>
          <div className="h-px bg-slate-800 my-1" />
          <button 
            onClick={() => { cycleWallpaper(); setContextMenu({ ...contextMenu, visible: false }); }}
            className="px-3 py-1.5 text-left hover:bg-slate-800/60 hover:text-white transition-colors flex items-center gap-2 cursor-default"
          >
            🌌 Cycle Backdrop Style
          </button>
          <button 
            onClick={() => { handleToggleMute(); setContextMenu({ ...contextMenu, visible: false }); }}
            className="px-3 py-1.5 text-left hover:bg-slate-800/60 hover:text-white transition-colors flex items-center gap-2 cursor-default"
          >
            {isMuted ? '🔊 Unmute Audio' : '🔇 Mute Audio'}
          </button>
          <div className="h-px bg-slate-800 my-1" />
          <button 
            onClick={() => { handleMinimizeAll(); setContextMenu({ ...contextMenu, visible: false }); }}
            className="px-3 py-1.5 text-left hover:bg-slate-800/60 hover:text-white transition-colors flex items-center gap-2 cursor-default"
          >
            🧹 Clear Workspace
          </button>
        </div>
      )}

      {/* --- DOCK / TASKBAR --- */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#0c0c16]/80 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-3xl z-[9999] shadow-2xl flex items-center gap-4 select-none" style={{ boxShadow: `0 15px 40px -15px ${themeColor}20` }}>
        {windows.map(w => {
          const isRunning = w.isOpen;
          const isFocused = isRunning && !w.isMinimized && w.zIndex === maxZIndex;

          return (
            <div 
              key={w.id} 
              className="relative"
              onMouseEnter={() => setHoveredDockId(w.id)}
              onMouseLeave={() => setHoveredDockId(null)}
            >
              {/* Modern Hover Tooltip */}
              {hoveredDockId === w.id && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800/80 px-2 py-0.5 rounded text-[8px] font-mono text-slate-300 font-bold whitespace-nowrap z-[10002] transition-opacity">
                  {w.title}
                </div>
              )}

              <button
                onClick={() => {
                  if (w.isOpen) {
                    if (w.isMinimized || !isFocused) {
                      focusWindow(w.id);
                    } else {
                      minimizeWindow(w.id);
                    }
                  } else {
                    openWindow(w.id);
                  }
                }}
                className="relative p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/40 hover:bg-slate-800/60 active:scale-95 transition-all text-slate-300 hover:text-white cursor-default group"
              >
                <div 
                  className="transition-transform group-hover:scale-110"
                  style={{ color: w.id === 'terminal' ? themeColor : undefined }}
                >
                  {w.id === 'terminal' && <TerminalIcon size={18} />}
                  {w.id === 'about' && <User size={18} className="text-blue-400" />}
                  {w.id === 'projects' && <Briefcase size={18} className="text-purple-400" />}
                  {w.id === 'certifications' && <Award size={18} className="text-yellow-500" />}
                  {w.id === 'contact' && <Mail size={18} className="text-red-400" />}
                  {w.id === 'settings' && <Settings size={18} className="text-slate-400" />}
                  {w.id === 'snake' && <Gamepad2 size={18} className="text-red-500" />}
                  {w.id === 'htop' && <Monitor size={18} className="text-cyan-400" style={{ color: themeColor }} />}
                </div>

                {/* Running indicator dots */}
                {isRunning && (
                  <span 
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      isFocused ? 'bg-white' : 'bg-slate-500'
                    } ${isFocused ? 'dock-pulse-dot' : ''}`}
                    style={{ backgroundColor: isFocused ? themeColor : undefined }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
