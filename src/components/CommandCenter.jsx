import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Eye, EyeOff, User, TrendingUp, Brain } from 'lucide-react';
import Growth from './Growth';
import WealthMind from './WealthMind';

const scheduleData = [
  {
    day: 'จันทร์',
    color: 'text-yellow-400',
    slots: [
      { span: 1, text: 'Home Room\nปวช.3/1\nห้อง 405' },
      { span: 2, text: 'การพัฒนาโปรแกรมบนอุปกรณ์พกพาเบื้องต้น\nปวช.3/3\nห้อง 203' },
      { span: 1, text: '' },
      { span: 1, text: '', isLunch: true },
      { span: 1, text: 'การพัฒนาโปรแกรมฯ\nปวช.3/3\nห้อง 203' },
      { span: 2, text: 'ดูแลนักเรียนหลังเลิกเรียน\n(ป้อมสแกนบัตร)' },
      { span: 1, text: '' },
    ]
  },
  {
    day: 'อังคาร',
    color: 'text-pink-400',
    slots: [
      { span: 1, text: 'Home Room\nปวช.3/1\nห้อง 405' },
      { span: 2, text: 'โปรแกรมสร้างภาพเคลื่อนไหว\nปวช.2/3\nห้อง 202' },
      { span: 1, text: '' },
      { span: 1, text: '', isLunch: true },
      { span: 1, text: 'โปรแกรมสร้างภาพฯ\nปวช.2/3\nห้อง 202' },
      { span: 2, text: 'โปรแกรมฐานข้อมูล\nปวช.2/3\nห้อง 202' },
      { span: 1, text: '' },
    ]
  },
  {
    day: 'พุธ',
    color: 'text-green-400',
    slots: [
      { span: 1, text: 'Home Room\nปวช.3/1\nห้อง 405' },
      { span: 2, text: 'สื่อโมชั่นกราฟิก\nปวช.2/3\nห้อง 203' },
      { span: 1, text: '' },
      { span: 1, text: '', isLunch: true },
      { span: 1, text: 'สื่อโมชั่นกราฟิก\nปวช.2/3\nห้อง 203' },
      { span: 2, text: 'กิจกรรมฯ (อวท.)\nสาขาเทคโนโลยีธุรกิจดิจิทัล\nโรงอาหาร' },
      { span: 1, text: '' },
    ]
  },
  {
    day: 'พฤหัสบดี',
    color: 'text-orange-400',
    slots: [
      { span: 1, text: 'Home Room\nปวช.3/1\nห้อง 405' },
      { span: 3, text: '' },
      { span: 1, text: 'ดูแลความเรียบร้อย\nภายในวิทยาลัย', isLunch: true },
      { span: 3, text: '' },
      { span: 1, text: 'ดูแลนักเรียนหลังเลิกเรียน\n(ป้อมสแกนบัตร)' },
    ]
  },
  {
    day: 'ศุกร์',
    color: 'text-blue-400',
    slots: [
      { span: 1, text: 'Home Room\nปวช.3/1\nห้อง 405' },
      { span: 3, text: '' },
      { span: 1, text: 'CoWorkingSpace', isLunch: true },
      { span: 1, text: '' },
      { span: 2, text: 'โปรแกรมฐานข้อมูล\nปวช.2/3\nห้อง 202' },
      { span: 1, text: '' },
    ]
  }
];

const timeSlots = [
  '08.10-08.30',
  '08.30-09.30',
  '09.30-10.30',
  '10.30-11.30',
  '11.30-12.30',
  '12.30-13.30',
  '13.30-14.30',
  '14.30-15.30',
  '15.30-16.30',
];

const periods = ['Home Room', '1', '2', '3', '4', '5', '6', '7', '8'];

const CommandCenter = ({ focusMode, setFocusMode }) => {
  const [time, setTime] = useState(new Date());
  const [classStatus, setClassStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateClassStatus = () => {
      const dayOfWeekMap = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
      const currentDayName = dayOfWeekMap[time.getDay()];
      const todaySchedule = scheduleData.find(d => d.day === currentDayName);

      if (!todaySchedule) {
        setClassStatus({ message: 'วันหยุดพักผ่อน (ไม่มีตารางสอน)', color: 'text-slate-400' });
        return;
      }

      let activeSlot = null;
      let nextSlot = null;
      let timeIndex = 0;

      for (let i = 0; i < todaySchedule.slots.length; i++) {
        const slot = todaySchedule.slots[i];
        const span = slot.span;

        if (timeIndex >= timeSlots.length) break;

        const startStr = timeSlots[timeIndex].split('-')[0];
        const endStr = timeSlots[Math.min(timeIndex + span - 1, timeSlots.length - 1)].split('-')[1];

        const parseStrTime = (str) => {
          const [h, m] = str.split('.');
          const d = new Date(time);
          d.setHours(parseInt(h), parseInt(m), 0, 0);
          return d;
        };

        const startTime = parseStrTime(startStr);
        const endTime = parseStrTime(endStr);

        if (time >= startTime && time < endTime) {
          activeSlot = { ...slot, startTime, endTime, isBreak: !slot.text || slot.isLunch };
        } else if (time < startTime && !nextSlot && slot.text && !slot.isLunch) {
          nextSlot = { ...slot, startTime, endTime };
        }

        timeIndex += span;
      }

      const formatTimeDiff = (mins) => {
        if (mins < 60) return `${mins} นาที`;
        const hrs = Math.floor(mins / 60);
        const m = mins % 60;
        return m > 0 ? `${hrs} ชั่วโมง ${m} นาที` : `${hrs} ชั่วโมง`;
      };

      if (activeSlot) {
        if (activeSlot.isBreak) {
          if (nextSlot) {
            const diffMins = Math.ceil((nextSlot.startTime - time) / 60000);
            setClassStatus({ message: `คาบต่อไป: ${nextSlot.text.split('\n')[0]} (ในอีก ${formatTimeDiff(diffMins)})`, color: 'text-orange-400' });
          } else {
            setClassStatus({ message: 'หมดคาบเรียนสำหรับวันนี้แล้ว', color: 'text-slate-400' });
          }
        } else {
          const diffMins = Math.ceil((activeSlot.endTime - time) / 60000);
          setClassStatus({ message: `กำลังสอน: ${activeSlot.text.split('\n')[0]} (เหลือ ${formatTimeDiff(diffMins)})`, color: 'text-green-400' });
        }
      } else if (nextSlot) {
        const diffMins = Math.ceil((nextSlot.startTime - time) / 60000);
        setClassStatus({ message: `คาบแรก: ${nextSlot.text.split('\n')[0]} (ในอีก ${formatTimeDiff(diffMins)})`, color: 'text-orange-400' });
      } else {
        setClassStatus({ message: 'นอกเวลาเรียน', color: 'text-slate-400' });
      }
    };

    updateClassStatus();
  }, [time]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <>
      {/* Mission Control Panel */}
      <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group mb-6 min-h-[180px]">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50"></div>

        {/* LAVA OS Section */}
        <div className="flex flex-col items-center justify-center relative z-10 w-full md:w-1/3">
          <div className="relative w-20 h-20 flex items-center justify-center mb-4">
            <div className="absolute inset-0 rounded-full border border-neonCyan/30 animate-spin-slow"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-neonPurple animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute inset-6 rounded-full bg-slate-900 shadow-[inset_0_0_15px_rgba(0,255,255,0.2)] border border-neonCyan/50 flex items-center justify-center animate-pulse-neon z-10">
              <Activity className="w-6 h-6 text-neonCyan" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] mb-1">LAVA OS</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-green-400/80 uppercase tracking-wider font-semibold">ระบบทำงานปกติ</span>
          </div>
        </div>

        {/* Time Section */}
        <div className="flex flex-col items-center justify-center relative z-10 w-full md:w-1/3 md:border-l md:border-r md:border-slate-700/50">
          <div className="text-xs text-slate-400 font-medium tracking-widest uppercase mb-1">
            {formatDate(time)}
          </div>
          <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple tracking-widest drop-shadow-[0_0_15px_rgba(0,255,255,0.2)] font-mono">
            {formatTime(time)}
          </div>
          {classStatus && (
            <div className={`mt-3 px-3 py-1.5 rounded bg-slate-800/50 border border-slate-700/50 text-xs font-semibold tracking-wide flex items-center justify-center text-center shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] ${classStatus.color}`}>
              {classStatus.message}
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full md:w-1/3">
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-300 ${focusMode
              ? 'border-neonPurple text-neonPurple shadow-[0_0_10px_rgba(138,43,226,0.3)] bg-neonPurple/10'
              : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 bg-slate-900/50'
              }`}
          >
            {focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>โหมดโฟกัส</span>
          </button>
          <button className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center hover:border-neonPurple hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all duration-300">
            <User className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-4 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80 w-fit">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'schedule'
              ? 'bg-neonCyan/20 text-neonCyan border border-neonCyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <Calendar className="w-4 h-4" /> ตารางเรียน
        </button>
        <button
          onClick={() => setActiveTab('growth')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'growth'
              ? 'bg-neonPurple/20 text-neonPurple border border-neonPurple/50 shadow-[0_0_15px_rgba(138,43,226,0.2)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> ทักษะ & การเติบโต
        </button>
        <button
          onClick={() => setActiveTab('mind')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'mind'
              ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.2)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <Brain className="w-4 h-4" /> พัฒนาตนเอง
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'schedule' && (
        <div className="glass-panel p-5 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neonPurple" /> ตารางเรียน ภาคเรียนที่ 1 ปีการศึกษา 2569
            </h2>
            <span className="text-xs text-slate-400 font-medium">อ.ปริญญา ยอดทะเนีย</span>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[1000px] rounded-lg border border-slate-700/50 overflow-hidden">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-800/80">
                    <th className="p-2 border border-slate-700/50 text-xs text-slate-400 font-semibold w-[60px]">วัน/เวลา</th>
                    {timeSlots.map((time, i) => (
                      <th key={i} className="p-2 border border-slate-700/50 text-[10px] text-slate-300 font-mono tracking-tighter">
                        {time}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-slate-800/40">
                    <th className="p-2 border border-slate-700/50 text-xs text-slate-400 font-semibold">คาบที่</th>
                    {periods.map((period, i) => (
                      <th key={i} className="p-2 border border-slate-700/50 text-[11px] text-neonCyan/80 font-bold">
                        {period}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className={`p-2 border border-slate-700/50 text-sm font-bold bg-slate-800/10 ${row.color}`}>
                        {row.day}
                      </td>
                      {row.slots.map((slot, j) => (
                        <td
                          key={j}
                          colSpan={slot.span}
                          className={`p-2 border border-slate-700/50 text-[10px] text-slate-300 whitespace-pre-wrap leading-relaxed transition-colors
                            ${slot.text ? 'bg-slate-800/60 hover:bg-slate-700/60' : ''}
                            ${slot.isLunch ? 'bg-green-900/20 shadow-[inset_0_0_10px_rgba(74,222,128,0.1)]' : ''}
                          `}
                        >
                          {slot.text}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'growth' && (
        <div className="flex flex-col gap-6">
          <Growth />
        </div>
      )}

      {activeTab === 'mind' && (
        <div className="flex flex-col gap-6">
          <WealthMind />
        </div>
      )}
    </>
  );
};

export default CommandCenter;
