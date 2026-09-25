import React from 'react';
import { Folder, ExternalLink, Server } from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'FaCiLiTy V6',
    description: 'ระบบจองห้องประชุมและสิ่งอำนวยความสะดวก',
    path: 'https://fa-ci-li-ty.vercel.app/',
    status: 'Online',
    color: 'text-neonCyan',
    bg: 'bg-neonCyan/10',
    border: 'border-neonCyan/30'
  },
  {
    id: 2,
    name: 'Line Queue Booking',
    description: 'ระบบจองคิวผ่าน Line (5 รอบเวลา)',
    path: 'https://queue-booking-dun.vercel.app/index.html',
    status: 'Online',
    color: 'text-neonCyan',
    bg: 'bg-neonCyan/10',
    border: 'border-neonCyan/30'
  },
  {
    id: 3,
    name: 'ClassManager',
    description: 'ระบบเช็คชื่อนักเรียน (Google Apps Script)',
    path: 'https://script.google.com/macros/s/AKfycbwiS0qu_jNZFt3EGYJKooeS63wl_Xa6vfBWFz1V3xRVSixUNpd5kaQYFUcX9IqN5qjTfg/exec',
    status: 'Online',
    color: 'text-neonCyan',
    bg: 'bg-neonCyan/10',
    border: 'border-neonCyan/30'
  },
  {
    id: 4,
    name: 'Lesson Plan Generator',
    description: 'AI Teaching Assistant สร้างแผนการสอนอัตโนมัติ',
    path: 'lavaos://start',
    status: 'Local',
    color: 'text-neonPurple',
    bg: 'bg-neonPurple/10',
    border: 'border-neonPurple/30'
  }
];

const ProjectHub = () => {
  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
          <Folder className="w-4 h-4 text-neonCyan" /> แฟ้มโปรเจกต์ (Project Hub)
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-4 rounded-xl border ${project.border} ${project.bg} flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Server className={`w-5 h-5 ${project.color}`} />
                <h3 className={`font-bold tracking-wide ${project.status === 'Active' ? 'text-slate-100' : 'text-slate-300'}`}>
                  {project.name}
                </h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${project.status === 'Online'
                ? 'border-green-500/50 text-green-400 bg-green-500/10'
                : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                }`}>
                {project.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">
              {project.description}
            </p>

            <div className="mt-auto pt-3 border-t border-slate-700/50 flex items-center justify-between">
              <code className="text-[9px] text-slate-500 truncate max-w-[65%] font-mono" title={project.path}>
                {project.path.startsWith('http') ? new URL(project.path).hostname : 'Local App Script'}
              </code>
              <a
                href={project.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${project.status === 'Online'
                  ? 'bg-neonCyan/20 text-neonCyan hover:bg-neonCyan hover:text-slate-900'
                  : 'bg-neonPurple/20 text-neonPurple hover:bg-neonPurple hover:text-slate-900'
                  }`}
              >
                เปิดลิงก์ <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectHub;
