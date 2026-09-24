import React, { useState, useEffect, useRef } from 'react';
import { Mic, Search, Loader2 } from 'lucide-react';
import assistantImg from '../assets/assistant.jpg';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('สวัสดีค่ะ ฉันคือ อลิส');
  const recognitionRef = useRef(null);

  useEffect(() => {
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
      speak('สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ?');
    } else if (lowerText.includes('เวลา')) {
      const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      speak(`ตอนนี้ ${timeStr} นาฬิกาค่ะ`);
    } else {
      speak(`ไม่เข้าใจค่ะ ลองสั่งให้ค้นหาดูนะคะ`);
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
    <div className="glass-panel p-4 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
      
      {/* Background ambient continuous pulse */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] pointer-events-none transition-all duration-700 animate-pulse ${isListening ? 'bg-neonCyan/40' : 'bg-neonPurple/20'}`}></div>

      <div className="text-center z-10 w-full flex flex-col items-center">
        
        {/* Holographic 3D Avatar Container with continuous float & spin */}
        <div 
          onClick={toggleListening}
          className="relative w-36 h-36 flex items-center justify-center cursor-pointer mb-2"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        >
          {/* Continuous spinning outer rings */}
          <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-neonCyan/50 opacity-60 animate-[spin_8s_linear_infinite]"></div>
          <div className="absolute inset-[-8px] rounded-full border-b-2 border-r-2 border-neonPurple/50 opacity-40 animate-[spin_12s_linear_infinite_reverse]"></div>
          <div className="absolute inset-[-16px] rounded-full border-t border-neonCyan/30 opacity-30 animate-[spin_20s_linear_infinite]"></div>

          <div className={`relative w-32 h-32 rounded-full overflow-hidden shadow-2xl mix-blend-screen bg-slate-900 transition-all duration-300 ${isListening ? 'shadow-[0_0_40px_rgba(0,255,255,0.6)] border border-neonCyan' : 'shadow-[0_0_20px_rgba(138,43,226,0.4)] border border-neonPurple/40 group-hover:border-neonCyan'}`}>
            <img 
              src={assistantImg} 
              alt="AI Core" 
              className={`w-full h-full object-cover mix-blend-screen transition-transform duration-[2000ms] ${isListening ? 'scale-110' : 'scale-100'}`}
              style={{ filter: 'brightness(1.4) contrast(1.1)' }}
            />
            
            {/* Overlay Mic Icon */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${isListening ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
               {isListening ? (
                 <Loader2 className="w-8 h-8 text-neonCyan animate-spin drop-shadow-[0_0_8px_rgba(0,255,255,1)]" />
               ) : (
                 <Mic className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
               )}
            </div>
          </div>
        </div>

        <h2 className="text-sm font-bold tracking-wider uppercase mt-2 mb-1 bg-gradient-to-r from-neonCyan to-neonPurple bg-clip-text text-transparent flex items-center gap-1">
           <Mic className={`w-4 h-4 ${isListening ? 'text-neonCyan animate-pulse' : 'text-neonPurple'}`} />
           Alice
        </h2>

        {/* Reply text box */}
        <div className="w-full h-10 flex items-center justify-center text-xs font-medium text-slate-200 px-2 text-center bg-slate-900/60 rounded-lg border border-slate-700/50">
           {reply}
        </div>

        {/* Transcript text box */}
        {transcript && (
          <div className="mt-1 text-[10px] text-neonCyan font-mono italic max-w-full truncate px-2">
             "{transcript}"
          </div>
        )}
      </div>
      
      {/* Inline styles for float animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;