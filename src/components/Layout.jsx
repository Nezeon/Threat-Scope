import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
    return (
        <div className="flex min-h-screen w-full bg-[#0B1120] font-sans text-slate-200">
            {/* Sticky Sidebar */}
            <div className="sticky top-0 h-screen shrink-0 z-50">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col relative w-0 min-w-0">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] fixed"
                    style={{
                        backgroundImage: 'linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Ambient Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[128px] pointer-events-none fixed" />

                <div className="flex-1 p-6 z-10">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Layout;
