import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Skull } from 'lucide-react';

const Dashboard = () => {
    // Mock data for initial view
    const [actors, setActors] = useState([
        { name: 'APT28', type: 'Nation State', origin: 'Russia' },
        { name: 'Lazarus Group', type: 'Nation State', origin: 'North Korea' },
        { name: 'LockBit', type: 'Cybercrime', origin: 'Unknown' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newActor, setNewActor] = useState('');

    const handleAddActor = (e) => {
        e.preventDefault();
        if (newActor.trim()) {
            setActors([...actors, { name: newActor, type: 'Unknown', origin: 'Unknown' }]);
            setNewActor('');
        }
    };

    const filteredActors = actors.filter(actor =>
        actor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Threat Landscape</h2>
                    <p className="text-slate-400 mt-1">Monitor and analyze active threat actors</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search actors..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-denim-500 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Add New Actor Form */}
            <form onSubmit={handleAddActor} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30 flex gap-4 items-center">
                <input
                    type="text"
                    placeholder="Enter new actor name (e.g., APT29)"
                    className="flex-1 bg-transparent border-b border-slate-600 focus:border-denim-400 focus:outline-none py-2 px-2 transition-colors"
                    value={newActor}
                    onChange={(e) => setNewActor(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-denim-600 hover:bg-denim-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Actor
                </button>
            </form>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActors.map((actor, index) => (
                    <motion.div
                        key={actor.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/actor/${actor.name}`} className="block group">
                            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-denim-500/50 hover:bg-slate-800/60 transition-all cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Skull className="w-24 h-24" />
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-white group-hover:text-denim-400 transition-colors">{actor.name}</h3>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Type</span>
                                            <span className="text-slate-300">{actor.type}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Origin</span>
                                            <span className="text-slate-300">{actor.origin}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
