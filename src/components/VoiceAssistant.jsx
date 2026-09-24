import React, { useState, useEffect, useRef } from 'react';
import { Mic, Search, Loader2, Sparkles } from 'lucide-react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('ระบบอนุภาคพร้อมทำงานค่ะ');
  const [particles, setParticles] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Generate Random Particles
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
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
        setReply('กำลังฟังอยู่ค่ะ...');
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleCommand(text);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setReply('ขออภัยค่ะ ฉันไม่ค่อยได้ยิน');
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
      utterance.pitch = 1.2;
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
      speak(`กำลังค้นหา ${query} ค่ะ`);
      setTimeout(() => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      }, 1500);
      return;
    }
    if (isSearch && !query) {
      speak('ให้ค้นหาอะไรคะ?');
      return;
    }

    if (lowerText.includes('สวัสดี') || lowerText.includes('ดีจ้า')) {
      speak('สวัสดีค่ะ ฉันคือ อลิส (Alice) ศูนย์กลางระบบของคุณค่ะ');
    } else if (lowerText.includes('เวลา')) {
      const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      speak(`ตอนนี้เวลา ${timeStr} นาฬิกาค่ะ`);
    } else {
      speak(`รับทราบค่ะ แต่คุณไม่ได้สั่งให้ค้นหาข้อมูล`);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="glass-panel w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 relative overflow-hidden group">
      
      {/* Background ambient continuous pulse */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none transition-all duration-1000 animate-pulse ${isListening ? 'bg-neonCyan/40' : 'bg-neonPurple/20'}`}></div>

      <div className="text-center z-10 w-full flex flex-col items-center justify-center">
        
        {/* TRUE 3D HOLOGRAPHIC CORE WITH PARTICLES */}
        <div 
          onClick={toggleListening}
          className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center cursor-pointer mb-8"
          style={{ perspective: '1200px' }}
        >
          {/* Particles Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {particles.map(p => (
              <div
                key={p.id}
                className={`absolute rounded-full transition-colors duration-500 ${isListening ? 'bg-neonCyan' : 'bg-neonPurple'}`}
                style={{
                  width: p.size,
                  height: p.size,
                  top: p.top,
                  left: p.left,
                  opacity: 0,
                  boxShadow: `0 0 ${p.size * 3}px ${isListening ? '#0ff' : '#b0f'}`,
                  animation: `float-particle ${p.duration} ease-in-out infinite ${p.delay}`,
                  '--x-move': p.xMove,
                  '--y-move': p.yMove,
                }}
              />
            ))}
          </div>

          {/* Core container with float */}
          <div className="relative w-full h-full z-10" style={{ animation: 'float 6s ease-in-out infinite', transformStyle: 'preserve-3d' }}>
            
            {/* Inner Glowing Orb */}
            <div className={`absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-500 ${isListening ? 'bg-white shadow-[0_0_80px_30px_rgba(0,255,255,0.9)] scale-125' : 'bg-neonCyan shadow-[0_0_50px_15px_rgba(0,255,255,0.6)]'}`}></div>
            
            {/* 3D Rings */}
            <div className="absolute inset-0 border-2 border-neonCyan/50 rounded-full" style={{ animation: 'spin3D_X 6s linear infinite', transformStyle: 'preserve-3d' }}>
                <div className="absolute -top-1.5 left-1/2 w-4 h-4 bg-neonCyan rounded-full shadow-[0_0_15px_#0ff]"></div>
                <div className="absolute -bottom-1.5 left-1/2 w-4 h-4 bg-neonPurple rounded-full shadow-[0_0_15px_#b0f]"></div>
            </div>
            
            <div className="absolute inset-6 border-[2px] border-neonPurple/60 rounded-full" style={{ animation: 'spin3D_Y 10s linear infinite reverse', transformStyle: 'preserve-3d' }}>
                <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-fuchsia-500 rounded-full shadow-[0_0_10px_#d946ef]"></div>
            </div>
            
            <div className="absolute inset-12 border border-white/30 rounded-full" style={{ animation: 'spin3D_Z 14s linear infinite', transformStyle: 'preserve-3d' }}></div>
            
            <div className="absolute inset-16 border-[4px] border-dotted border-neonCyan/40 rounded-full" style={{ animation: 'spin3D_XY 18s linear infinite', transformStyle: 'preserve-3d' }}></div>

            {/* Status Icon Hovering in Front */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(80px)' }}>
               {isListening ? (
                 <Loader2 className="w-12 h-12 text-white animate-spin drop-shadow-[0_0_20px_rgba(0,255,255,1)]" />
               ) : (
                 <Mic className="w-12 h-12 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] group-hover:scale-110 transition-transform duration-300" />
               )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black tracking-widest uppercase mb-4 bg-gradient-to-r from-neonCyan via-white to-neonPurple bg-clip-text text-transparent flex items-center gap-3 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
           <Sparkles className={`w-6 h-6 ${isListening ? 'text-neonCyan animate-ping' : 'text-neonPurple'}`} />
           Alice AI Core
        </h2>

        {/* Reply text box */}
        <div className="w-[90%] max-w-md min-h-[60px] flex items-center justify-center text-base font-semibold text-white px-6 py-3 text-center bg-black/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
           {reply}
        </div>

        {/* Transcript text box */}
        {transcript && (
          <div className="mt-4 text-sm text-neonCyan font-mono italic max-w-md w-full truncate px-4 bg-black/30 py-2 rounded-lg border border-neonCyan/20">
             <span className="opacity-50">You: </span> "{transcript}"
          </div>
        )}
      </div>
      
      {/* Keyframes for TRUE 3D spinning and Particles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-particle {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          40% { opacity: 0.8; }
          50% { transform: translate(var(--x-move), var(--y-move)) scale(1.5); opacity: 1; }
          60% { opacity: 0.8; }
          100% { transform: translate(calc(var(--x-move) * 2), calc(var(--y-move) * 2)) scale(0); opacity: 0; }
        }
        @keyframes spin3D_X {
          0% { transform: rotateX(0deg) rotateY(60deg); }
          100% { transform: rotateX(360deg) rotateY(60deg); }
        }
        @keyframes spin3D_Y {
          0% { transform: rotateX(60deg) rotateY(0deg); }
          100% { transform: rotateX(60deg) rotateY(360deg); }
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