import React, { useState, useEffect } from 'react';
import { StickyNote, Check, Trash2, Plus } from 'lucide-react';

const QuickNotes = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('lavaos_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      { id: 1, text: 'ยินดีต้อนรับสู่ LAVA OS', completed: false },
      { id: 2, text: 'ทดลองเพิ่มโน้ตใหม่ที่นี่', completed: false }
    ];
  });
  
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('lavaos_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newNote = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setNotes([newNote, ...notes]);
    setInputValue('');
  };

  const toggleNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="glass-panel p-5 flex flex-col gap-4 min-h-[300px] max-h-[400px]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-neonPurple" /> บันทึกภารกิจสายลับ
        </h2>
        <span className="text-xs text-slate-500 font-mono">{notes.length} รายการ</span>
      </div>
      
      <form onSubmit={addNote} className="flex gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="พิมพ์เพื่อเพิ่มภารกิจ..."
          className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-neonPurple transition-colors"
        />
        <button 
          type="submit"
          className="bg-neonPurple/20 hover:bg-neonPurple/40 text-neonPurple border border-neonPurple/50 rounded-lg p-2 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
        {notes.map(note => (
          <div 
            key={note.id} 
            className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
              note.completed 
                ? 'bg-slate-900/50 border-slate-800 opacity-60' 
                : 'bg-slate-800/40 border-slate-700/50 hover:border-neonPurple/50'
            }`}
          >
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => toggleNote(note.id)}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                note.completed 
                  ? 'bg-neonCyan/20 border-neonCyan text-neonCyan' 
                  : 'bg-slate-900 border-slate-600 group-hover:border-neonPurple'
              }`}>
                {note.completed && <Check className="w-3 h-3" />}
              </div>
              <span className={`text-sm transition-all ${note.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                {note.text}
              </span>
            </div>
            
            <button 
              onClick={() => deleteNote(note.id)}
              className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-4">
            ไม่มีภารกิจค้างอยู่
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickNotes;
