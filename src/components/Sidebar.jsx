import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Users, MessageSquare, Radio, Settings, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive
                    ? "text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "text-slate-400 hover:text-cyan-200 hover:bg-slate-800/60 hover:border hover:border-cyan-900/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)] border border-transparent"
            )
        }
    >
        {({ isActive }) => (
            <>
                {/* Active Indicator & Glow */}
                {isActive && (
                    <>
                        <motion.div
                            layoutId="activeNav"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
                    </>
                )}

                <Icon size={20} className={cn("transition-all duration-300 z-10", isActive ? "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" : "group-hover:text-cyan-300 group-hover:scale-110")} />
                <span className={cn("font-medium tracking-wide z-10 transition-all", isActive ? "text-cyan-100" : "")}>{label}</span>

                {/* Tech Deco */}
                {isActive && <div className="absolute right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />}
            </>
        )}
    </NavLink>
);

const Sidebar = () => {
    return (
        <aside className="w-72 h-screen bg-[#050b14] border-r border-slate-800/60 flex flex-col shrink-0 z-50 relative overflow-hidden">
            {/* Tech Background Grid */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {/* Brand */}
            <div className="p-8 pb-10 flex flex-col gap-1 border-b border-slate-800/50 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-cyan-950/30 rounded-xl border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Shield className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-white font-mono leading-none">
                            THREAT SCOPE
                        </h1>
                        <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mt-1">INTEL PLATFORM</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-3 relative z-10">
                <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold px-4 mb-2">Modules</div>
                <NavItem to="/" icon={Users} label="Actors" />
                <NavItem to="/chat" icon={MessageSquare} label="Chat" />
                <NavItem to="/feed" icon={Radio} label="Live Feed" />
            </nav>

            {/* Footer / User */}
            <div className="p-4 border-t border-slate-800/50 space-y-2 relative z-10 bg-gradient-to-t from-[#050b14] to-transparent">
                <div className="mt-6 p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 group hover:border-cyan-500/30 transition-colors cursor-pointer backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-900 to-slate-900 flex items-center justify-center text-cyan-400 border border-cyan-700/50 shadow-lg">
                                <User size={18} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#050b14] rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">OPERATOR_01</p>
                            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                                ONLINE
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
