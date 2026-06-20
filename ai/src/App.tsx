import React, { useState, useRef, useEffect } from 'react';
import { askJarvis } from './lib/jarvis-core';
import { Zap, Cpu, Terminal, ShieldCheck, Send, Loader2 } from 'lucide-react';

// Define the shape of our messages to fix Type errors
interface Message {
  role: 'user' | 'jarvis';
  content: string;
}

export default function App() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleExecute = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await askJarvis(userMessage);
      setMessages(prev => [...prev, { role: 'jarvis', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'jarvis', content: "SYSTEM ERROR: Check API connectivity in console." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-400 font-mono flex flex-col">
      {/* HUD Header */}
      <header className="p-4 border-b border-cyan-900/50 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-cyan-500 animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest text-white">JARVIS <span className="text-cyan-600 text-xs italic">BY HANSHIK</span></h1>
            <div className="flex gap-2 text-[8px] uppercase tracking-tighter opacity-60">
              <span className="flex items-center gap-1 text-green-500"><ShieldCheck size={10}/> Godmode Active</span>
              <span className="flex items-center gap-1"><Cpu size={10}/> Core: Multi-AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Terminal Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-20 opacity-20">
              <Terminal size={48} className="mx-auto mb-4" />
              <p>System Initialized. Awaiting Hanshik's Command.</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-lg max-w-[90%] border ${
                msg.role === 'user' 
                  ? 'border-cyan-500/30 bg-cyan-500/5 text-cyan-100' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-200'
              }`}>
                <div className="text-[9px] uppercase mb-2 opacity-50 flex items-center gap-2 font-black">
                  {msg.role === 'user' ? 'Hanshik' : 'Jarvis Intelligence'}
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-3 text-cyan-500 italic text-sm animate-pulse">
              <Loader2 className="animate-spin" size={16} />
              Analysing Data across all AI cores...
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* Input Console */}
      <footer className="p-4 bg-black border-t border-cyan-900/50">
        <div className="max-w-4xl mx-auto flex gap-4">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              className="w-full bg-slate-900/50 border border-cyan-900/50 rounded-lg py-4 px-6 focus:outline-none focus:border-cyan-400 transition-all text-white placeholder:text-cyan-900 resize-none"
              placeholder="Enter direct command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button 
            onClick={handleExecute}
            className="bg-cyan-600 hover:bg-white text-black font-bold px-8 rounded-lg flex items-center gap-2 transition-all group"
          >
            <Zap size={18} className="group-hover:fill-current" />
            <span className="hidden md:inline">EXECUTE</span>
          </button>
        </div>
      </footer>
    </div>
  );
}