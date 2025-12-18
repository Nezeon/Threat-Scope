import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Shield, Terminal, Hash, ChevronDown, Activity, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useActor } from '../context/ActorContext';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../services/gemini';

const ThreatChat = () => {
    const { selectedActor, actors, setSelectedActor } = useActor();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSwitcher, setShowSwitcher] = useState(false);
    const scrollRef = useRef(null);

    // Initial Greeting Context
    useEffect(() => {
        setMessages([{
            id: Date.now(),
            role: 'assistant',
            text: `Secure channel established. Context set to **${selectedActor}**. Querying specific intelligence or request lateral movement analysis.`,
            timestamp: new Date().toLocaleTimeString()
        }]);
    }, [selectedActor]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', text: input, timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const responseText = await generateChatResponse(input, selectedActor);
            const botMsg = { id: Date.now() + 1, role: 'assistant', text: responseText, timestamp: new Date().toLocaleTimeString() };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = { id: Date.now() + 1, role: 'error', text: "CONNECTION_INTERRUPTED: " + error.message, timestamp: new Date().toLocaleTimeString() };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] tech-border bg-[#0f172a]/60 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>

            {/* Header with Switcher */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#020617]/80 border-b border-cyan-900/30 backdrop-blur supports-[backdrop-filter]:bg-[#020617]/50 z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-cyan-950/30 rounded border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                        <Terminal size={18} className="text-cyan-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 cursor-pointer relative group" onClick={() => setShowSwitcher(!showSwitcher)}>
                            <h2 className="text-sm font-black text-slate-100 tracking-[0.1em] font-mono group-hover:text-cyan-300 transition-colors">
                                THREAT CHAT // {selectedActor.toUpperCase()}
                            </h2>
                            <ChevronDown size={14} className={cn("text-slate-500 transition-transform", showSwitcher ? "rotate-180" : "")} />

                            {/* Dropdown for Context Switching */}
                            <AnimatePresence>
                                {showSwitcher && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 mt-2 w-56 bg-[#0f172a] border border-cyan-900/50 rounded-lg shadow-xl py-1 z-50 text-slate-300"
                                    >
                                        <div className="px-3 py-2 text-[10px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-800 mb-1">Select Target Context</div>
                                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                            {actors.map(actor => (
                                                <div
                                                    key={actor}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedActor(actor); setShowSwitcher(false); }}
                                                    className={cn(
                                                        "px-4 py-2 text-xs cursor-pointer hover:bg-cyan-950/30 hover:text-cyan-300 transition-colors flex items-center justify-between",
                                                        selectedActor === actor ? "text-cyan-400 bg-cyan-950/20" : ""
                                                    )}
                                                >
                                                    {actor}
                                                    {selectedActor === actor && <Activity size={10} />}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-mono mt-0.5 tracking-wider">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]" />
                            ENCRYPTED_CONNECTION_ACTIVE
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <div className="px-3 py-1 bg-slate-900/50 rounded border border-slate-800 text-[10px] text-slate-500 font-mono">
                        LATENCY: 12ms
                    </div>
                    <Lock size={14} className="text-slate-600" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={cn("flex gap-4 max-w-4xl", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded shrink-0 flex items-center justify-center border shadow-lg mt-1",
                            msg.role === 'assistant'
                                ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                                : "bg-slate-800/50 border-slate-700 text-slate-300"
                        )}>
                            {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                        </div>

                        <div className={cn(
                            "flex flex-col gap-1 items-start max-w-[85%]",
                            msg.role === 'user' ? "items-end" : ""
                        )}>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                                {msg.role === 'assistant' ? 'NEXUS_CORE' : 'OPERATOR'}
                                <span className="opacity-50 text-[9px]">{msg.timestamp}</span>
                            </div>
                            <div className={cn(
                                "p-4 rounded-lg text-sm leading-relaxed border relative overflow-hidden backdrop-blur-sm",
                                msg.role === 'assistant'
                                    ? "bg-[#0f172a]/80 border-slate-800 text-emerald-50 rounded-tl-none border-l-2 border-l-cyan-500"
                                    : "bg-cyan-950/20 border-cyan-900/30 text-cyan-50 rounded-tr-none border-r-2 border-r-cyan-600",
                                msg.role === 'error' && "bg-rose-950/20 border-rose-900 text-rose-200"
                            )}>
                                {/* Tech overlay for bot messages */}
                                {msg.role === 'assistant' && (
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent opacity-50" />
                                )}

                                <div className="markdown-prose space-y-2 font-mono text-xs md:text-sm whitespace-pre-wrap">
                                    {msg.text.split('**').map((part, i) =>
                                        i % 2 === 1 ? <span key={i} className="text-cyan-400 font-bold">{part}</span> : part
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-8 h-8 rounded shrink-0 bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                            <Bot size={16} />
                        </div>
                        <div className="flex items-center gap-1 h-10 px-4 rounded-lg bg-[#0f172a]/50 border border-slate-800/50 text-cyan-500 text-xs font-mono">
                            <span>DECRYPTING_RESPONSE</span>
                            <span className="animate-pulse">_</span>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#020617]/80 border-t border-cyan-900/30 backdrop-blur z-20">
                <form onSubmit={handleSend} className="relative flex items-center gap-4 max-w-5xl mx-auto">
                    <div className="relative flex-1 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg opacity-20 group-focus-within:opacity-50 transition duration-500 blur"></div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter command or query intelligence database..."
                            className="relative w-full bg-[#0b1120] border border-slate-700/50 text-slate-200 placeholder:text-slate-600 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500/50 text-sm font-mono tracking-wide shadow-inner"
                            disabled={loading}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            <div className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] text-slate-500 font-mono">RETURN</div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white rounded-lg transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] relative overflow-hidden group border border-cyan-400/50"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <Send size={18} className="relative z-10" />
                    </button>
                </form>
                <div className="text-center mt-2 text-[9px] text-slate-600 font-mono uppercase">
                    AI-driven intelligence. Verify critical data independently.
                </div>
            </div>
        </div>
    );
};

export default ThreatChat;
