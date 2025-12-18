import React, { useState, useEffect, useCallback } from 'react';
import { Search, Globe, Target, Shield, Clock, AlertTriangle, FileText, Activity, Plus, MessageSquare, Download, Terminal } from 'lucide-react';
import { generateActorProfile } from '../services/gemini';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';
import { useActor } from '../context/ActorContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color = "text-cyan-400" }) => (
    <div className="bg-[#162032]/80 p-4 rounded-xl border border-slate-700/50 flex flex-col gap-2 relative overflow-hidden group hover:border-cyan-500/30 transition-all min-h-[110px]">
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={48} />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <Icon size={14} className={color} />
            {label}
        </div>
        {/* Changed from truncate to line-clamp/break-words for better visibility */}
        <div className="text-sm lg:text-base font-medium text-slate-100 z-10 break-words leading-tight line-clamp-3">
            {value || "Unknown"}
        </div>
    </div>
);

const ThreatRadar = ({ data }) => {
    if (!data) return (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <Activity size={32} className="opacity-20" />
            <span className="text-xs uppercase tracking-widest">No Scoring Data</span>
        </div>
    );

    const chartData = [
        { subject: 'Technical', A: data.technical || 50, fullMark: 100 },
        { subject: 'Sophistication', A: data.sophistication || 50, fullMark: 100 },
        { subject: 'Infrastructure', A: data.infrastructure || 50, fullMark: 100 },
        { subject: 'Evasion', A: data.evasion || 50, fullMark: 100 },
        { subject: 'Impact', A: data.impact || 50, fullMark: 100 },
    ];

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-2 right-2 text-[10px] text-cyan-500/50 uppercase tracking-widest font-mono">
                AI_THREAT_ANALYSIS_SCORING
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Threat Score"
                        dataKey="A"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        fill="#38bdf8"
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

import { fetchThreatIntelFeed } from '../services/feed';

// Mini Feed Component for Sidebar
const MiniLiveFeed = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const load = async () => {
            const items = await fetchThreatIntelFeed();
            setAlerts(items.slice(0, 5));
        };
        load();
        const interval = setInterval(load, 300000); // 5m
        return () => clearInterval(interval);
    }, []);

    const cleanText = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    return (
        <div className="bg-[#162032] border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3 min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity size={14} /> Live Intelligence
                </h3>
                <span className="text-[10px] text-slate-500 font-mono animate-pulse">LIVE_RSS</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                {alerts.length === 0 && <div className="text-center text-xs text-slate-500 mt-4">Connecting to Feed...</div>}
                {alerts.map((a, i) => (
                    <div key={i} className="text-xs p-3 bg-slate-900/50 border-l-2 border-slate-700 rounded-r hover:bg-slate-800 transition-colors">
                        <div className="text-[10px] text-slate-500 mb-1 flex justify-between">
                            <span>{a.source}</span>
                            <span>{a.time}</span>
                        </div>
                        <p className="text-slate-300 leading-snug line-clamp-3">
                            <span className="font-bold text-slate-200 block mb-1">{a.title}</span>
                            {cleanText(a.summary).substring(0, 60)}...
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const ActorTracking = () => {
    // Use Global Context
    const { actors, selectedActor, setSelectedActor, addActor } = useActor();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [newActorName, setNewActorName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial load when selectedActor changes
    useEffect(() => {
        if (selectedActor) {
            fetchActorData(selectedActor);
        }
    }, [selectedActor]);

    const fetchActorData = async (name) => {
        setLoading(true);
        setError(null);
        setProfileData(null);

        try {
            const data = await generateActorProfile(name);
            setProfileData(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to retrieve profile data.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddActor = (e) => {
        e.preventDefault();
        if (newActorName.trim()) {
            addActor(newActorName.trim());
            setNewActorName('');
            setIsAdding(false);
        }
    };

    const handleExpertExport = useCallback(async () => {
        if (!profileData) return;

        // Validation: Verify if the AI returned data for the correct actor
        if (profileData.actor_name && profileData.actor_name.toLowerCase() !== selectedActor.toLowerCase()) {
            console.warn(`[Export Mismatch] User selected '${selectedActor}' but data is for '${profileData.actor_name}'. Exporting anyway but noting discrepancy.`);
        }

        // Create Workbook
        const wb = XLSX.utils.book_new();

        // Requirement: "Just Threat Actor and all the CVE's... not even a single CVE shall mismatch"
        const cveRows = (profileData.cves || []).map(cve => ({
            "Threat Actor": selectedActor, // Enforce the selected actor name from UI context
            "CVE ID": cve.id,
            "Description": cve.description
        }));

        const ws = XLSX.utils.json_to_sheet(cveRows.length ? cveRows : [{ "Threat Actor": selectedActor, "Note": "No CVEs found in current profile." }]);
        XLSX.utils.book_append_sheet(wb, ws, "CVE Report");

        // Create sanitized filename
        const safeName = (selectedActor || "Actor").replace(/[^a-z0-9]/gi, '_');
        const fileName = `${safeName}_Profile.xlsx`;

        // Strategy 1: Modern File System Access API (Forces Save As Dialog with Correct Name)
        try {
            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'Excel Spreadsheet',
                        accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
                    }],
                });

                const writable = await handle.createWritable();
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                await writable.write(blob);
                await writable.close();
                return; // Success
            }
        } catch (err) {
            // User cancelled or API failed, proceed to fallback
            if (err.name !== 'AbortError') console.error("FS API failed:", err);
            if (err.name === 'AbortError') return;
        }

        // Strategy 2: Robust Fallback with Explicit Anchor Click
        // This is the classic method but made more explicit
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();

        // Extended cleanup time to ensure browser registers the download
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 2000);
    }, [profileData, selectedActor]);

    // Navigate to chat with current context
    const handleOpenChat = () => {
        navigate('/chat');
    };

    const filteredActors = actors.filter(a => a.toLowerCase().includes(searchTerm.toLowerCase()));

    // Dynamic Threat Level Color
    const getThreatLevelColor = (level) => {
        switch (level?.toUpperCase()) {
            case 'CRITICAL': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { x: -20, opacity: 0 },
        show: { x: 0, opacity: 1 }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-100px)]">
            {/* LEFT PANEL: Actor List */}
            <div className="lg:w-1/4 w-full flex flex-col gap-4 min-w-[280px] lg:sticky lg:top-6 lg:h-[calc(100vh-48px)]">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xs font-bold text-cyan-500/80 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Terminal size={12} /> ACTORS
                    </h2>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="text-[10px] bg-cyan-900/30 hover:bg-cyan-500 text-cyan-300 hover:text-white border border-cyan-800 hover:border-cyan-400 px-3 py-1.5 rounded flex items-center gap-2 transition-all group"
                    >
                        <Plus size={12} className="group-hover:rotate-90 transition-transform" /> NEW
                    </button>
                </div>

                {/* Add Actor Input */}
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleAddActor}
                        className="flex gap-2 p-1"
                    >
                        <input
                            autoFocus
                            type="text"
                            placeholder="ENTER_DESIGNATION..."
                            className="flex-1 glass-input px-3 py-2 rounded text-xs focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                            value={newActorName}
                            onChange={e => setNewActorName(e.target.value)}
                        />
                        <button type="submit" className="text-cyan-400 hover:text-white p-2 bg-cyan-900/20 rounded border border-cyan-800 hover:border-cyan-400 transition-colors">
                            <Plus size={14} />
                        </button>
                    </motion.form>
                )}

                {/* Search */}
                <div className="relative group mx-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="SEARCH_DATABASE..."
                        className="w-full bg-[#0f172a]/40 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono focus:border-cyan-500/40 focus:bg-[#0f172a]/60 outline-none transition-all placeholder:text-slate-700 text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* List - Keep internal scroll for list if sticky */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 min-h-[400px] p-1"
                >
                    {filteredActors.map(actor => (
                        <motion.button
                            key={actor}
                            variants={item}
                            onClick={() => setSelectedActor(actor)}
                            className={cn(
                                "w-full text-left px-4 py-3 rounded border transition-all duration-300 flex items-center justify-between group relative overflow-hidden",
                                selectedActor === actor
                                    ? "bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                    : "bg-[#0f172a]/20 border-transparent hover:border-slate-700 hover:bg-[#0f172a]/40"
                            )}
                        >
                            {selectedActor === actor && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />}

                            <div className="flex items-center gap-3 relative z-10">
                                <span className={cn(
                                    "font-mono text-xs tracking-wider transition-colors",
                                    selectedActor === actor ? "text-cyan-100 font-bold" : "text-slate-400 group-hover:text-slate-200"
                                )}>{actor}</span>
                            </div>

                            {selectedActor === actor && <Activity size={12} className="text-cyan-400 animate-pulse" />}
                        </motion.button>
                    ))}
                </motion.div>
            </div>

            {/* RIGHT PANEL: Details */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-gradient-to-r from-cyan-950/10 to-transparent rounded-xl border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-950/30 rounded border border-cyan-500/20 shadow-inner">
                            <Target className="text-cyan-400" size={20} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter font-mono flex items-center gap-3">
                                {selectedActor || "SELECT_TARGET"}
                                {loading && <span className="text-xs font-normal text-cyan-500 font-sans tracking-normal animate-pulse">Scanning...</span>}
                            </h1>
                            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Target // {selectedActor}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleOpenChat}
                            className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all rounded text-xs font-bold tracking-wider flex items-center gap-2"
                        >
                            <MessageSquare size={14} /> NEURAL_CHAT
                        </button>
                        <button
                            onClick={handleExpertExport}
                            disabled={!profileData}
                            className="px-4 py-2 bg-slate-900/50 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors rounded text-xs font-mono flex items-center gap-2"
                        >
                            <Download size={14} /> EXPORT_DATA
                        </button>
                    </div>
                </div>

                {/* Main Content Area - ALLOW PAGE SCROLL */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1 & 2: Stats + Chart */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-2 flex flex-col gap-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard icon={Globe} label="Origin" value={profileData?.origin} />
                            <StatCard icon={Target} label="Targets" value={profileData?.targets} />
                            <StatCard icon={AlertTriangle} label="Malware" value={profileData?.malware} color="text-rose-400" />
                            <StatCard icon={Clock} label="Last Active" value={profileData?.last_active} color="text-emerald-400" />
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="p-6 bg-rose-950/20 border border-rose-900/50 rounded-lg text-rose-200 text-center">
                                {error}
                            </div>
                        )}

                        {/* Description / Profile */}
                        {profileData && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="tech-border bg-[#0f172a]/40 backdrop-blur-md p-8 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                    <FileText size={100} />
                                </div>

                                <h3 className="flex items-center gap-3 text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 pb-2 border-b border-cyan-900/30">
                                    <Terminal size={14} /> Technical Profile & TTPs
                                </h3>

                                <div className="space-y-4 text-slate-300 leading-relaxed text-sm font-mono tracking-tight">
                                    <p className="border-l-2 border-cyan-500/20 pl-4 hover:border-cyan-400 transition-colors">{profileData.description_p1}</p>
                                    <p>{profileData.description_p2}</p>
                                    <p className="opacity-80">{profileData.description_p3}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Loading State or Intro */}
                        {!profileData && !loading && (
                            <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-xl">
                                <p className="text-slate-600 font-mono text-xs">SELECT TARGET TO INITIATE SCAN</p>
                            </div>
                        )}

                        {/* CVEs */}
                        {profileData?.cves?.length > 0 && (
                            <div className="tech-border bg-[#0f172a]/40 backdrop-blur-md p-6">
                                <h3 className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                                    <AlertTriangle size={14} /> Exploited Vulnerabilities
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {profileData.cves.map((cve, i) => (
                                        <div key={i} className="flex items-start gap-4 p-3 bg-slate-950/30 rounded border border-slate-800 hover:border-rose-500/50 transition-colors group cursor-crosshair">
                                            <span className="text-rose-400 font-mono text-[10px] font-bold whitespace-nowrap bg-rose-950/20 px-2 py-1 rounded border border-rose-900/30 group-hover:bg-rose-500/10 transition-colors">{cve.id}</span>
                                            <p className="text-xs text-slate-400 font-mono leading-tight">{cve.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Column 3: Radar Chart & Live Feed */}
                    <div className="col-span-3 lg:col-span-1 flex flex-col gap-6 h-full">
                        {/* Radar Chart Panel */}
                        <div className="tech-border bg-[#0f172a]/60 backdrop-blur rounded-xl p-4 h-[300px] shadow-2xl relative group">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
                            <ThreatRadar data={profileData?.threat_scores} />

                            {/* Decorative corners */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />
                        </div>

                        {/* Live Feed Widget */}
                        <MiniLiveFeed />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActorTracking;
