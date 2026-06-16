'use client';

import React, { useState, useRef, useEffect } from 'react';
import { playClick, playBeep, playStartup } from './sound';
import SnakeGame from './SnakeGame';
import HtopMonitor from './HtopMonitor';
import Ranger from './Ranger';

interface TerminalProps {
  isEmbedded?: boolean;
  onSwitchToGui?: () => void;
  terminalTheme?: string;
  setTerminalTheme?: (theme: string) => void;
}

interface CommandLog {
  input: string;
  output: React.ReactNode;
}

export default function Terminal({
  isEmbedded = false,
  onSwitchToGui,
  terminalTheme = '#4af626',
  setTerminalTheme,
}: TerminalProps) {
  const [history, setHistory] = useState<CommandLog[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showMatrix, setShowMatrix] = useState(false);
  const [currentDir, setCurrentDir] = useState('~');
  const [activeApp, setActiveApp] = useState<'none' | 'snake' | 'htop' | 'ranger'>('none');
  const [suggestion, setSuggestion] = useState('');
  const [resolution, setResolution] = useState('1920x1080');
  const [uptime, setUptime] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input on terminal container click
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
    // Play retro startup sound when terminal is loaded (not embedded)
    if (!isEmbedded) {
      playStartup();
    }
    // Capture client-side only values
    setResolution(`${window.innerWidth}x${window.innerHeight}`);
    setUptime(Math.floor(performance.now() / 60000) + 1);
  }, [isEmbedded]);

  // Scroll to bottom whenever history updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Recalculate auto-suggestion based on input text
  useEffect(() => {
    const trimmedInput = inputValue.trim().toLowerCase();
    if (!trimmedInput) {
      setSuggestion('');
      return;
    }

    const allTargets = [
      'help', 'ls', 'cat', 'about', 'projects', 'skills', 'certifications', 'contact', 'neofetch', 'matrix', 'gui', 'theme', 'clear', 'ranger', 'files', 'weather', 'cowsay', 'fortune', 'snake', 'htop', 'sudo',
      'about_me.txt', 'skills.json', 'projects.sh', 'certifications.txt', 'contact.cfg', 'image.jpg'
    ];

    const match = allTargets.find(t => t.startsWith(trimmedInput));
    if (match && match !== trimmedInput) {
      // Return typed prefix + remainder of the match
      setSuggestion(inputValue + match.slice(trimmedInput.length));
    } else {
      setSuggestion('');
    }
  }, [inputValue]);

  // Mock File System
  const files = {
    'about_me.txt': 'I am Syed Mohammad Ali Sajjad, a software developer passionate about building robust, scalable web and mobile applications. I specialize in Flutter (Cross-platform Mobile), Django & Flask (Python Backends), Java, Docker, and automation pipelines. Welcome to my command-line environment! Type "cat about_me.txt" to read this or "help" for a list of shell commands.',
    'skills.json': JSON.stringify({
      Languages: ['Java', 'Python', 'JavaScript', 'HTML5', 'CSS3', 'Dart'],
      Frameworks: ['Flutter', 'Django', 'Flask', 'Next.js', 'React'],
      DevOps: ['Docker', 'CI/CD Pipelines', 'GitHub Actions', 'Google Cloud Platform (GCP)'],
      Database: ['PostgreSQL', 'SQLite', 'Firebase Firestore']
    }, null, 2),
    'projects.sh': '# Run "projects" or "cat projects.sh" to view details.\necho "Loading Featured Projects..."\n- Medical AI NLP: AI-powered NLP app for medical text (Python, AI).\n- TerraCensus: Species population analyzer with interactive mapping.\n- Lumina — AI Expense Tracker: Smart finance tracker with AI insights (https://expence-tracker-lumina.vercel.app/login).\n- EqualOom — AI Equity Tool: AI-powered fair compensation analysis platform (https://equaloom.vercel.app/).\n- Interactive Portfolio: This Next.js terminal desktop OS environment.',
    'certifications.txt': '- Python for Everybody Specialization (University of Michigan • Coursera)\n- Docker Certified Associate (DCA)\n- Associate Cloud Engineer (Google Cloud)\n- Django for Everybody Specialization (Coursera)',
    'contact.cfg': 'Email: alisyed19615@gmail.com\nGitHub: https://github.com/alisyed19615-maker\nLinkedIn: https://linkedin.com/in/alisyed19615 (Simulated)\nWebsite: https://sajjad.dev',
    'image.jpg': '[BINARY DATA: Portrait of Syed Mohammad Ali Sajjad. View this in GUI mode or open image.jpg inside the desktop to render the full image.]'
  };

  // Neofetch Output Component
  const getNeofetchOutput = () => {
    const asciiArt = [
      "       .---.",
      "      /     \\\\",
      "      \\\\.@-@./",
      "      /`\\\\_/`\\\\",
      "     //  _  \\\\\\\\",
      "    | \\\\     / |",
      "    / \\\\`---`/ \\\\",
      "   /___/   \\\\___\\\\",
      "  /             \\\\"
    ].join('\n');

    return (
      <div className="grid md:grid-cols-2 gap-4 text-xs font-mono select-none leading-relaxed mt-2">
        <pre className="text-primary-glow select-none" style={{ color: terminalTheme }}>
          {asciiArt}
        </pre>
        <div>
          <div className="font-bold text-sm mb-1" style={{ color: terminalTheme }}>sajjad@AliOS</div>
          <div>--------------------------</div>
          <div><span className="font-semibold">OS</span>: AliOS Linux v2026.06</div>
          <div><span className="font-semibold">Host</span>: Portfolio-Server (Next.js App)</div>
          <div><span className="font-semibold">Kernel</span>: React 19 / GeistMono Core</div>
          <div><span className="font-semibold">Uptime</span>: {uptime} mins</div>
          <div><span className="font-semibold">Shell</span>: custom-sh v1.2</div>
          <div><span className="font-semibold">Resolution</span>: {resolution}</div>
          <div><span className="font-semibold">UI Mode</span>: {isEmbedded ? 'Embedded Desktop Client' : 'Standalone CLI Terminal'}</div>
          <div><span className="font-semibold">CPU</span>: Flutter Core / Full-Stack Thread</div>
          <div><span className="font-semibold">GPU</span>: WebGL Tailwind4 Engine</div>
          <div><span className="font-semibold">Memory</span>: Python / Docker / Java Stack</div>
        </div>
      </div>
    );
  };

  const fortunes = [
    "A clean desk is a sign of a cluttered desk drawer.",
    "There are 10 types of people: those who understand binary, and those who don't.",
    "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "To understand recursion, one must first understand recursion.",
    "If at first you don't succeed, call it version 1.0.",
    "There is no place like 127.0.0.1.",
    "Hardware: the parts of a computer that can be kicked.",
    "Computers are useless. They can only give you answers. - Pablo Picasso",
    "Programming is like writing a book... except if you miss one comma, the whole book makes no sense."
  ];

  const cowsay = (message: string) => {
    const lines = message.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length));
    const borderTop = "  " + "_".repeat(maxLength + 2);
    const borderBottom = "  " + "-".repeat(maxLength + 2);
    const bubbleLines = lines.map(line => {
      const padding = " ".repeat(maxLength - line.length);
      return `< ${line}${padding} >`;
    }).join('\n');

    return `${borderTop}
${bubbleLines}
${borderBottom}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
  };

  // Command Interpreter
  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    // Add to history
    const newHistory = [...commandHistory, trimmed];
    setCommandHistory(newHistory);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let output: React.ReactNode = '';

    switch (command) {
      case 'help':
        output = (
          <div className="space-y-1">
            <p className="font-semibold text-slate-300">Available commands:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-1 font-mono text-xs">
              <div><span className="font-bold" style={{ color: terminalTheme }}>help</span> - List commands</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>ls</span> - List files</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>cat &lt;file&gt;</span> - Read file contents</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>ranger</span> - Interactive file manager</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>weather</span> - Rich ASCII tech weather map</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>about</span> - About Syed Ali Sajjad</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>projects</span> - Showcase featured projects</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>skills</span> - View technology stack</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>certifications</span> - Certificates & qualifications</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>contact</span> - Display contact configuration</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>neofetch</span> - System specs & ASCII logo</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>matrix</span> - Run digital code rain screensaver</div>
              {onSwitchToGui && (
                <div><span className="font-bold" style={{ color: terminalTheme }}>gui</span> - Switch to desktop GUI mode</div>
              )}
              <div><span className="font-bold" style={{ color: terminalTheme }}>theme &lt;color&gt;</span> - green/amber/cyan/purple/magenta/white</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>cowsay &lt;msg&gt;</span> - Speak like a cow</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>fortune</span> - Tech fortune cookie</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>snake</span> - Play retro CLI Snake</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>htop</span> - Interactive system monitor</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>sudo &lt;cmd&gt;</span> - Superuser shell execute</div>
              <div><span className="font-bold" style={{ color: terminalTheme }}>clear</span> - Clear the terminal log</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">💡 Tips: Press [➡️] or [Tab] for inline autocomplete. Up/Down keys cycle history.</p>
          </div>
        );
        break;

      case 'ranger':
      case 'files':
        setActiveApp('ranger');
        return;

      case 'weather':
        output = (
          <div className="space-y-2 font-mono text-xs leading-relaxed">
            <p className="font-bold text-sm" style={{ color: terminalTheme }}>☁️ Global Tech Weather Forecast</p>
            <pre className="text-cyan-400 select-none">
{`   _   _      
  ( \\_/ )     📍 Neo-Tokyo: +18°C, Cloudy with digital scanline drizzle
   ) _ (      📍 Silicon Valley: +22°C, Bright sunny code-day, low bug counts
  (_/ \\_)     📍 London: +14°C, Foggy DevOps logs, high moisture index
              📍 Matrix Core: 10101101°F, Cascading green phosphor streams`}
            </pre>
          </div>
        );
        break;

      case 'cowsay':
        const cowMsg = arg || 'Moo!';
        if (cowMsg === 'fortune') {
          const idx = Math.floor(Math.random() * fortunes.length);
          output = <pre className="whitespace-pre font-mono text-xs">{cowsay(fortunes[idx])}</pre>;
        } else {
          output = <pre className="whitespace-pre font-mono text-xs">{cowsay(cowMsg)}</pre>;
        }
        break;

      case 'fortune':
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        if (arg === '| cowsay') {
          output = <pre className="whitespace-pre font-mono text-xs">{cowsay(randomFortune)}</pre>;
        } else {
          output = <span className="font-mono italic">"{randomFortune}"</span>;
        }
        break;

      case 'snake':
        setActiveApp('snake');
        return;

      case 'htop':
        setActiveApp('htop');
        return;

      case 'sudo':
        if (!arg) {
          output = <span className="text-red-400">usage: sudo &lt;command&gt;</span>;
          playBeep();
        } else if (arg.startsWith('rm -rf')) {
          output = (
            <div className="space-y-1 font-mono text-red-500">
              <p>⚠️ WARNING: DESTRUCTIVE PACKET LOADED.</p>
              <p>Wiping user databases...</p>
              <p>Deleting Flutter frameworks...</p>
              <p>rm: cannot remove \'/sys/kernel/debug\': Permission denied</p>
              <p>System crash simulated successfully. Just kidding! 😉</p>
            </div>
          );
        } else if (arg.startsWith('apt install')) {
          output = (
            <div className="space-y-1 font-mono">
              <p>Reading package lists... Done</p>
              <p>Building dependency tree... Done</p>
              <p>The following NEW packages will be installed:</p>
              <p className="text-green-400">  ali-sajjad-super-developer</p>
              <p>0 upgraded, 1 newly installed, 0 to remove.</p>
              <p>Need to get 4.2 MB of archives.</p>
              <p>Unpacking ali-sajjad-super-developer...</p>
              <p>Setting up ali-sajjad-super-developer (v2026.06)... Done!</p>
            </div>
          );
        } else {
          output = <span className="text-yellow-400">guest is not in the sudoers file. This incident will be reported. 🤫</span>;
          playBeep();
        }
        break;

      case 'ls':
        output = (
          <div className="flex flex-wrap gap-4 font-mono font-bold text-sm">
            <span className="text-blue-400">about_me.txt</span>
            <span className="text-purple-400">skills.json</span>
            <span className="text-yellow-400">projects.sh</span>
            <span className="text-blue-400">certifications.txt</span>
            <span className="text-blue-400">contact.cfg</span>
            <span className="text-green-400">image.jpg</span>
          </div>
        );
        break;

      case 'cat':
        if (!arg) {
          output = <span className="text-red-400">Error: Specify a file, e.g., "cat about_me.txt"</span>;
          playBeep();
        } else if (files[arg as keyof typeof files]) {
          output = <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{files[arg as keyof typeof files]}</pre>;
        } else {
          output = <span className="text-red-400">Error: File "{arg}" not found. Type "ls" to list files.</span>;
          playBeep();
        }
        break;

      case 'neofetch':
        output = getNeofetchOutput();
        break;

      case 'about':
        output = (
          <div className="space-y-2 leading-relaxed">
            <p className="font-semibold text-lg" style={{ color: terminalTheme }}>About Syed Mohammad Ali Sajjad</p>
            <p className="text-sm">
              I am a specialized software developer with heavy expertise in **Flutter, Python, Django, Flask, Java, and Docker**. 
              My design principles emphasize cleaner, testable architectures, CI/CD automation, and modern responsive design.
            </p>
            <p className="text-sm text-slate-400">
              Type <span className="font-bold" style={{ color: terminalTheme }}>skills</span> to inspect my technical toolkit or <span className="font-bold" style={{ color: terminalTheme }}>projects</span> to view my builds!
            </p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-3 font-mono text-sm leading-relaxed">
            <p className="font-semibold text-lg" style={{ color: terminalTheme }}>Technical Capabilities</p>
            <div>
              <p className="text-blue-400 font-bold">Languages:</p>
              <p>Java, Python (Django, Flask), Dart (Flutter), JavaScript (ES6+), HTML5, CSS3</p>
            </div>
            <div>
              <p className="text-purple-400 font-bold">Frameworks & Platforms:</p>
              <p>Flutter SDK (Android, iOS, Web), Next.js, React, Django REST Framework, Flask</p>
            </div>
            <div>
              <p className="text-yellow-400 font-bold">DevOps & Cloud:</p>
              <p>Docker containerization, CI/CD integrations, GitHub Actions pipelines, Google Cloud Services</p>
            </div>
            <div>
              <p className="text-green-400 font-bold">Databases & Tools:</p>
              <p>PostgreSQL, Firebase Firestore, SQLite, Git, Docker Compose</p>
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-4 font-mono text-sm leading-relaxed">
            <p className="font-semibold text-lg" style={{ color: terminalTheme }}>Featured Projects</p>
            
            <div className="border-l-2 border-slate-700 pl-4 py-1">
              <p className="font-bold text-blue-400">Medical AI NLP <span className="text-xs text-slate-500 font-normal">| Live Link: https://medical-ai-nlp.onrender.com</span></p>
              <p className="text-xs text-slate-400">AI-powered Natural Language Processing engine tailored for clinical/medical text analytics and classification.</p>
            </div>

            <div className="border-l-2 border-slate-700 pl-4 py-1">
              <p className="font-bold text-yellow-400">TerraCensus <span className="text-xs text-slate-500 font-normal">| Vercel Deployment</span></p>
              <p className="text-xs text-slate-400">Interactive ecological modeling utility combining maps and population telemetry data analytics.</p>
            </div>

            <div className="border-l-2 border-slate-700 pl-4 py-1">
              <p className="font-bold text-orange-400">Lumina — AI Expense Tracker <span className="text-xs text-slate-500 font-normal">| Live Link: https://expence-tracker-lumina.vercel.app/login</span></p>
              <p className="text-xs text-slate-400">AI-powered personal finance tracker with smart categorization, spending insights, and budget management dashboard.</p>
            </div>

            <div className="border-l-2 border-slate-700 pl-4 py-1">
              <p className="font-bold text-pink-400">EqualOom — AI Equity Tool <span className="text-xs text-slate-500 font-normal">| Live Link: https://equaloom.vercel.app/</span></p>
              <p className="text-xs text-slate-400">AI-powered equity analysis platform providing data-driven insights for fair and transparent compensation decisions.</p>
            </div>

            <div className="border-l-2 border-slate-700 pl-4 py-1">
              <p className="font-bold text-green-400">Linux Interactive Portfolio <span className="text-xs text-slate-500 font-normal">| Next.js & TypeScript</span></p>
              <p className="text-xs text-slate-400">This current project - featuring full terminal interpreter, Web Audio synthesizer, and windowed GUI desktop.</p>
            </div>
          </div>
        );
        break;

      case 'certifications':
        output = (
          <div className="space-y-2 font-mono text-sm">
            <p className="font-semibold text-lg" style={{ color: terminalTheme }}>Credentials & Specializations</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Python for Everybody Specialization (Coursera / University of Michigan)</li>
              <li>Docker Certified Associate (DCA) (Docker Inc.)</li>
              <li>Associate Cloud Engineer (ACE) (Google Cloud Platform)</li>
              <li>Django for Everybody Specialization (Coursera)</li>
            </ul>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-2 font-mono text-sm">
            <p className="font-semibold text-lg" style={{ color: terminalTheme }}>Let's Connect</p>
            <div>Email: <a href="mailto:alisyed19615@gmail.com" className="underline hover:text-white" style={{ color: terminalTheme }}>alisyed19615@gmail.com</a></div>
            <div>GitHub: <a href="https://github.com/alisyed19615-maker" target="_blank" className="underline hover:text-white text-blue-400">github.com/alisyed19615-maker</a></div>
            <div>LinkedIn: <span className="text-slate-400">linkedin.com/in/alisyed19615 (Simulated)</span></div>
          </div>
        );
        break;

      case 'theme':
        if (!arg) {
          output = <span className="text-red-400">Specify color: theme &lt;green|amber|cyan|purple|magenta|white&gt;</span>;
          playBeep();
        } else {
          const lowerColor = arg.toLowerCase();
          let hex = '';
          if (lowerColor === 'green') hex = '#4af626';
          else if (lowerColor === 'amber') hex = '#ffb000';
          else if (lowerColor === 'cyan') hex = '#00f0ff';
          else if (lowerColor === 'purple') hex = '#bb9af7';
          else if (lowerColor === 'magenta') hex = '#ec4899';
          else if (lowerColor === 'white') hex = '#ffffff';

          if (hex) {
            if (setTerminalTheme) {
              setTerminalTheme(hex);
            }
            output = <span>Terminal color updated to <span style={{ color: hex }}>{lowerColor}</span>.</span>;
          } else {
            output = <span className="text-red-400">Invalid theme. Choose: green, amber, cyan, purple, magenta, or white.</span>;
            playBeep();
          }
        }
        break;

      case 'matrix':
        setShowMatrix(true);
        output = <span>Initializing screensaver... Press any key or click to return.</span>;
        break;

      case 'gui':
        if (onSwitchToGui) {
          onSwitchToGui();
          return;
        } else {
          output = <span className="text-yellow-400">GUI is already open or unavailable in standalone window.</span>;
        }
        break;

      case 'clear':
        setHistory([]);
        setInputValue('');
        return;

      default:
        output = <span className="text-red-400">Command not found: "{command}". Type "help" for a list of utilities.</span>;
        playBeep();
    }

    setHistory((prev) => [...prev, { input: cmdText, output }]);
    setInputValue('');
  };

  // Keyboard navigation and key click synthesizer
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let keyType: 'space' | 'enter' | 'backspace' | 'default' = 'default';
    if (e.key === ' ') keyType = 'space';
    else if (e.key === 'Enter') keyType = 'enter';
    else if (e.key === 'Backspace') keyType = 'backspace';

    playClick(keyType);

    if (e.key === 'Enter') {
      handleCommand(inputValue);
    } else if (e.key === 'ArrowRight' && suggestion) {
      // Complete inline suggestion zsh-style
      setInputValue(suggestion);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputValue(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIdx);
        setInputValue(commandHistory[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Handle autocomplete
      const parts = inputValue.split(/\s+/);
      const currentWord = parts[parts.length - 1];
      if (!currentWord) return;

      const allTargets = [
        'help', 'ls', 'cat', 'about', 'projects', 'skills', 'certifications', 'contact', 'neofetch', 'matrix', 'gui', 'theme', 'clear', 'ranger', 'files', 'weather',
        ...Object.keys(files)
      ];

      const matches = allTargets.filter(t => t.startsWith(currentWord));
      if (matches.length === 1) {
        // Complete the word
        parts[parts.length - 1] = matches[0];
        setInputValue(parts.join(' '));
      } else if (matches.length > 1) {
        // Display options
        setHistory((prev) => [
          ...prev, 
          { input: inputValue, output: <div className="text-slate-500 font-mono text-xs">{matches.join('   ')}</div> }
        ]);
      }
    }
  };

  // Turn off Matrix
  const handleCloseMatrix = () => {
    setShowMatrix(false);
  };

  if (showMatrix) {
    return (
      <div 
        onClick={handleCloseMatrix}
        onKeyDown={handleCloseMatrix}
        className="absolute inset-0 bg-black cursor-pointer flex items-center justify-center overflow-hidden z-[11000] focus:outline-none"
        tabIndex={0}
      >
        <div className="absolute text-slate-500 text-xs font-mono select-none bottom-4 right-4">
          Click or press any key to exit screen saver
        </div>
        <canvas className="w-full h-full" ref={(canvas) => {
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          const columns = Math.floor(canvas.width / 16) + 1;
          const drops: number[] = [];
          for (let x = 0; x < columns; x++) drops[x] = Math.random() * -100;
          const chars = '01'.split('');
          
          const interval = setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = terminalTheme;
            ctx.font = '16px monospace';
            for (let i = 0; i < drops.length; i++) {
              const char = chars[Math.floor(Math.random() * chars.length)];
              ctx.fillText(char, i * 16, drops[i] * 16);
              if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
              drops[i]++;
            }
          }, 33);
          
          (canvas as any)._cleanup = () => clearInterval(interval);
        }} />
      </div>
    );
  }

  if (activeApp === 'snake') {
    return <SnakeGame onExit={() => setActiveApp('none')} terminalTheme={terminalTheme} />;
  }

  if (activeApp === 'htop') {
    return <HtopMonitor onExit={() => setActiveApp('none')} terminalTheme={terminalTheme} />;
  }

  if (activeApp === 'ranger') {
    return <Ranger onExit={() => setActiveApp('none')} terminalTheme={terminalTheme} />;
  }

  const renderPromptPrefix = () => (
    <div className="flex items-center text-[10px] font-sans font-extrabold select-none mr-2">
      <span className="bg-[#3b4252] text-[#d8dee9] px-2 py-0.5 rounded-l flex items-center font-black uppercase tracking-wider">
        guest@ali
      </span>
      <span className="bg-[#81a1c1] text-[#2e3440] px-2 py-0.5 font-black uppercase tracking-wider">
        {currentDir}
      </span>
      <span className="bg-[#88c0d0] text-[#2e3440] px-1.5 py-0.5 rounded-r font-black">
        zsh
      </span>
      <span className="text-[#88c0d0] font-bold ml-2 font-mono text-sm">➜</span>
    </div>
  );

  return (
    <div
      onClick={focusInput}
      className={`font-mono overflow-auto h-full flex flex-col no-scrollbar select-text ${
        isEmbedded ? 'text-xs text-slate-200' : 'p-6 text-sm bg-[#0f0f1b]'
      }`}
      style={{ color: terminalTheme }}
      ref={containerRef}
    >
      {/* Standalone Terminal Header */}
      {!isEmbedded && (
        <div className="space-y-1 select-none text-xs opacity-75 border-b border-slate-900 pb-3 mb-4 font-mono">
          <p>AliOS Core Shell Emulator v1.2.0-STABLE (x86_64-pc-linux-gnu)</p>
          <p>System Initialized successfully. WebAudio synthesizers active.</p>
          <p>Type <span className="font-bold border border-green-500/35 px-1 py-0.5 rounded">help</span> to begin exploring Syed's portfolio.</p>
        </div>
      )}

      {/* Main Command Buffer */}
      <div className="flex-1 space-y-4">
        {/* Startup specs on initial load in standalone mode */}
        {!isEmbedded && history.length === 0 && (
          <div className="space-y-4">
            {getNeofetchOutput()}
            <p className="text-slate-400 text-xs">🚀 Standalone shell. Type <span className="text-white underline">gui</span> to enter Graphical Desktop Mode.</p>
          </div>
        )}

        {history.map((log, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-1 opacity-90">
              {renderPromptPrefix()}
              <span className="text-white font-semibold ml-1">{log.input}</span>
            </div>
            <div className="pl-4 py-1 text-slate-300 leading-relaxed">{log.output}</div>
          </div>
        ))}
      </div>

      {/* Input Prompt */}
      <div className="flex items-center gap-1 mt-4 border-t border-slate-900/50 pt-3">
        {renderPromptPrefix()}
        <div className="flex-1 relative flex items-center ml-1 h-5">
          {/* Transparent input on top */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 bg-transparent border-none outline-none focus:ring-0 p-0 text-transparent font-mono text-sm caret-white z-10 w-full"
            style={{ caretColor: terminalTheme }}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          {/* Render text with zsh-autosuggestion behind */}
          <div className="absolute inset-0 flex items-center pointer-events-none font-mono text-sm select-none">
            <span className="text-white">{inputValue}</span>
            {suggestion && (
              <span className="text-slate-600 opacity-60 ml-0">
                {suggestion.slice(inputValue.length)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
