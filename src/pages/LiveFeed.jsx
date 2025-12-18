import React, { useState, useEffect } from 'react';
import { Radio, Globe, ExternalLink, Hash, Clock, ShieldAlert, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { fetchThreatIntelFeed } from '../services/feed';

const SeverityBadge = ({ title }) => {
    let level = "MEDIUM";
    let color = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

    if (title.toLowerCase().includes('vulnerability') || title.toLowerCase().includes('critical') || title.toLowerCase().includes('exploited')) {
        level = "CRITICAL";
        color = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    } else if (title.toLowerCase().includes('malware') || title.toLowerCase().includes('ransomware')) {
        level = "HIGH";
        color = "bg-orange-500/10 text-orange-400 border-orange-500/20";
    }

    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${color}`}>
            {level}
        </span>
    );
};

// Helper to extract clean summary from HTML content if needed, or just use description
const cleanSummary = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

const FeedItem = ({ item, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative tech-border bg-[#0f172a]/60 backdrop-blur-md rounded-xl p-5 hover:bg-[#0f172a]/80 transition-all overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-[50px] group-hover:bg-cyan-500/10 transition-colors" />

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-900/80 rounded border border-slate-700/50 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider shadow-inner">
                        {item.source || "THN_WIRE"}
                    </div>
                    <SeverityBadge title={item.title} />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono bg-slate-950/30 px-2 py-1 rounded">
                    <Clock size={10} /> {item.time}
                </div>
            </div>

            <h3 className="text-base font-bold text-slate-200 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-tight">
                {item.title}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2 font-sans opacity-80">
                {cleanSummary(item.summary).substring(0, 160)}...
            </p>

            <div className="flex items-center justify-between border-t border-slate-800/40 pt-3">
                <div className="flex gap-2">
                    {item.categories.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-900/40 px-1.5 py-0.5 rounded border border-slate-800/50">
                            <Hash size={8} /> {tag}
                        </span>
                    ))}
                </div>
                <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-cyan-500 flex items-center gap-1 hover:text-cyan-300 transition-colors uppercase tracking-wider"
                >
                    READ_SOURCE <ExternalLink size={10} />
                </a>
            </div>
        </div>
    </motion.div>
);

const LiveFeed = () => {
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const items = await fetchThreatIntelFeed();
            setFeedItems(items);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Feed fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
        // Auto refresh every 5 mins
        const interval = setInterval(fetchFeed, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#020617] to-[#0f172a] rounded-2xl border border-slate-800/60 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 animate-pulse">
                            <Radio className="text-red-400" size={20} />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase font-mono">
                            Live Feed<span className="text-red-500">//</span>Global
                        </h1>
                    </div>
                    <p className="text-[10px] text-cyan-600 font-mono tracking-[0.2em] uppercase pl-1">
                        Global Threat Vector Monitoring System
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 relative z-10">
                    <div className="flex gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded border border-emerald-900/50 items-center shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE_STREAM_ACTIVE
                    </div>
                    <button
                        onClick={fetchFeed}
                        disabled={loading}
                        className="group flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={12} className={cn("text-cyan-500 group-hover:rotate-180 transition-transform duration-700", loading ? "animate-spin" : "")} />
                        refresh_feed()
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Feed Column */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading && feedItems.length === 0 && (
                        <div className="col-span-2 py-20 flex flex-col items-center justify-center text-slate-500 gap-4">
                            <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin" />
                            <p className="font-mono text-xs tracking-widest animate-pulse">INITIALIZING_UPLINK...</p>
                        </div>
                    )}

                    {feedItems.map((item, index) => (
                        <FeedItem key={index} item={item} index={index} />
                    ))}
                </div>

                {/* Right Sidebar Stats */}
                <div className="space-y-6">
                    {/* Threat Level Widget */}
                    <div className="bg-[#0f172a]/40 border border-red-900/30 rounded-xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />

                        <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
                            <ShieldAlert size={14} /> DEFCON_LEVEL
                        </h4>

                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-black text-white tracking-tighter">3</span>
                            <span className="text-xs text-red-400 font-bold uppercase">Elevated</span>
                        </div>

                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                            <div className="h-full bg-red-600 w-1/5" />
                            <div className="h-full bg-red-600 w-1/5" />
                            <div className="h-full bg-red-600 w-1/5" />
                            <div className="h-full bg-slate-700 w-1/5 opacity-30" />
                            <div className="h-full bg-slate-700 w-1/5 opacity-30" />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 font-mono">
                            Cyber-espionage activity spike detected in sector 7.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="tech-border bg-[#0f172a]/60 backdrop-blur p-5 rounded-xl space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-800 pb-2">
                            System Telemetry
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Events/Hr</span>
                                <span className="text-cyan-400 font-mono">8,492</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Active Nodes</span>
                                <span className="text-emerald-400 font-mono">142</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Network Load</span>
                                <span className="text-purple-400 font-mono">42%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveFeed;
