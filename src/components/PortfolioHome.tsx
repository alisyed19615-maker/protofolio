'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PortfolioHomeProps {
  onLaunchCli: () => void;
  onLaunchGui: () => void;
}

const skills = [
  { name: 'Java', color: '#ef4444' },
  { name: 'Django', color: '#16a34a' },
  { name: 'Flask', color: '#60a5fa' },
  { name: 'Flutter', color: '#06b6d4' },
  { name: 'Docker', color: '#2563eb' },
  { name: 'HTML', color: '#f97316' },
  { name: 'CSS', color: '#3b82f6' },
  { name: 'JavaScript', color: '#facc15' },
  { name: 'Python', color: '#8b5cf6' },
  { name: 'CI/CD', color: '#a855f7' },
  { name: 'Git', color: '#f43f5e' },
];

const projects = [
  {
    title: 'Medical AI NLP',
    tags: 'AI • NLP • Python',
    desc: 'An advanced AI-powered Natural Language Processing application tailored for medical contexts, enabling intelligent text analysis and insights.',
    link: 'https://medical-ai-nlp.onrender.com',
    icon: '🧠',
    color: '#3b82f6',
  },
  {
    title: 'Real-time Chat App',
    tags: 'Flutter • Firebase',
    desc: 'A cross-platform mobile application for instant messaging with real-time synchronization, push notifications, and media sharing capabilities.',
    link: '#',
    icon: '💬',
    color: '#8b5cf6',
  },
  {
    title: 'TerraCensus',
    tags: 'CI/CD • Data Analytics • Maps',
    desc: 'A species population analyzer with predictive modeling, trajectory analysis, and interactive species distribution maps.',
    link: 'https://species-population-analyzer.vercel.app/index.html',
    icon: '🌍',
    color: '#10b981',
  },
  {
    title: 'AliOS Portfolio',
    tags: 'Next.js • React • TypeScript',
    desc: 'This very site — a showcase of creativity with a full simulated Linux OS terminal and GUI desktop environment.',
    link: '#',
    icon: '🖥️',
    color: '#f97316',
    isThis: true,
  },
];

const certifications = [
  { title: 'Python for Everybody Specialization', issuer: 'Coursera • University of Michigan' },
  { title: 'Docker Certified Associate (DCA)', issuer: 'Docker Inc.' },
  { title: 'Associate Cloud Engineer', issuer: 'Google Cloud' },
  { title: 'Django for Everybody Specialization', issuer: 'Coursera' },
];

const typingStrings = ['Experiences with Code', 'Scalable Architectures', 'Modern Mobile Apps'];

export default function PortfolioHome({ onLaunchCli, onLaunchGui }: PortfolioHomeProps) {
  const [typedText, setTypedText] = useState('');
  const [typingIdx, setTypingIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set());
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Typing effect
  useEffect(() => {
    const current = typingStrings[typingIdx];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setTypedText(current.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, 55);
    } else if (isDeleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setTypedText(current.slice(0, charIdx));
        setCharIdx(c => c - 1);
      }, 30);
    }

    if (!isDeleting && charIdx > current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIdx < 0) {
      setIsDeleting(false);
      setTypingIdx(i => (i + 1) % typingStrings.length);
      setCharIdx(0);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, typingIdx]);

  // Scroll + section reveal
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = document.querySelectorAll('[data-reveal]');
      sections.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88) {
          const id = el.getAttribute('data-reveal')!;
          setRevealedSections(prev => new Set([...prev, id]));
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Reveal hero immediately
    setRevealedSections(new Set(['hero', 'skills']));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];
    const colors = ['rgba(255,140,102,0.4)', 'rgba(59,130,246,0.4)', 'rgba(168,85,247,0.4)'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(200,200,200,${0.08 - dist / 1500})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const bg = isDark ? '#0B1120' : '#F8FAFC';
  const cardBg = isDark ? '#162033' : '#FFFFFF';
  const text = isDark ? '#e2e8f0' : '#1e293b';
  const muted = isDark ? '#94a3b8' : '#64748b';
  const border = isDark ? '#1e293b' : '#e2e8f0';

  const isRevealed = (id: string) => revealedSections.has(id);

  return (
    <div
      style={{ backgroundColor: bg, color: text, fontFamily: 'Inter, sans-serif', minHeight: '100vh', overflowX: 'hidden', position: 'relative', cursor: 'none' }}
    >
      {/* Custom Cursor */}
      <div
        style={{
          position: 'fixed',
          left: cursorPos.x,
          top: cursorPos.y,
          transform: 'translate(-50%, -50%)',
          width: cursorHovered ? 48 : 20,
          height: cursorHovered ? 48 : 20,
          border: cursorHovered ? 'none' : '1.5px solid rgba(255,140,102,0.7)',
          borderRadius: '50%',
          backgroundColor: cursorHovered ? 'rgba(255,140,102,0.12)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.25s, height 0.25s, background-color 0.25s',
          mixBlendMode: 'difference',
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.35, zIndex: 0 }}
      />

      {/* Animated background blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '10%', left: '-2%', width: 420, height: 420,
          background: 'rgba(255,140,102,0.22)', borderRadius: '50%', filter: 'blur(80px)',
          animation: 'floatBlob 12s infinite ease-in-out',
        }} />
        <div style={{
          position: 'absolute', bottom: '8%', right: '-2%', width: 520, height: 520,
          background: 'rgba(59,130,246,0.18)', borderRadius: '50%', filter: 'blur(80px)',
          animation: 'floatBlob 15s infinite ease-in-out reverse',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '30%', width: 320, height: 320,
          background: 'rgba(168,85,247,0.15)', borderRadius: '50%', filter: 'blur(80px)',
          animation: 'floatBlob 10s infinite ease-in-out 3s',
        }} />
      </div>

      {/* Scroll progress */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: 3, zIndex: 10001,
        background: 'linear-gradient(90deg, #FF8C66, #ec4899)',
        width: `${Math.min((scrollY / (document.body?.scrollHeight - window.innerHeight || 1)) * 100, 100)}%`,
        transition: 'width 0.1s',
      }} />

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: isDark ? 'rgba(11,17,32,0.85)' : 'rgba(248,250,252,0.85)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${border}`,
        height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        <a
          href="#"
          style={{ fontWeight: 800, fontSize: 17, color: text, textDecoration: 'none', letterSpacing: '-0.02em' }}
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
        >
          Syed Mohammad Ali Sajjad
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['About', 'Projects', 'Certifications', 'Contact'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              style={{ color: muted, fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = '#FF8C66'; setCursorHovered(true); }}
              onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = muted; setCursorHovered(false); }}
            >
              {label}
            </a>
          ))}

          {/* Launch AliOS button */}
          <button
            onClick={onLaunchGui}
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
            style={{
              background: 'linear-gradient(135deg, #0d1117, #1a2035)',
              border: '1px solid rgba(74,246,38,0.35)',
              color: '#4af626',
              padding: '7px 16px',
              borderRadius: 24,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              boxShadow: '0 0 14px -4px rgba(74,246,38,0.25)',
              transition: 'all 0.2s',
            }}
          >
            🐚 AliOS Desktop
          </button>

          {/* Dark/light toggle */}
          <button
            onClick={() => setIsDark(d => !d)}
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: isDark ? '#facc15' : '#475569', fontSize: 20, padding: 6,
              borderRadius: 8, transition: 'background 0.2s',
            }}
            title="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        id="hero"
        style={{
          minHeight: '92vh', display: 'flex', alignItems: 'center',
          padding: '80px 32px 0', position: 'relative', zIndex: 1,
          opacity: isRevealed('hero') ? 1 : 0,
          transform: isRevealed('hero') ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.5,0,0,1)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h1 style={{
                fontSize: 64, fontWeight: 900, lineHeight: 1.1,
                letterSpacing: '-0.03em', margin: 0,
                color: isDark ? '#fff' : '#0f172a',
              }}>
                Crafting{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #FF8C66, #f97316)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Digital</span>
                <br />
                <span style={{ color: muted, fontWeight: 500, fontSize: 46 }}>
                  {typedText}<span style={{ borderRight: '3px solid #FF8C66', marginLeft: 2, animation: 'blink 1s infinite' }}>​</span>
                </span>
              </h1>
              <p style={{ fontSize: 19, color: muted, maxWidth: 480, lineHeight: 1.65, margin: 0 }}>
                Flutter Specialist & Full Stack Developer building robust, scalable, and beautiful applications.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a
                href="#contact"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                style={{
                  padding: '14px 32px', background: '#FF8C66', color: '#fff',
                  borderRadius: 40, fontWeight: 700, fontSize: 15,
                  textDecoration: 'none', boxShadow: '0 8px 24px -6px rgba(255,140,102,0.45)',
                  transition: 'all 0.2s',
                }}
              >
                Get in Touch
              </a>
              <a
                href="https://github.com/alisyed19615-maker"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                style={{
                  padding: '14px 32px', borderRadius: 40, fontWeight: 700, fontSize: 15,
                  textDecoration: 'none', border: `1.5px solid ${border}`,
                  color: text, transition: 'all 0.2s',
                }}
              >
                View GitHub
              </a>
              <button
                onClick={onLaunchCli}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                style={{
                  padding: '14px 28px', borderRadius: 40, fontWeight: 700, fontSize: 13,
                  border: '1.5px solid rgba(74,246,38,0.4)', background: 'rgba(74,246,38,0.05)',
                  color: '#4af626', cursor: 'pointer', fontFamily: 'monospace',
                  transition: 'all 0.2s', letterSpacing: '0.05em',
                }}
              >
                $ ./aliOS --terminal
              </button>
            </div>
          </div>

          {/* Portrait */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
            <div style={{ position: 'relative', width: 380, height: 380 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #FF8C66, #3b82f6)',
                borderRadius: '50%', filter: 'blur(40px)', opacity: 0.35,
              }} />
              <img
                src="/image.jpg"
                alt="Syed Mohammad Ali Sajjad"
                style={{
                  position: 'relative', width: '100%', height: '100%',
                  objectFit: 'cover', borderRadius: '50%',
                  border: `4px solid ${cardBg}`,
                  boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS STRIP */}
      <div
        data-reveal="skills"
        style={{
          borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          padding: '24px 32px', position: 'relative', zIndex: 1,
          opacity: isRevealed('skills') ? 1 : 0,
          transform: isRevealed('skills') ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s 0.1s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {skills.map(skill => (
            <div
              key={skill.name}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', borderRadius: 40,
                background: cardBg, border: `1px solid ${border}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                fontSize: 13, fontWeight: 600, cursor: 'default',
                transition: 'transform 0.15s',
              }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: skill.color, display: 'inline-block' }} />
              {skill.name}
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section
        id="about"
        data-reveal="about"
        style={{
          padding: '96px 32px', position: 'relative', zIndex: 1,
          opacity: isRevealed('about') ? 1 : 0,
          transform: isRevealed('about') ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            background: isDark ? 'rgba(17,25,40,0.75)' : 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${border}`,
            borderRadius: 20, padding: '48px 56px',
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.2)',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 24px', color: isDark ? '#fff' : '#0f172a' }}>About Me</h2>
            <p style={{ fontSize: 17, color: muted, lineHeight: 1.75, margin: 0 }}>
              I'm a software developer passionate about crafting web and mobile applications. I focus on writing clean,
              maintainable code and building robust architectures. My workflow emphasizes automation with CI/CD pipelines
              and containerization with Docker. I believe in creating solutions that not only work but provide an
              exceptional user experience. I specialize in <strong style={{ color: '#FF8C66' }}>Flutter</strong>, <strong style={{ color: '#FF8C66' }}>Django</strong>, <strong style={{ color: '#FF8C66' }}>Flask</strong>, <strong style={{ color: '#FF8C66' }}>Java</strong>, and modern DevOps practices.
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section
        id="projects"
        data-reveal="projects"
        style={{
          padding: '96px 32px',
          background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
          position: 'relative', zIndex: 1,
          opacity: isRevealed('projects') ? 1 : 0,
          transform: isRevealed('projects') ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px', color: isDark ? '#fff' : '#0f172a' }}>Featured Projects</h2>
            <div style={{ width: 72, height: 4, background: '#FF8C66', borderRadius: 4, margin: '0 auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            {projects.map(project => (
              <div
                key={project.title}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderRadius: 18, padding: 32,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(-1deg) rotateY(1.5deg) scale(1.01)';
                  e.currentTarget.style.boxShadow = `0 24px 48px -12px rgba(0,0,0,0.25)`;
                  e.currentTarget.style.borderColor = `${project.color}50`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = border;
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: isDark ? '#fff' : '#0f172a' }}>{project.title}</h3>
                  <span style={{ fontSize: 22 }}>{project.icon}</span>
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: muted, margin: '0 0 14px' }}>
                  {project.tags}
                </p>
                <p style={{ color: muted, fontSize: 14, lineHeight: 1.65, margin: '0 0 24px' }}>{project.desc}</p>
                {project.isThis ? (
                  <button
                    onClick={onLaunchGui}
                    style={{
                      color: '#FF8C66', fontWeight: 700, fontSize: 14, background: 'none',
                      border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    Launch AliOS 🖥️ →
                  </button>
                ) : (
                  <a
                    href={project.link} target="_blank" rel="noreferrer"
                    style={{ color: '#FF8C66', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section
        id="certifications"
        data-reveal="certifications"
        style={{
          padding: '96px 32px', position: 'relative', zIndex: 1,
          opacity: isRevealed('certifications') ? 1 : 0,
          transform: isRevealed('certifications') ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px', color: isDark ? '#fff' : '#0f172a' }}>Certifications & Achievements</h2>
            <div style={{ width: 72, height: 4, background: border, borderRadius: 4, margin: '0 auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {certifications.map(cert => (
              <div
                key={cert.title}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                style={{
                  background: cardBg, border: `1px solid ${border}`,
                  borderRadius: 14, padding: '24px 28px',
                  transition: 'border-color 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,140,102,0.5)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = border; }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: isDark ? '#fff' : '#0f172a' }}>{cert.title}</h3>
                <p style={{ fontSize: 13, color: muted, margin: '0 0 14px' }}>{cert.issuer}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#FF8C66' }}>View Credential ↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <footer
        id="contact"
        data-reveal="contact"
        style={{
          padding: '80px 32px 48px',
          background: isDark ? '#080d19' : '#fff',
          borderTop: `1px solid ${border}`,
          textAlign: 'center', position: 'relative', zIndex: 1,
          opacity: isRevealed('contact') ? 1 : 0,
          transform: isRevealed('contact') ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px', color: isDark ? '#fff' : '#0f172a' }}>Let's Connect!</h2>
            <p style={{ color: muted, fontSize: 16, margin: 0 }}>I'm open to new opportunities — let's collaborate and build something great together.</p>
          </div>
          <a
            href="mailto:alisyed19615@gmail.com"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
            style={{
              display: 'inline-block',
              background: '#FF8C66', color: '#fff',
              fontWeight: 700, padding: '16px 40px',
              borderRadius: 12, textDecoration: 'none',
              fontSize: 16, boxShadow: '0 8px 24px -6px rgba(255,140,102,0.4)',
              transition: 'all 0.2s',
            }}
          >
            alisyed19615@gmail.com
          </a>
          <div style={{ display: 'flex', gap: 32 }}>
            <a href="#" style={{ color: muted, fontSize: 16, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = isDark ? '#fff' : '#0f172a')}
              onMouseOut={e => (e.currentTarget.style.color = muted)}>LinkedIn</a>
            <a href="https://github.com/alisyed19615-maker" target="_blank" rel="noreferrer"
              style={{ color: muted, fontSize: 16, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = isDark ? '#fff' : '#0f172a')}
              onMouseOut={e => (e.currentTarget.style.color = muted)}>GitHub</a>
          </div>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 24, width: '100%' }}>
            <p style={{ color: muted, fontSize: 13, margin: 0 }}>
              © 2025 Syed Mohammad Ali Sajjad. Designed & Built with ❤️
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes floatBlob {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
