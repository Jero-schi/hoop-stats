'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Plus, X, Loader2, Check } from 'lucide-react';

export default function AddGameForm({ teamId }: { teamId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [players, setPlayers] = useState<any[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const router = useRouter();

    const [formData, setFormData] = useState({
        opponent: '',
        location: 'Home',
        date: new Date().toISOString().split('T')[0]
    });

    const openModal = async () => {
        setIsOpen(true);
        const supabase = createClient();
        const { data } = await supabase.from('players').select('*').eq('team_id', teamId).eq('active', true).order('first_name');
        if (data) {
            setPlayers(data);
            setSelectedPlayers(data.map(p => p.id));
        }
    };

    const togglePlayer = (id: string) => {
        setSelectedPlayers(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createClient();

        const insertData = {
            opponent: formData.opponent,
            location: formData.location,
            date: formData.date,
            team_id: teamId
        };

        const { data: newGame, error } = await supabase
            .from('games')
            .insert([insertData])
            .select()
            .single();

        if (error) {
            alert('Error creating game: ' + error.message);
            setIsLoading(false);
            return;
        }

        if (newGame && selectedPlayers.length > 0) {
            const initialStats = selectedPlayers.map(pid => ({
                game_id: newGame.id,
                player_id: pid,
                minutes_played: 0,
                points: 0,
                rebotes_totales: 0,
                rebotes_ofensivos: 0,
                rebotes_defensivos: 0,
                asistencias: 0,
                robos: 0,
                tapones: 0,
                perdidas: 0,
                faltas_personales: 0,
                tiros_campo_intentados: 0,
                tiros_campo_metidos: 0,
                tiros_3p_intentados: 0,
                tiros_3p_metidos: 0,
                tiros_libres_intentados: 0,
                tiros_libres_metidos: 0,
            }));
            await supabase.from('game_stats').insert(initialStats);
        }

        setIsLoading(false);
        setIsOpen(false);
        router.push(`/games/${newGame.id}`);
    };

    return (
        <>
            <button
                onClick={openModal}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover transition-colors flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                New Game
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/80 backdrop-blur-sm">
                    <div className="bg-navy-light border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-black text-white">Match Setup</h2>
                            <button disabled={isLoading} onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opposing Team *</label>
                                    <input required name="opponent" value={formData.opponent} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange focus:ring-1 focus:ring-hoops-orange transition-all" placeholder="e.g. Lakers" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                                    <select name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange transition-all appearance-none cursor-pointer">
                                        <option value="Home">Home</option>
                                        <option value="Away">Away</option>
                                        <option value="Neutral">Neutral</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                                    <input type="date" required name="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-xl px-4 py-3 outline-none focus:border-hoops-orange transition-all" />
                                </div>

                                {players.length > 0 && (
                                    <div className="space-y-2 col-span-1 md:col-span-2 pt-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Roster for this Game</label>
                                            <span className="text-xs font-bold text-hoops-orange bg-hoops-orange/10 px-2 py-1 rounded-md">{selectedPlayers.length} Selected</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                                            {players.map(p => {
                                                const isSelected = selectedPlayers.includes(p.id);
                                                return (
                                                    <div
                                                        key={p.id}
                                                        onClick={() => togglePlayer(p.id)}
                                                        className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer border transition-all ${isSelected ? 'border-hoops-orange bg-hoops-orange/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600'}`}
                                                    >
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'border-hoops-orange bg-hoops-orange text-white' : 'border-slate-600 bg-transparent'}`}>
                                                            {isSelected && <Check className="w-3 h-3" strokeWidth={4} />}
                                                        </div>
                                                        <div className="truncate text-xs font-bold">
                                                            {p.jersey_number ? `${p.jersey_number} - ` : ''}{p.first_name} {p.last_name}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" disabled={isLoading} onClick={() => setIsOpen(false)} className="px-5 py-3 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="px-6 py-3 rounded-xl text-sm font-bold bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Match'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
