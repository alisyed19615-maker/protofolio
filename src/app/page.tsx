'use client';

import React, { useState, useEffect } from 'react';
import Desktop from '@/components/Desktop';
import MobileDesktop from '@/components/MobileDesktop';
import Terminal from '@/components/Terminal';

type Mode = 'boot' | 'gui' | 'cli';

const BOOT_LINES = [
  { text: 'AliOS Linux v2026.06 — Kernel 5.15.0-ali-generic', delay: 0 },
  { text: '[  OK  ] Started D-Bus System Message Bus.', delay: 200 },
  { text: '[  OK  ] Reached target System Initialization.', delay: 380 },
  { text: '[  OK  ] Reached target Basic System.', delay: 540 },
  { text: 'Loading network interfaces... eth0 [OK]', delay: 700 },
  { text: '[  OK  ] Started OpenSSH Server Daemon.', delay: 860 },
  { text: 'Mounting virtual file systems...          [ OK ]', delay: 1000 },
  { text: 'Starting Docker Engine Daemon...          [ OK ]', delay: 1150 },
  { text: '[  OK  ] Reached target Multi-User System.', delay: 1300 },
  { text: 'Starting Display Manager (AliOS-GUI)...', delay: 1460 },
  { text: '[  OK  ] AliOS Desktop Environment loaded successfully.', delay: 1620, highlight: true },
];

export default function Home() {
  const [mode, setMode]               = useState<Mode>('boot');
  const [bootLines, setBootLines]     = useState<typeof BOOT_LINES>([]);
  const [bootDone, setBootDone]       = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [terminalTheme, setTerminalTheme] = useState('#00f0ff');

  // Detect mobile on client
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Boot sequence
  useEffect(() => {
    if (mode !== 'boot') return;
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setBootLines(prev => [...prev, line]);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => {
            setBootDone(true);
            setTimeout(() => setMode('gui'), 700);
          }, 500);
        }
      }, line.delay);
    });
  }, []);

  /* ─── BOOT SCREEN ─── */
  if (mode === 'boot') {
    return (
      <div style={{
        background: '#000', width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start',
        padding: isMobile ? '32px 24px' : '48px 64px',
        fontFamily: 'monospace', fontSize: isMobile ? 11 : 13,
        color: '#d4d4d4', overflow: 'hidden',
      }}>
        {/* ASCII Logo */}
        <pre style={{
          color: '#00f0ff', fontSize: isMobile ? 9 : 11, lineHeight: 1.2,
          marginBottom: isMobile ? 20 : 32, opacity: 0.85,
          textShadow: '0 0 10px rgba(0,240,255,0.5)',
        }}>
{`   ___    ___   ____  ___  
  / _ |  / (_) / __ \\/ __  
 / __ | / / / / /_/ /\\ \\   
/_/ |_|/_/_/ /\\____/___/   
  — AliOS Linux Portfolio —`}
        </pre>

        {/* Boot lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 4 : 6, width: '100%', maxWidth: 640 }}>
          {bootLines.map((line, i) => (
            <div key={i} style={{ animation: 'fadeSlideIn 0.15s ease-out forwards', opacity: 0 }}>
              {line.highlight
                ? <span style={{ color: '#4af626', textShadow: '0 0 8px #4af62680' }}>{line.text}</span>
                : <span style={{ color: i === bootLines.length - 1 && !bootDone ? '#fff' : '#6b7280' }}>{line.text}</span>
              }
            </div>
          ))}
        </div>

        {bootDone && (
          <div style={{ marginTop: 20, color: '#00f0ff', fontSize: isMobile ? 12 : 13, fontWeight: 700,
            animation: 'fadeSlideIn 0.4s ease-out forwards', opacity: 0 }}>
            ▶ Launching AliOS{isMobile ? ' Mobile' : ' Desktop'}...
          </div>
        )}

        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateX(-6px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  /* ─── CLI MODE (desktop only) ─── */
  if (mode === 'cli') {
    return (
      <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f0f1b' }}>
        <Terminal
          isEmbedded={false}
          onSwitchToGui={() => setMode('gui')}
          terminalTheme={terminalTheme}
          setTerminalTheme={setTerminalTheme}
        />
        <button onClick={() => setMode('gui')} style={{
          position: 'fixed', top: 12, right: 12, zIndex: 99999,
          padding: '7px 16px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
          border: '1px solid rgba(0,240,255,0.35)', background: 'rgba(0,0,0,0.85)',
          color: '#00f0ff', borderRadius: 6, cursor: 'pointer', letterSpacing: '0.05em',
        }}>
          ⬡ GUI Mode
        </button>
      </main>
    );
  }

  /* ─── MOBILE GUI ─── */
  if (isMobile) {
    return <MobileDesktop />;
  }

  /* ─── DESKTOP GUI ─── */
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Desktop onSwitchToTerminal={() => setMode('cli')} />
    </main>
  );
}
