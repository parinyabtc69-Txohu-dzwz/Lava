import React, { useState, useEffect } from 'react';
import { Power, User, Eye, EyeOff } from 'lucide-react';

const Header = ({ focusMode, setFocusMode }) => {

  return (
    <header className="glass-panel px-6 py-4 flex items-center justify-between z-10 relative">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-neonCyan/30 bg-slate-900 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          <Power className="w-5 h-5 text-neonCyan" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-widest text-slate-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">LAVA OS</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-green-400/80 uppercase tracking-wider font-semibold">ระบบทำงานปกติ</span>
          </div>
        </div>
      </div>



      {/* Right */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setFocusMode(!focusMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-semibold transition-all duration-300 ${
            focusMode 
            ? 'border-neonPurple text-neonPurple shadow-[0_0_10px_rgba(138,43,226,0.3)] bg-neonPurple/10' 
            : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          {focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="hidden sm:inline">{focusMode ? 'โหมดโฟกัส: เปิด' : 'โหมดโฟกัส: ปิด'}</span>
        </button>
        <button className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center hover:border-neonPurple hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all duration-300">
          <User className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </header>
  );
};

export default Header;
