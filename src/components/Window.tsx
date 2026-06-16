'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { playSwoosh } from './sound';

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  icon?: React.ReactNode;
  themeColor?: string;
  children: React.ReactNode;
}

export default function Window({
  title,
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  initialX = 100,
  initialY = 80,
  initialWidth = 640,
  initialHeight = 440,
  icon,
  themeColor,
  children,
}: WindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement | null>(null);

  // Focus window on click
  const handleMouseDown = () => {
    onFocus();
  };

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMaximized) return;
    onFocus();
    setIsDragging(true);
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      dragStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        posX: position.x,
        posY: position.y,
      };
    }
  };

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    onFocus();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchResizeStart = (e: React.TouchEvent) => {
    onFocus();
    setIsResizing(true);
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      resizeStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        width: size.width,
        height: size.height,
      };
    }
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        
        // Bounds checking (keep window headers accessible)
        const newX = Math.max(0, Math.min(window.innerWidth - 100, dragStart.current.posX + dx));
        const newY = Math.max(0, Math.min(window.innerHeight - 40, dragStart.current.posY + dy));
        
        setPosition({ x: newX, y: newY });
      }
      
      if (isResizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        
        const newWidth = Math.max(300, resizeStart.current.width + dx);
        const newHeight = Math.max(200, resizeStart.current.height + dy);
        
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      
      if (isDragging) {
        const dx = touch.clientX - dragStart.current.x;
        const dy = touch.clientY - dragStart.current.y;
        
        const newX = Math.max(0, Math.min(window.innerWidth - 100, dragStart.current.posX + dx));
        const newY = Math.max(0, Math.min(window.innerHeight - 40, dragStart.current.posY + dy));
        
        setPosition({ x: newX, y: newY });
      }
      
      if (isResizing) {
        const dx = touch.clientX - resizeStart.current.x;
        const dy = touch.clientY - resizeStart.current.y;
        
        const newWidth = Math.max(300, resizeStart.current.width + dx);
        const newHeight = Math.max(200, resizeStart.current.height + dy);
        
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, isResizing]);

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      onMouseDown={handleMouseDown}
      className={`absolute flex flex-col rounded-xl border bg-[#0a0a16]/85 backdrop-blur-xl ${
        isDragging || isResizing ? 'transition-none' : 'transition-all duration-300 ease-out'
      } overflow-hidden window-open-animate ${
        isMaximized 
          ? 'left-0 top-12 w-full h-[calc(100vh-80px)] rounded-none border-none' 
          : ''
      }`}
      style={{
        zIndex: zIndex,
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? '48px' : `${position.y}px`,
        width: isMaximized ? '100%' : `${size.width}px`,
        height: isMaximized ? 'calc(100vh - 80px)' : `${size.height}px`,
        borderColor: themeColor ? `${themeColor}35` : 'rgba(139, 92, 246, 0.25)',
        boxShadow: themeColor 
          ? `0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 25px -4px ${themeColor}20, 0 0 1px 1px rgba(255, 255, 255, 0.05) inset` 
          : `0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05) inset`
      }}
    >
      {/* Linux GNOME / Ubuntu style Titlebar */}
      <div
        className="h-10 bg-[#05050e]/95 px-4 flex items-center justify-between cursor-move select-none border-b"
        style={{ borderBottomColor: themeColor ? `${themeColor}15` : 'rgba(139, 92, 246, 0.1)' }}
        onMouseDown={handleDragStart}
        onTouchStart={handleTouchStart}
        onDoubleClick={() => {
          playSwoosh();
          setIsMaximized(!isMaximized);
        }}
      >
        <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
          {icon && <span className="text-slate-400 flex items-center">{icon}</span>}
          <span>{title}</span>
        </div>

        {/* Windows Controls (Ubuntu style circles on right, or clean minimalist) */}
        <div className="flex items-center gap-2">
          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSwoosh();
              onMinimize();
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Minimize"
          >
            <Minus size={12} />
          </button>
          
          {/* Maximize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSwoosh();
              setIsMaximized(!isMaximized);
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isMaximized ? "Restore Down" : "Maximize"}
          >
            <Square size={10} />
          </button>
          
          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSwoosh();
              onClose();
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500/80 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 text-slate-200 no-scrollbar select-text bg-[#03030b]/25">
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeStart}
          onTouchStart={handleTouchResizeStart}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 pointer-events-auto"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" className="text-slate-500 opacity-60">
            <line x1="6" y1="0" x2="6" y2="8" stroke="currentColor" strokeWidth="1" />
            <line x1="3" y1="3" x2="8" y2="3" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
  );
}
