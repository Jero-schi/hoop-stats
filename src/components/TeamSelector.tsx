'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ChevronDown, Plus, Shield } from 'lucide-react';

export default function TeamSelector() {
    const [teams, setTeams] = useState<any[]>([]);
    const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        loadTeams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadTeams = async () => {
        const { data } = await supabase.from('teams').select('*').order('created_at', { ascending: true });
        if (data && data.length > 0) {
            setTeams(data);

            // Read cookie naturally
            const match = document.cookie.match(new RegExp('(^| )active_team_id=([^;]+)'));
            if (match) {
                setActiveTeamId(match[2]);
            } else {
                handleSelectTeam(data[0].id);
            }
        }
    };

    const handleSelectTeam = (id: string) => {
        document.cookie = `active_team_id=${id}; path=/; max-age=31536000`; // 1 year cookie
        setActiveTeamId(id);
        setIsOpen(false);
        router.refresh(); // Refresh to make Server Components fetch new data
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        const { data, error } = await supabase.from('teams').insert([{ name: newTeamName }]).select().single();
        if (!error && data) {
            setNewTeamName('');
            setIsCreating(false);
            await loadTeams();
            handleSelectTeam(data.id);
        } else {
            alert("Error creating team: " + error?.message);
        }
    };

    const activeTeam = teams.find(t => t.id === activeTeamId) || teams[0];

    return (
        <div className="relative z-50">
            {teams.length > 0 ? (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl px-4 py-2 transition-colors shadow-inner"
                >
                    <div className="w-6 h-6 rounded-md bg-hoops-orange/20 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-hoops-orange" />
                    </div>
                    <span className="font-bold text-white text-sm tracking-wide max-w-[150px] truncate">{activeTeam?.name}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-hoops-orange text-white text-sm font-bold rounded-xl px-4 py-2 shadow-lg shadow-hoops-orange/20"
                >
                    <Plus className="w-4 h-4" /> Create First Team
                </button>
            )}

            {isOpen && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-navy-light border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                        <p className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Category</p>
                        {teams.map(team => (
                            <button
                                key={team.id}
                                onClick={() => handleSelectTeam(team.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${activeTeamId === team.id ? 'bg-hoops-orange/10 text-hoops-orange' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Shield className="w-4 h-4 opacity-70" />
                                <span className="font-bold text-sm truncate">{team.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-slate-700 bg-slate-900/80">
                        <button
                            onClick={() => { setIsOpen(false); setIsCreating(true); }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold"
                        >
                            <Plus className="w-4 h-4" /> Add New Team
                        </button>
                    </div>
                </div>
            )}

            {isCreating && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-dark/95 backdrop-blur-sm">
                    <div className="bg-navy-light border border-slate-700 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-white mb-2">Create New Category</h3>
                        <p className="text-slate-400 text-sm mb-6">e.g. U15 Boys, U17 Girls, Senior Team</p>
                        <form onSubmit={handleCreateTeam}>
                            <input
                                autoFocus
                                required
                                value={newTeamName}
                                onChange={e => setNewTeamName(e.target.value)}
                                placeholder="Team Name..."
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 mb-6 outline-none focus:border-hoops-orange focus:ring-1 focus:ring-hoops-orange transition-all"
                            />
                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 rounded-xl text-slate-400 font-bold hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-700">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-hoops-orange text-white font-bold flex items-center gap-2 shadow-lg shadow-hoops-orange/20 active:scale-95 transition-all">Save Team</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
