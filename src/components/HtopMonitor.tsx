'use client';

import React, { useState, useEffect } from 'react';
import { playClick } from './sound';

interface HtopMonitorProps {
  onExit: () => void;
  terminalTheme: string;
}

interface Process {
  pid: number;
  user: string;
  pr: number;
  ni: number;
  virt: string;
  res: string;
  shr: string;
  s: string;
  cpu: number;
  mem: number;
  time: string;
  command: string;
}

export default function HtopMonitor({ onExit, terminalTheme }: HtopMonitorProps) {
  const [cpuUsage, setCpuUsage] = useState(25.4);
  const [memUsage, setMemUsage] = useState(54.2);
  const [uptime, setUptime] = useState('00:00:00');
  const [processes, setProcesses] = useState<Process[]>([
    { pid: 1420, user: 'guest', pr: 20, ni: 0, virt: '12.4G', res: '234M', shr: '45M', s: 'S', cpu: 4.2, mem: 8.5, time: '0:12.45', command: 'next dev --port 3000' },
    { pid: 840, user: 'root', pr: 20, ni: 0, virt: '4.2G', res: '512M', shr: '84M', s: 'S', cpu: 1.2, mem: 12.0, time: '1:02.14', command: 'dockerd --group docker' },
    { pid: 2191, user: 'guest', pr: 20, ni: 0, virt: '2.5G', res: '184M', shr: '28M', s: 'S', cpu: 0.8, mem: 6.2, time: '0:03.92', command: 'python manage.py runserver' },
    { pid: 3102, user: 'guest', pr: 20, ni: 0, virt: '6.4G', res: '612M', shr: '112M', s: 'R', cpu: 5.6, mem: 18.4, time: '2:15.36', command: 'flutter run -d chrome' },
    { pid: 4890, user: 'guest', pr: 20, ni: 0, virt: '512M', res: '12M', shr: '4M', s: 'S', cpu: 0.0, mem: 0.5, time: '0:00.02', command: 'cowsay Hello Ali Sajjad' },
    { pid: 5040, user: 'guest', pr: 20, ni: 0, virt: '1.2G', res: '45M', shr: '12M', s: 'S', cpu: 2.5, mem: 2.1, time: '0:00.84', command: 'matrix-rain --saver' },
    { pid: 1045, user: 'root', pr: 20, ni: 0, virt: '256M', res: '8M', shr: '2M', s: 'S', cpu: 0.0, mem: 0.2, time: '0:00.00', command: 'syslogd' }
  ]);

  // Handle keys (q or ESC to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
        playClick();
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // Tick simulation loop
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      // Fluctuate CPU
      const totalCpu = +(15 + Math.random() * 45).toFixed(1);
      setCpuUsage(totalCpu);

      // Fluctuate Memory slightly
      setMemUsage(+(54.0 + Math.random() * 0.8).toFixed(1));

      // Update Uptime
      const diff = Date.now() - startTime;
      const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setUptime(`${hours}:${mins}:${secs}`);

      // Fluctuate processes cpu
      setProcesses(prev => 
        prev.map(p => {
          if (p.command.includes('next dev')) return { ...p, cpu: +(2.0 + Math.random() * 6.0).toFixed(1) };
          if (p.command.includes('flutter run')) return { ...p, cpu: +(3.0 + Math.random() * 10.0).toFixed(1) };
          if (p.command.includes('python')) return { ...p, cpu: +(0.2 + Math.random() * 2.0).toFixed(1) };
          if (p.command.includes('matrix-rain')) return { ...p, cpu: +(1.5 + Math.random() * 3.0).toFixed(1) };
          return p;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Generate ASCII progress bar
  const getProgressBar = (percentage: number) => {
    const barWidth = 25;
    const filledCount = Math.round((percentage / 100) * barWidth);
    const filled = '|'.repeat(filledCount);
    const empty = ' '.repeat(barWidth - filledCount);
    return `[${filled}${empty}] ${percentage}%`;
  };

  return (
    <div className="h-full flex flex-col font-mono text-xs select-none p-4" style={{ color: terminalTheme }}>
      {/* Header System info */}
      <div className="grid md:grid-cols-2 gap-4 border-b border-slate-800 pb-3 mb-3">
        <div className="space-y-1">
          <div><span className="font-semibold text-slate-400">1</span> {getProgressBar(cpuUsage)}</div>
          <div><span className="font-semibold text-slate-400">Mem</span> {getProgressBar(memUsage)}</div>
        </div>
        <div className="space-y-1 text-slate-400">
          <div><span className="font-semibold text-white">Tasks</span>: 7 total, 1 running, 6 sleeping</div>
          <div><span className="font-semibold text-white">Uptime</span>: {uptime}</div>
          <div><span className="font-semibold text-white">Interactive Shell</span>: press [q] or [ESC] to quit</div>
        </div>
      </div>

      {/* Main process table */}
      <div className="flex-1 overflow-auto bg-black/40 border border-slate-900 rounded no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#11111b] text-slate-300 font-bold border-b border-slate-800">
              <th className="p-1 px-2">PID</th>
              <th className="p-1">USER</th>
              <th className="p-1">PR</th>
              <th className="p-1">NI</th>
              <th className="p-1">VIRT</th>
              <th className="p-1">RES</th>
              <th className="p-1">SHR</th>
              <th className="p-1">S</th>
              <th className="p-1">%CPU</th>
              <th className="p-1">%MEM</th>
              <th className="p-1">TIME+</th>
              <th className="p-1">COMMAND</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(p => (
              <tr key={p.pid} className="hover:bg-slate-900/40 text-slate-300 border-b border-slate-900/30">
                <td className="p-1 px-2 text-yellow-400">{p.pid}</td>
                <td className="p-1 text-green-400">{p.user}</td>
                <td className="p-1">{p.pr}</td>
                <td className="p-1">{p.ni}</td>
                <td className="p-1">{p.virt}</td>
                <td className="p-1">{p.res}</td>
                <td className="p-1">{p.shr}</td>
                <td className="p-1" style={{ color: p.s === 'R' ? terminalTheme : undefined }}>{p.s}</td>
                <td className="p-1 font-bold" style={{ color: p.cpu > 2 ? terminalTheme : undefined }}>{p.cpu}</td>
                <td className="p-1">{p.mem}</td>
                <td className="p-1">{p.time}</td>
                <td className="p-1 text-white truncate max-w-xs" title={p.command}>{p.command}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
