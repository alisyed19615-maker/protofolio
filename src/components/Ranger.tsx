'use client';

import React, { useState, useEffect } from 'react';
import { playClick, playBeep } from './sound';

interface RangerProps {
  onExit: () => void;
  terminalTheme: string;
}

export default function Ranger({ onExit, terminalTheme }: RangerProps) {
  const mockFiles = [
    { name: 'about_me.txt', type: 'text', size: '482 B', desc: 'Syed Mohammad Ali Sajjad bio profile text document' },
    { name: 'skills.json', type: 'json', size: '320 B', desc: 'Technical skills and technology stack specifications' },
    { name: 'projects.sh', type: 'script', size: '404 B', desc: 'Automated script rendering list of featured builds' },
    { name: 'certifications.txt', type: 'text', size: '254 B', desc: 'List of academic and cloud certifications' },
    { name: 'contact.cfg', type: 'config', size: '185 B', desc: 'Social channels and contact details configuration file' },
    { name: 'image.jpg', type: 'image', size: '54.5 KB', desc: 'Raw binary snapshot (portrait photo of Ali Sajjad)' },
  ];

  const filesContent = {
    'about_me.txt': 'I am Syed Mohammad Ali Sajjad, a software developer passionate about building robust, scalable web and mobile applications. I specialize in Flutter (Cross-platform Mobile), Django & Flask (Python Backends), Java, Docker, and automation pipelines.\n\nWelcome to my command-line environment! Type "cat about_me.txt" to read this or "help" for a list of shell commands.',
    'skills.json': JSON.stringify({
      Languages: ['Java', 'Python', 'JavaScript', 'HTML5', 'CSS3', 'Dart'],
      Frameworks: ['Flutter', 'Django', 'Flask', 'Next.js', 'React'],
      DevOps: ['Docker', 'CI/CD Pipelines', 'GitHub Actions', 'Google Cloud Platform (GCP)'],
      Database: ['PostgreSQL', 'SQLite', 'Firebase Firestore']
    }, null, 2),
    'projects.sh': '# Run "projects" or "cat projects.sh" to view details.\necho "Loading Featured Projects..."\n- Medical AI NLP: An advanced NLP application tailored for medical contexts (Python, AI).\n- Real-time Chat App: Cross-platform messaging built using Flutter & Firebase.\n- TerraCensus: Species population analyzer with interactive modeling and mapping.\n- Personal Portfolio: This Next.js terminal desktop environment.',
    'certifications.txt': '- Python for Everybody Specialization (University of Michigan • Coursera)\n- Docker Certified Associate (DCA)\n- Associate Cloud Engineer (Google Cloud)\n- Django for Everybody Specialization (Coursera)',
    'contact.cfg': 'Email: alisyed19615@gmail.com\nGitHub: https://github.com/alisyed19615-maker\nLinkedIn: https://linkedin.com/in/alisyed19615 (Simulated)\nWebsite: https://sajjad.dev',
    'image.jpg': '[BINARY IMAGE DATA]\nDimensions: 800 x 800 px\nFormat: JPEG\nPreview not supported in standard CLI raw buffer.\nPlease launch "Desktop GUI" mode or open image.jpg inside Graphical Desktop to view.'
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const next = prev > 0 ? prev - 1 : mockFiles.length - 1;
          playClick('default');
          return next;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const next = prev < mockFiles.length - 1 ? prev + 1 : 0;
          playClick('default');
          return next;
        });
      } else if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        playClick('enter');
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  const selectedFile = mockFiles[selectedIndex];

  return (
    <div className="flex flex-col h-full font-mono select-none" style={{ color: terminalTheme }}>
      {/* Header */}
      <div className="flex justify-between items-center bg-[#1e1e2e]/80 px-4 py-2 border-b border-slate-800 text-xs">
        <span className="font-bold">📂 AliOS CLI Ranger - File Explorer</span>
        <span>Press <span className="font-bold text-white">[ESC] / [q]</span> to exit</span>
      </div>

      {/* Main Split Pane */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left: Files Column */}
        <div className="border-r border-slate-800 p-4 overflow-y-auto space-y-1.5 bg-[#0a0a10]/40">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Directory: /home/guest</div>
          {mockFiles.map((file, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={file.name}
                onClick={() => {
                  setSelectedIndex(idx);
                  playClick('default');
                }}
                className={`flex items-center justify-between px-3 py-1.5 rounded cursor-pointer transition-colors text-xs ${
                  isSelected 
                    ? 'text-black font-bold' 
                    : 'text-slate-300 hover:bg-slate-900/60'
                }`}
                style={{ backgroundColor: isSelected ? terminalTheme : undefined }}
              >
                <div className="flex items-center gap-2">
                  <span>{file.type === 'image' ? '🖼️' : file.type === 'script' ? '⚡' : '📄'}</span>
                  <span>{file.name}</span>
                </div>
                <span className={`text-[10px] ${isSelected ? 'text-black' : 'text-slate-500'}`}>{file.size}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Preview Column */}
        <div className="p-4 overflow-y-auto flex flex-col justify-between bg-[#030307]/50">
          <div className="space-y-4">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-800/80 pb-1 flex justify-between">
              <span>File Details</span>
              <span className="text-white font-bold">{selectedFile.name}</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold italic">{selectedFile.desc}</p>
              <div className="border border-slate-900 bg-black/40 p-3 rounded text-xs leading-relaxed overflow-x-auto text-slate-300 max-h-[250px] whitespace-pre-wrap">
                {filesContent[selectedFile.name as keyof typeof filesContent]}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-600 border-t border-slate-900 pt-2 mt-4">
            <span>Navigation: [↑/↓] Select file | [ESC] Exit Ranger</span>
          </div>
        </div>
      </div>
    </div>
  );
}
