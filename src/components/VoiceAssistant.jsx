import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, BrainCircuit } from 'lucide-react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [reply, setReply] = useState('SYSTEM ONLINE');
  const [particles] = useState(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 5 + 2}s`,
      delay: `${Math.random() * 5}s`,
      xMove: `${(Math.random() - 0.5) * 200}px`,
      yMove: `${(Math.random() - 0.5) * 200}px`,
    }))
  );

  const recognitionRef = useRef(null);
  const handleCommandRef = useRef(null);

  const speak = useCallback((text) => {
    setReply(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // ลบวงเล็บ สัญลักษณ์ และ markdown ที่ทำให้เสียงอ่านผิดเพี้ยน
      const cleanText = text
        .replace(/\([^)]*\)/g, '')
        .replace(/\[[^\]]*\]/g, '')
        .replace(/[*#_~`]/g, '')
        .trim();

      // หั่นข้อความเป็นท่อนสั้น ป้องกันบัก Web Speech API บนเว็บบราวเซอร์
      const chunkSize = 150;
      const chunks = [];
      for (let i = 0; i < cleanText.length; i += chunkSize) {
        chunks.push(cleanText.substring(i, i + chunkSize));
      }

      chunks.forEach((chunk) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = 'th-TH';
        utterance.rate = 1.0;
        utterance.pitch = 0.95;
        window.speechSynthesis.speak(utterance);
      });
    }
  }, []);

  const searchWikipediaFallback = useCallback(async (prompt) => {
    setReply('AI BUSY... SWITCHING TO WIKIPEDIA DATABANKS');
    try {
      const searchUrl = `https://th.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(prompt)}&utf8=&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.query && searchData.query.search.length > 0) {
        const title = searchData.query.search[0].title;
        const pageUrl = `https://th.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&exlimit=1&titles=${encodeURIComponent(title)}&explaintext=1&formatversion=2&format=json&origin=*`;
        const pageRes = await fetch(pageUrl);
        const pageData = await pageRes.json();

        if (pageData.query && pageData.query.pages.length > 0) {
          const extract = pageData.query.pages[0].extract;
          speak(`นำข้อมูลสำรองจากวิกิพีเดียมาให้ค่ะ: ` + extract);
          return;
        }
      }
      speak('ขออภัยค่ะ ไม่พบข้อมูลนี้ในฐานข้อมูลเลยค่ะ');
    } catch {
      speak('ระบบเครือข่ายขัดข้อง ไม่สามารถเชื่อมต่อฐานข้อมูลได้ค่ะ');
    }
  }, [speak]);

  const askGemini = useCallback(async (prompt) => {
    setReply('CONNECTING NEURAL NET...');
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        speak('ยังไม่ได้ระบุ GEMINI API KEY ในระบบค่ะ');
        return;
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "ตอบเป็นภาษาไทยแบบกระชับ เป็นธรรมชาติ เป็นกันเอง ไม่เกิน 3 ประโยค คำถามคือ: " + prompt }] }]
        })
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const answer = data.candidates[0].content.parts[0].text.replace(/\*/g, '');
        speak(answer);
      } else {
        console.error("Gemini Error:", data.error || 'Unknown');
        searchWikipediaFallback(prompt);
      }
    } catch (err) {
      console.error(err);
      searchWikipediaFallback(prompt);
    }
  }, [speak, searchWikipediaFallback]);

  const handleCommand = useCallback((text) => {
    const lowerText = text.toLowerCase().trim();

    if (lowerText.includes('สวัสดี') || lowerText.includes('ดีจ้า') || lowerText.includes('หวัดดี')) {
      speak('สวัสดีค่ะ ฉันคือ อลิส (ALICE) ระบบสมองกลศูนย์กลาง พร้อมช่วยเหลือคุณค่ะ');
    } else if (lowerText.includes('เวลา') || lowerText.includes('กี่โมง')) {
      const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      speak(`เวลาปัจจุบันคือ ${timeStr} ค่ะ`);
    } else {
      askGemini(text);
    }
  }, [speak, askGemini]);

  useEffect(() => {
    handleCommandRef.current = handleCommand;
  }, [handleCommand]);

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
        setReply('LISTENING...');
      };

      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setTranscript(text);
        if (handleCommandRef.current) {
          handleCommandRef.current(text);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setReply('ERROR: SIGNAL LOST');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden group bg-slate-950 rounded-3xl border border-white/5 shadow-2xl">
      {/* Heavy Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none transition-all duration-700 animate-pulse mix-blend-screen ${isListening ? 'bg-cyan-500/40' : 'bg-fuchsia-700/20'}`}></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="text-center z-10 w-full flex flex-col items-center justify-center">
        {/* PREMIUM 3D ABSTRACT AI CORE */}
        <div
          onClick={toggleListening}
          className="relative w-64 h-64 flex items-center justify-center cursor-pointer mb-12 mt-4"
          style={{ perspective: '1000px' }}
        >
          {/* Dust Particles */}
          <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen">
            {particles.map((p) => (
              <div
                key={p.id}
                className={`absolute rounded-full transition-colors duration-700 ${isListening ? 'bg-cyan-300' : 'bg-fuchsia-400'}`}
                style={{
                  width: p.size,
                  height: p.size,
                  top: p.top,
                  left: p.left,
                  opacity: 0,
                  boxShadow: `0 0 ${p.size * 4}px ${isListening ? '#22d3ee' : '#d946ef'}`,
                  animation: `float-particle ${p.duration} ease-in-out infinite ${p.delay}`,
                  '--x-move': p.xMove,
                  '--y-move': p.yMove,
                }}
              />
            ))}
          </div>

          {/* Floating Core Assembly */}
          <div className="relative w-full h-full z-10" style={{ animation: 'float 5s ease-in-out infinite', transformStyle: 'preserve-3d' }}>
            {/* Center Supernova */}
            <div className={`absolute inset-0 m-auto rounded-full transition-all duration-700 mix-blend-screen ${isListening ? 'w-16 h-16 bg-white shadow-[0_0_80px_40px_rgba(34,211,238,0.8)] scale-150 animate-pulse' : 'w-12 h-12 bg-cyan-100 shadow-[0_0_60px_20px_rgba(217,70,239,0.5)] scale-100'}`}>
              <div className="w-full h-full rounded-full animate-ping opacity-50 bg-white"></div>
            </div>

            {/* Inner Geometric Sphere */}
            <div className="absolute inset-16 border-2 border-dashed border-cyan-300/50 rounded-full mix-blend-screen" style={{ animation: 'spin3D_X 4s linear infinite', transformStyle: 'preserve-3d' }}></div>
            <div className="absolute inset-16 border-2 border-dashed border-fuchsia-300/50 rounded-full mix-blend-screen" style={{ animation: 'spin3D_Y 5s linear infinite reverse', transformStyle: 'preserve-3d' }}></div>

            {/* Mid Glowing Halo */}
            <div className={`absolute inset-8 rounded-full border border-white/20 transition-all duration-700 ${isListening ? 'shadow-[inset_0_0_30px_rgba(34,211,238,0.5),0_0_30px_rgba(34,211,238,0.5)] border-cyan-400/50' : 'shadow-[inset_0_0_20px_rgba(217,70,239,0.3),0_0_20px_rgba(217,70,239,0.3)] border-fuchsia-500/30'}`} style={{ animation: 'spin3D_Z 10s linear infinite', transformStyle: 'preserve-3d' }}>
              <div className="absolute -top-2 left-1/2 w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_15px_#fff]"></div>
              <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_15px_#fff]"></div>
            </div>

            {/* Outer Thick Arc 1 */}
            <div className="absolute inset-2 border-[4px] border-t-cyan-400 border-r-transparent border-b-cyan-400 border-l-transparent rounded-full mix-blend-screen" style={{ animation: 'spin_cw 6s linear infinite', filter: 'drop-shadow(0 0 10px #22d3ee)' }}></div>

            {/* Outer Thick Arc 2 */}
            <div className="absolute inset-0 border-[2px] border-t-transparent border-r-fuchsia-500 border-b-transparent border-l-fuchsia-500 rounded-full mix-blend-screen" style={{ animation: 'spin_ccw 8s linear infinite', filter: 'drop-shadow(0 0 10px #d946ef)' }}></div>

            {/* Orbiting Satellite */}
            <div className="absolute -inset-4 border border-white/5 rounded-full" style={{ animation: 'spin_cw 4s linear infinite' }}>
              <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_15px_#22d3ee]"></div>
            </div>

            {/* Listening state icon */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(100px)' }}>
                <Loader2 className="w-8 h-8 text-white animate-spin opacity-50 mix-blend-screen drop-shadow-[0_0_10px_#fff]" />
              </div>
            )}
          </div>
        </div>

        {/* Reply text box */}
        <div className="w-[90%] max-w-md min-h-[50px] flex items-center justify-center text-sm font-medium text-white px-6 py-4 text-center bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
          <p className="relative z-10 tracking-wide font-mono leading-relaxed">{reply}</p>
        </div>

        {/* Input Form with BrainCircuit Icon */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputText.trim()) {
              setTranscript(inputText);
              handleCommand(inputText);
              setInputText('');
            }
          }}
          className="mt-6 w-[90%] max-w-md relative flex items-center group/form"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="พิมพ์คำสั่งหรือคำถาม..."
            className="w-full bg-black/40 text-cyan-50 text-sm pl-6 pr-16 py-4 border border-white/10 focus:outline-none focus:border-cyan-400/50 focus:bg-black/60 font-mono rounded-full backdrop-blur-md transition-all placeholder:text-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 hover:from-cyan-500/40 hover:to-fuchsia-500/40 text-cyan-300 hover:text-white rounded-full transition-all group-hover/form:border-white/20 border border-transparent backdrop-blur-lg shadow-lg cursor-pointer"
            title="SEND"
          >
            <BrainCircuit className="w-5 h-5 group-hover:scale-110 drop-shadow-[0_0_8px_#22d3ee] transition-all" />
          </button>
        </form>

        {/* Transcript text box */}
        {transcript && (
          <div className="mt-4 text-[10px] text-cyan-300 font-mono tracking-widest uppercase max-w-md w-full truncate px-4 opacity-70">
            <span className="text-fuchsia-400">LOG &gt; </span> {transcript}
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes float-particle {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translate(var(--x-move), var(--y-move)) scale(0); opacity: 0; }
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
        @keyframes spin_cw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin_ccw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;