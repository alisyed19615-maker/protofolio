'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AppModal {
  id: string;
  title: string;
  icon: string;
  color: string;
}

const APPS: AppModal[] = [
  { id: 'about',          title: 'About Me',       icon: '👤', color: '#3b82f6' },
  { id: 'projects',       title: 'Projects',        icon: '💼', color: '#8b5cf6' },
  { id: 'skills',         title: 'Skills',          icon: '⚡', color: '#f59e0b' },
  { id: 'certifications', title: 'Certs',           icon: '🏆', color: '#10b981' },
  { id: 'contact',        title: 'Contact',         icon: '📬', color: '#ef4444' },
  { id: 'terminal',       title: 'Terminal',        icon: '🐚', color: '#4af626' },
];

const DOCK_APPS = ['about', 'projects', 'contact', 'terminal'];

const QUICK_CMDS = ['help', 'about', 'skills', 'projects', 'certifications', 'contact', 'neofetch', 'fortune', 'clear'];

const PROJECTS = [
  { name: 'Medical AI NLP',            tags: 'Python • AI',       url: 'https://medical-ai-nlp.onrender.com',                    emoji: '🧠', color: '#3b82f6' },
  { name: 'TerraCensus',               tags: 'React • Maps',      url: 'https://species-population-analyzer.vercel.app/index.html', emoji: '🌍', color: '#10b981' },
  { name: 'Lumina — AI Expense Tracker', tags: 'React • Vite',   url: 'https://expence-tracker-lumina.vercel.app/login',         emoji: '💰', color: '#f97316' },
  { name: 'EqualOom — AI Equity Tool', tags: 'AI • React',        url: 'https://equaloom.vercel.app/',                           emoji: '⚖️', color: '#ec4899' },
  { name: 'AliOS Portfolio',           tags: 'Next.js • TS',      url: '#',                                                       emoji: '🖥️', color: '#8b5cf6' },
];

const SKILLS = [
  { name: 'Flutter',      color: '#06b6d4' },
  { name: 'Django',       color: '#16a34a' },
  { name: 'Flask',        color: '#60a5fa' },
  { name: 'Docker',       color: '#2563eb' },
  { name: 'Java',         color: '#ef4444' },
  { name: 'Python',       color: '#8b5cf6' },
  { name: 'JavaScript',   color: '#facc15' },
  { name: 'HTML/CSS',     color: '#f97316' },
  { name: 'Next.js',      color: '#ffffff' },
  { name: 'CI/CD',        color: '#a855f7' },
  { name: 'Git',          color: '#f43f5e' },
  { name: 'PostgreSQL',   color: '#22d3ee' },
];

const CERTS = [
  { title: 'Python for Everybody Specialization', issuer: 'Coursera • University of Michigan' },
  { title: 'Docker Certified Associate (DCA)',     issuer: 'Docker Inc.' },
  { title: 'Associate Cloud Engineer',             issuer: 'Google Cloud' },
  { title: 'Django for Everybody Specialization', issuer: 'Coursera' },
];

const FORTUNES = [
  'There are 10 types of people: those who understand binary, and those who don\'t.',
  'To understand recursion, one must first understand recursion.',
  'If at first you don\'t succeed, call it version 1.0.',
  'There is no place like 127.0.0.1.',
  'A SQL query walks into a bar, walks up to two tables and asks, "Can I join you?"',
];

interface TerminalLine { type: 'input' | 'output'; content: string }

export default function MobileDesktop() {
  const [time, setTime]             = useState('');
  const [date, setDate]             = useState('');
  const [openApp, setOpenApp]       = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('#00f0ff');

  // Terminal state
  const [termLines, setTermLines]   = useState<TerminalLine[]>([
    { type: 'output', content: 'AliOS Shell v1.2 — type a command or tap a shortcut below.' },
  ]);
  const [termInput, setTermInput]   = useState('');
  const termBottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                    = useRef<HTMLInputElement>(null);

  // Clock
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll terminal to bottom
  useEffect(() => {
    termBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [termLines]);

  // Evaluate a terminal command (simplified mobile version)
  const evalCmd = (raw: string): string => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return '';
    if (cmd === 'clear') { setTermLines([]); return ''; }
    if (cmd === 'help') return [
      'help       — this list',
      'about      — who I am',
      'skills     — tech stack',
      'projects   — my work',
      'certifications — credentials',
      'contact    — reach me',
      'neofetch   — system info',
      'fortune    — tech wisdom',
      'clear      — clear screen',
    ].join('\n');
    if (cmd === 'about') return 'Syed Mohammad Ali Sajjad\nFlutter Specialist & Full Stack Developer.\nSpecializes in: Flutter, Django, Flask, Java, Docker, CI/CD.';
    if (cmd === 'skills') return 'Languages: Java, Python, Dart, JS, HTML, CSS\nFrameworks: Flutter, Django, Flask, Next.js\nDevOps: Docker, CI/CD, GitHub Actions, GCP\nDB: PostgreSQL, Firebase, SQLite';
    if (cmd === 'projects') return PROJECTS.map(p => `${p.emoji} ${p.name}\n   ${p.tags}\n   ${p.url}`).join('\n\n');
    if (cmd === 'certifications') return CERTS.map(c => `🏆 ${c.title}\n   ${c.issuer}`).join('\n');
    if (cmd === 'contact') return 'Email:  alisyed19615@gmail.com\nGitHub: github.com/alisyed19615-maker';
    if (cmd === 'neofetch') return [
      '  ___    ___   ____  ___',
      ' / _ |  / (_) / __ \\/ __',
      '/ __ | / / / / /_/ /\\ \\',
      '/_/ |_|/_/_/ /\\____/___/',
      '',
      `sajjad@AliOS`,
      `OS: AliOS Linux v2026.06`,
      `Shell: custom-sh v1.2`,
      `Device: Mobile Client`,
    ].join('\n');
    if (cmd === 'fortune') return `"${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}"`;
    if (cmd === 'sudo rm -rf /') return '⚠️  rm: cannot remove /sys/kernel: Permission denied\nJust kidding! 😄';
    return `command not found: ${cmd}. Type "help" for a list.`;
  };

  const runCmd = (cmd: string) => {
    const result = evalCmd(cmd);
    if (cmd.trim().toLowerCase() === 'clear') return;
    setTermLines(prev => [
      ...prev,
      { type: 'input',  content: cmd },
      ...(result ? [{ type: 'output' as const, content: result }] : []),
    ]);
    setTermInput('');
  };

  const appForId = (id: string) => APPS.find(a => a.id === id);

  // Render app content
  const renderAppContent = (id: string) => {
    switch (id) {
      case 'about':
        return (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
              border: '3px solid rgba(255,255,255,0.1)',
              boxShadow: '0 0 30px rgba(59,130,246,0.3)',
            }}>
              <img src="/image.jpg" alt="Syed Mohammad Ali Sajjad" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200')} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Syed Mohammad Ali Sajjad</h2>
              <p style={{ fontSize: 13, color: themeColor, fontWeight: 600, margin: '0 0 12px', fontFamily: 'monospace' }}>Flutter Specialist & Full Stack Dev</p>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
                I'm a software developer passionate about building robust, scalable web and mobile applications.
                I specialize in Flutter, Django, Flask, Java, Docker, and CI/CD automation.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="https://github.com/alisyed19615-maker" target="_blank" rel="noreferrer"
                style={{ padding: '10px 20px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                GitHub ↗
              </a>
              <a href="mailto:alisyed19615@gmail.com"
                style={{ padding: '10px 20px', borderRadius: 20, background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Email Me
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', marginTop: 8 }}>
              {[['⚡ Flutter', 'Cross-platform apps'], ['📦 Docker', 'DevOps & CI/CD'], ['🐍 Python', 'Django & Flask APIs'], ['☕ Java', 'OOP & Architecture']].map(([t, d]) => (
                <div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', margin: '0 0 4px' }}>{t}</p>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PROJECTS.map(p => (
              <div key={p.name} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '16px',
                borderLeft: `3px solid ${p.color}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 16, marginRight: 8 }}>{p.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{p.name}</span>
                  </div>
                  {p.url !== '#' && (
                    <a href={p.url} target="_blank" rel="noreferrer"
                      style={{ fontSize: 11, color: p.color, fontWeight: 700, textDecoration: 'none', padding: '4px 10px', borderRadius: 12, background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                      Open ↗
                    </a>
                  )}
                </div>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0, fontFamily: 'monospace' }}>{p.tags}</p>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div style={{ padding: '24px 16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {SKILLS.map(s => (
                <div key={s.name} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 13, fontWeight: 600, color: '#e2e8f0',
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block', boxShadow: `0 0 6px ${s.color}` }} />
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CERTS.map(c => (
              <div key={c.title} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '16px',
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>🏆</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', margin: '0 0 4px' }}>{c.title}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{c.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'contact':
        return (
          <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Let's Connect!</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>I'm open to new opportunities — let's build something great.</p>
            </div>
            <a href="mailto:alisyed19615@gmail.com"
              style={{ width: '100%', maxWidth: 320, padding: '14px 24px', background: '#ef4444', color: '#fff', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'block' }}>
              📧 alisyed19615@gmail.com
            </a>
            <a href="https://github.com/alisyed19615-maker" target="_blank" rel="noreferrer"
              style={{ width: '100%', maxWidth: 320, padding: '14px 24px', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'block' }}>
              🐙 github.com/alisyed19615-maker
            </a>
          </div>
        );

      case 'terminal':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'monospace' }}>
            {/* Output */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', background: '#0a0a14', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {termLines.map((line, i) => (
                <div key={i}>
                  {line.type === 'input' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: themeColor, fontWeight: 700, flexShrink: 0 }}>➜</span>
                      <span style={{ color: '#fff' }}>{line.content}</span>
                    </div>
                  ) : (
                    <pre style={{ color: '#94a3b8', fontSize: 12, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{line.content}</pre>
                  )}
                </div>
              ))}
              <div ref={termBottomRef} />
            </div>

            {/* Quick-tap command buttons */}
            <div style={{ padding: '8px 12px', background: '#060610', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 6, flexWrap: 'nowrap', overflowX: 'auto' }}>
              {QUICK_CMDS.map(cmd => (
                <button key={cmd} onClick={() => runCmd(cmd)}
                  style={{ padding: '5px 12px', borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: `1px solid ${themeColor}30`, color: themeColor, fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {cmd}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#060610', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: themeColor, fontWeight: 700, flexShrink: 0 }}>$</span>
              <input
                ref={inputRef}
                value={termInput}
                onChange={e => setTermInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { runCmd(termInput); } }}
                placeholder="type a command..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, fontFamily: 'monospace' }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
              <button onClick={() => runCmd(termInput)}
                style={{ padding: '6px 14px', background: themeColor, border: 'none', borderRadius: 8, color: '#000', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                Run
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentApp = openApp ? appForId(openApp) : null;

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 30% 20%, #1e123a 0%, #03030b 60%)',
      display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      userSelect: 'none',
    }}>
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 280, height: 280, background: 'rgba(255,140,102,0.15)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 240, height: 240, background: 'rgba(59,130,246,0.12)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      {/* Status Bar */}
      <div style={{
        height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', zIndex: 10, flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{time}</span>
        <span style={{ fontSize: 11, color: themeColor, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.04em' }}>AliOS 🐚</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white" opacity="0.7"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4" y="2" width="3" height="10" rx="1"/><rect x="8" y="0" width="3" height="12" rx="1"/><rect x="12" y="0" width="3" height="12" rx="1" opacity="0.3"/></svg>
          <svg width="18" height="11" viewBox="0 0 18 11" fill="none" opacity="0.7"><rect x="0.5" y="0.5" width="15" height="10" rx="2" stroke="white" strokeWidth="1"/><rect x="16" y="3" width="2" height="5" rx="1" fill="white"/><rect x="2" y="2" width="11" height="7" rx="1" fill="white"/></svg>
        </div>
      </div>

      {/* Date */}
      <div style={{ textAlign: 'center', paddingBottom: 8, flexShrink: 0 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{date}</p>
      </div>

      {/* App Grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px', gap: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: '0 8px' }}>
          {APPS.map(app => (
            <button key={app.id} onClick={() => setOpenApp(app.id)}
              className="mobile-app-btn"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: `linear-gradient(135deg, ${app.color}33, ${app.color}11)`,
                border: `1px solid ${app.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
                boxShadow: `0 4px 20px ${app.color}20`,
              }}>
                {app.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{app.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Dock */}
      <div style={{
        margin: '0 20px 28px',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: '12px 20px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        flexShrink: 0,
      }}>
        {DOCK_APPS.map(id => {
          const app = appForId(id)!;
          return (
            <button key={id} onClick={() => setOpenApp(id)}
              className="dock-app-btn"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `linear-gradient(135deg, ${app.color}44, ${app.color}22)`,
                border: `1px solid ${app.color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                {app.icon}
              </div>
            </button>
          );
        })}
      </div>

      {/* Full-screen App Modal */}
      {openApp && currentApp && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: '#08080f',
            display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* App Nav Bar */}
          <div style={{
            height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <button onClick={() => setOpenApp(null)}
              className="mobile-app-btn"
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              ‹ Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{currentApp.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{currentApp.title}</span>
            </div>
            <div style={{ width: 64 }} />
          </div>

          {/* App Content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {renderAppContent(openApp)}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .mobile-app-btn {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mobile-app-btn:active {
          transform: scale(0.92);
        }
        .dock-app-btn {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dock-app-btn:active {
          transform: scale(0.85);
        }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        body { overflow: hidden; }
      `}</style>
    </div>
  );
}
