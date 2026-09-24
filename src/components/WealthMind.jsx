import React from 'react';
import { BookOpen, Brain, Zap } from 'lucide-react';

const WealthMind = () => {
  return (
    <div className="glass-panel p-5 flex flex-col gap-4 h-full relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neonPurple/5 rounded-full blur-[40px] pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
        <h2 className="text-sm font-bold tracking-wider uppercase text-neonPurple flex items-center gap-2">
          <Brain className="w-4 h-4" /> การพัฒนาตนเอง (Self Growth)
        </h2>
      </div>
      
      {/* Current Book */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 group hover:border-neonPurple/50 transition-all duration-300 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-16 bg-slate-800 rounded-md border border-slate-700 flex-shrink-0 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] group-hover:border-neonPurple/40 transition-all duration-300">
            <BookOpen className="w-6 h-6 text-slate-500 group-hover:text-neonPurple transition-colors duration-300" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-neonPurple uppercase tracking-widest font-semibold mb-1">กำลังอ่าน (Reading)</div>
            <div className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">Atomic Habits</div>
            <div className="text-xs text-slate-500">James Clear</div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="mt-1">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-medium">
            <span>ความคืบหน้า 65%</span>
            <span>208 / 320 หน้า</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
            <div className="bg-gradient-to-r from-neonPurple/60 to-neonPurple h-full rounded-full shadow-[0_0_10px_rgba(138,43,226,0.8)] relative" style={{ width: '65%' }}>
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-auto relative z-10">
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 text-center flex flex-col items-center justify-center hover:bg-slate-800/60 transition-colors group">
          <div className="text-3xl font-bold text-slate-200 mb-1 drop-shadow-sm group-hover:scale-110 transition-transform duration-300">12</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold group-hover:text-slate-400 transition-colors">เล่ม / ปี</div>
        </div>
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 text-center flex flex-col items-center justify-center hover:bg-slate-800/60 transition-colors relative overflow-hidden group">
          <div className="absolute inset-0 bg-neonCyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Zap className="w-4 h-4 text-neonCyan absolute top-3 right-3 opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="text-3xl font-bold text-neonCyan mb-1 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] group-hover:scale-110 transition-transform duration-300">24</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold group-hover:text-slate-400 transition-colors">ทำต่อเนื่อง (วัน)</div>
        </div>
      </div>
    </div>
  );
};

export default WealthMind;

