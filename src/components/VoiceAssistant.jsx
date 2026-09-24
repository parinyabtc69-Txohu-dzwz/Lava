import React, { useState, useEffect, useRef } from 'react';
import { Mic, Search, Loader2, Sparkles, Hexagon } from 'lucide-react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('Cyberpunk Hex-Core Online');
  const [particles, setParticles] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Generate Random Particles
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 4 + 3}s`,
      delay: `${Math.random() * 5}s`,
      xMove: `${(Math.random() - 0.5) * 150}px`,
      yMove: `${(Math.random() - 0.5) * 150}px`,
    }));
    setParticles(newParticles);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'th-TH';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setReply('กำลังประมวลผลคำสั่ง...');
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleCommand(text);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setReply('ข้อผิดพลาด: สัญญาณเสียงไม่ชัดเจน');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speak = (text) => {
    setReply(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 1.0;
      utterance.pitch = 0.9; // Slightly lower pitch for cyberpunk feel
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = (text) => {
    const lowerText = text.toLowerCase();
    const searchKeywords = ['ค้นหา', 'หา', 'เสิร์ช', 'ค้น', 'google'];
    let isSearch = false;
    let query = '';

    for (const keyword of searchKeywords) {
      if (lowerText.includes(keyword)) {
        isSearch = true;
        const parts = lowerText.split(keyword);
        query = parts[parts.length - 1].trim();
        if (query === '' && parts.length > 1) {
             query = parts[0].trim();
        }
        break;
      }
    }

    if (isSearch && query) {
      speak(`ค้นหาข้อมูล: ${query}`);
      setTimeout(() => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      }, 1500);
      return;
    }
    if (isSearch && !query) {
      speak('ระบุพารามิเตอร์การค้นหาด้วยครับ');
      return;
    }

    if (lowerText.includes('สวัสดี') || lowerText.includes('ดีจ้า')) {
      speak('สวัสดี ฉันคือ อลิส AI ส่วนกลางของ LAVA OS');
    } else if (lowerText.includes('เวลา')) {
      const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      speak(`เวลาในระบบขณะนี้ ${timeStr}`);
    } else {
      speak(`ไม่พบคำสั่งในระบบ ฐานข้อมูล`);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const HexagonSVG = ({ className, color }) => (
    <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full ${className}`} style={{ overflow: 'visible' }}>
      <polygon 
        points="50,3 91,26 91,74 50,97 9,74 9,26" 
        fill="none" 
        stroke={color} 
        strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  );

  return (
    <div className="glass-panel glass-panel w-full flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden group bg-slate-950/80">
      
      {/* Background ambient continuous pulse */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 animate-pulse ${isListening ? 'bg-cyan-500/30' : 'bg-fuchsia-600/20'}`}></div>

      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.2)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      <div className="text-center z-10 w-full flex flex-col items-center justify-center">
        
        {/* TRUE 3D CYBERPUNK HEXAGON CORE */}
        <div 
          onClick={toggleListening}
          className="relative w-56 h-56 flex items-center justify-center cursor-pointer mb-6"
          style={{ perspective: '1200px' }}
        >
          {/* Particles Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {particles.map(p => (
              <div
                key={p.id}
                className={`absolute transition-colors duration-500 ${isListening ? 'bg-cyan-400' : 'bg-fuchsia-500'}`}
                style={{
                  width: p.size,
                  height: p.size,
                  top: p.top,
                  left: p.left,
                  opacity: 0,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', // Hexagon particles
                  boxShadow: `0 0 ${p.size * 3}px ${isListening ? '#22d3ee' : '#d946ef'}`,
                  animation: `float-particle ${p.duration} ease-in-out infinite ${p.delay}`,
                  '--x-move': p.xMove,
                  '--y-move': p.yMove,
                }}
              />
            ))}
          </div>

          {/* Core container with float */}
          <div className="relative w-full h-full z-10" style={{ animation: 'float 4s ease-in-out infinite', transformStyle: 'preserve-3d' }}>
            
            {/* Inner Glowing Hexagon Orb */}
            <div 
              className={`absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300 flex items-center justify-center ${isListening ? 'scale-125' : 'scale-100'}`}
            >
               <Hexagon className={`w-full h-full ${isListening ? 'text-white fill-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,1)] animate-pulse' : 'text-cyan-400 fill-cyan-900/50 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]'}`} strokeWidth={1} />
            </div>
            
            {/* 3D Hexagon Shields */}
            <div className="absolute inset-0" style={{ animation: 'spin3D_X 8s linear infinite', transformStyle: 'preserve-3d' }}>
               <HexagonSVG className="scale-100 opacity-80" color="#22d3ee" />
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2 bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
            </div>
            
            <div className="absolute inset-4" style={{ animation: 'spin3D_Y 12s linear infinite reverse', transformStyle: 'preserve-3d' }}>
               <HexagonSVG className="scale-100 opacity-60" color="#d946ef" />
               <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-8 bg-fuchsia-400 shadow-[0_0_15px_#d946ef]"></div>
            </div>
            
            <div className="absolute inset-10" style={{ animation: 'spin3D_Z 16s linear infinite', transformStyle: 'preserve-3d' }}>
               <HexagonSVG className="scale-100 opacity-40 border-dotted" color="#e2e8f0" />
            </div>
            
            <div className="absolute inset-16" style={{ animation: 'spin3D_XY 20s linear infinite', transformStyle: 'preserve-3d' }}>
               <HexagonSVG className="scale-100 opacity-30" color="#22d3ee" />
               <HexagonSVG className="scale-105 opacity-20" color="#d946ef" style={{ transform: 'rotate(30deg)' }} />
            </div>

            {/* Status Icon Hovering in Front */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(100px)' }}>
               {isListening ? (
                 <Loader2 className="w-10 h-10 text-white animate-spin drop-shadow-[0_0_15px_rgba(255,255,255,1)]" />
               ) : (
                 <Mic className="w-10 h-10 text-cyan-200 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] group-hover:scale-110 transition-transform duration-300" />
               )}
            </div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-[0.3em] uppercase mb-4 bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500 bg-clip-text text-transparent flex items-center gap-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
           <Hexagon className={`w-5 h-5 sm:w-6 sm:h-6 ${isListening ? 'text-cyan-400 animate-ping' : 'text-fuchsia-500'}`} />
           SYS.ALICE.HEX
        </h2>

        {/* Reply text box - Cyberpunk style */}
        <div className="w-[90%] max-w-md min-h-[60px] flex items-center justify-center text-base font-bold text-cyan-50 px-6 py-3 text-center bg-slate-900/80 backdrop-blur-xl border-l-4 border-l-cyan-400 border-r-4 border-r-fuchsia-500 border-t border-b border-slate-700 shadow-[0_0_30px_rgba(34,211,238,0.15)] rounded-none relative">
           {/* Cyberpunk corner cuts fake effect */}
           <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-fuchsia-500"></div>
           {reply}
        </div>

        {/* Transcript text box */}
        {transcript && (
          <div className="mt-4 text-xs text-cyan-400 font-mono tracking-wider max-w-md w-full truncate px-4 bg-slate-900/50 py-2 border border-cyan-500/30">
             <span className="opacity-50 text-fuchsia-400">INPUT &gt; </span> {transcript}
          </div>
        )}
      </div>
      
      {/* Keyframes for TRUE 3D spinning and Hex Particles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-particle {
          0% { transform: translate(0, 0) scale(0.5) rotate(0deg); opacity: 0; }
          40% { opacity: 0.8; }
          50% { transform: translate(var(--x-move), var(--y-move)) scale(1.5) rotate(180deg); opacity: 1; }
          60% { opacity: 0.8; }
          100% { transform: translate(calc(var(--x-move) * 2), calc(var(--y-move) * 2)) scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes spin3D_X {
          0% { transform: rotateX(0deg) rotateY(60deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(60deg) rotateZ(180deg); }
        }
        @keyframes spin3D_Y {
          0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(60deg) rotateY(360deg) rotateZ(-180deg); }
        }
        @keyframes spin3D_Z {
          0% { transform: rotateX(75deg) rotateY(75deg) rotateZ(0deg); }
          100% { transform: rotateX(75deg) rotateY(75deg) rotateZ(360deg); }
        }
        @keyframes spin3D_XY {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;