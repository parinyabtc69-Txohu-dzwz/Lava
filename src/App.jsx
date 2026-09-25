import React, { useState } from 'react';

import CommandCenter from './components/CommandCenter';
import ProjectHub from './components/ProjectHub';
import QuickNotes from './components/QuickNotes';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <div className={`min-h-screen bg-background p-4 md:p-6 lg:p-8 flex flex-col gap-6 transition-all duration-500 ${focusMode ? 'brightness-75' : ''}`}>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column - Assistant & Side Projects (3 col width) */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <VoiceAssistant />
          
          {/* Collapsed/Smaller versions of the side panels via custom flex sizing or max-heights */}
          <div className="flex flex-col gap-6 flex-1 overflow-y-auto max-h-[50vh] pr-1 pb-2 custom-scrollbar">
            <ProjectHub />
            <QuickNotes />
          </div>
        </section>

        {/* Right Column - Command Center (9 col width) */}
        <section className="lg:col-span-9 flex flex-col gap-6">
          <CommandCenter focusMode={focusMode} setFocusMode={setFocusMode} />
        </section>

      </main>
      
      {/* Lo-Fi Focus Music */}
      {focusMode && (
        <iframe 
          width="0" 
          height="0" 
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1&playlist=jfKfPfyJRdk" 
          title="Lo-Fi Beats" 
          frameBorder="0" 
          allow="autoplay" 
          allowFullScreen 
          className="hidden"
        ></iframe>
      )}

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neonPurple/5 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neonCyan/5 blur-[120px]"></div>
      </div>
      
      {/* Scrollbar styling for the collapsed side panel */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(138, 43, 226, 0.5);
        }
      `}</style>
    </div>
  );
}

export default App;