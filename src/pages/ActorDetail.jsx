import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ShieldAlert, Cpu, Globe, Activity } from 'lucide-react';
import { generateActorProfile } from '../services/gemini';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

const ActorDetail = () => {
    const { name } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await generateActorProfile(name);
                setData(result);
            } catch (err) {
                setError(err.message || "Failed to generate profile.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (name) {
            fetchData();
        }
    }, [name]);

    const handleExport = () => {
        if (!data) return;

        const exportData = [
            {
                Actor: name,
                "Paragraph 1 (Summary)": data.description_p1,
                "Paragraph 2 (Campaigns/Tools)": data.description_p2,
                "Paragraph 3 (Latest Tactics)": data.description_p3,
            }
        ];

        // Add CVEs as separate rows or columns? 
        // Requirement says "report containing only threat name and CVE".

        // Let's make a dedicated CVE sheet or format.
        // User asked "export xls funtionality throught which i can get a report containign only threat name and CVE"

        const cveData = data.cves.map(cve => ({
            Actor: name,
            CVE_ID: cve.id,
            Description: cve.description
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(cveData);
        XLSX.utils.book_append_sheet(wb, ws, "CVE Report");
        XLSX.writeFile(wb, `${name}_CVE_Report.xlsx`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="w-16 h-16 border-4 border-denim-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 animate-pulse">Analyzing threat intelligence for {name}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-20">
                <p className="text-red-400 mb-4">{error}</p>
                <Link to="/" className="text-denim-400 hover:text-denim-300">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-400" />
                    </Link>
                    <h1 className="text-4xl font-bold text-white tracking-tight">{name} <span className="text-denim-500 text-lg align-top">INTEL</span></h1>
                </div>
                <button
                    onClick={handleExport}
                    className="bg-denim-600 hover:bg-denim-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-denim-900/20 transition-all hover:scale-105"
                >
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Intelligence Column */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Globe className="w-32 h-32" />
                        </div>
                        <h2 className="text-xl font-semibold text-denim-400 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5" /> Operational Profile
                        </h2>
                        <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                            <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-white first-letter:mr-1 float-left">
                                {data.description_p1.charAt(0)}
                            </p>
                            <p>{data.description_p1.slice(1)}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Cpu className="w-32 h-32" />
                        </div>
                        <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                            <Cpu className="w-5 h-5" /> Campaigns & Tactics
                        </h2>
                        <p className="text-slate-300 leading-relaxed text-lg">{data.description_p2}</p>
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 border-l-4 border-l-red-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <ShieldAlert className="w-32 h-32" />
                        </div>
                        <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" /> Recent Activity
                        </h2>
                        <p className="text-slate-300 leading-relaxed text-lg">{data.description_p3}</p>
                    </motion.div>
                </div>

                {/* CVE Side Panel */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 sticky top-24"
                    >
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                            Detected CVEs
                            <span className="ml-auto bg-slate-800 text-xs px-2 py-1 rounded-full text-slate-400">{data.cves.length}</span>
                        </h3>

                        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            {data.cves.map((cve, i) => (
                                <div key={i} className="group p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/30 hover:border-red-500/30">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-red-400 font-mono font-bold text-sm bg-red-500/10 px-2 py-1 rounded">{cve.id}</span>
                                    </div>
                                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-3">{cve.description}</p>
                                </div>
                            ))}
                            {data.cves.length === 0 && (
                                <p className="text-slate-500 text-center py-4">No specific CVEs identified in this report.</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ActorDetail;
