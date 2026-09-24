import React from 'react';
import { Calendar, Code, BarChart2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const Growth = () => {
  // Calculate day of year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const isLeapYear = now.getFullYear() % 4 === 0 && (now.getFullYear() % 100 !== 0 || now.getFullYear() % 400 === 0);
  const daysInYear = isLeapYear ? 366 : 365;
  const yearProgress = ((dayOfYear / daysInYear) * 100).toFixed(1);

  const skills = [
    { name: 'React', progress: 85, color: 'bg-neonCyan', shadow: 'shadow-[0_0_10px_rgba(0,255,255,0.8)]' },
    { name: 'TypeScript', progress: 70, color: 'bg-blue-500', shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.8)]' },
    { name: 'Python', progress: 60, color: 'bg-yellow-400', shadow: 'shadow-[0_0_10px_rgba(250,204,21,0.8)]' },
    { name: 'Database', progress: 45, color: 'bg-neonPurple', shadow: 'shadow-[0_0_10px_rgba(138,43,226,0.8)]' },
  ];

  const chartData = [
    { name: 'Jan', val: 10 },
    { name: 'Feb', val: 15 },
    { name: 'Mar', val: 28 },
    { name: 'Apr', val: 22 },
    { name: 'May', val: 35 },
    { name: 'Jun', val: 45 },
  ];

  return (
    <>
      {/* Life Progress */}
      <div className="glass-panel p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" /> ความคืบหน้าชีวิต
          </h2>
        </div>
        
        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">ปี {now.getFullYear()}</div>
              <div className="text-xl font-bold text-slate-200">วันที่ {dayOfYear} <span className="text-sm font-normal text-slate-500">/ {daysInYear}</span></div>
            </div>
            <div className="text-sm font-bold text-neonCyan">{yearProgress}%</div>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-neonCyan h-full rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]" 
              style={{ width: `${yearProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Coding & Skills */}
      <div className="glass-panel p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
            <Code className="w-4 h-4 text-slate-400" /> การเขียนโค้ด & ทักษะ
          </h2>
        </div>
        
        <div className="flex flex-col gap-4">
          {skills.map(skill => (
            <div key={skill.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{skill.name}</span>
                <span className="text-slate-500">{skill.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`${skill.color} h-full rounded-full ${skill.shadow}`} 
                  style={{ width: `${skill.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Growth */}
      <div className="glass-panel p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold tracking-wider uppercase text-neonPurple flex items-center gap-2">
            <BarChart2 className="w-4 h-4" /> การเติบโตธุรกิจ
          </h2>
        </div>
        
        <div className="flex-1 w-full min-h-[120px] -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#1E293B', borderRadius: '8px' }}
                itemStyle={{ color: '#00FFFF' }}
              />
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke="#8A2BE2" 
                strokeWidth={3} 
                dot={{ fill: '#0B0E14', stroke: '#8A2BE2', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#00FFFF', stroke: '#00FFFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Growth;
