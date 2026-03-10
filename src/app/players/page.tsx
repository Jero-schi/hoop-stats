import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AddPlayerForm from '@/components/AddPlayerForm';
import { User } from 'lucide-react';
import { cookies } from 'next/headers';

export const revalidate = 0; // Para que no cachee y muestre datos recientes siempre

export default async function PlayersPage() {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const activeTeamId = cookieStore.get('active_team_id')?.value;

    let players: any[] = [];
    let error: any = null;

    if (activeTeamId) {
        const { data: p, error: e } = await supabase
            .from('players')
            .select('*')
            .eq('team_id', activeTeamId)
            .order('created_at', { ascending: false });
        if (p) players = p;
        if (e) error = e;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Header section con el formulario */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Team Roster</h1>
                    <p className="text-slate-400 mt-2">Manage your players, positions and physical profiles.</p>
                </div>
                {activeTeamId ? <AddPlayerForm teamId={activeTeamId} /> : <div className="text-hoops-orange text-sm font-bold">Please select a team in the top bar to add players.</div>}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl">
                    Error loading players: {error.message}
                </div>
            )}

            {/* Grid de Jugadores */}
            {players && players.length === 0 ? (
                <div className="bg-navy-light/30 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center mt-8">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <User className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No players found</h3>
                    <p className="text-slate-400 mb-6">Your roster is currently empty. Get started by adding your first player.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {players?.map((player) => (
                        <div key={player.id} className="bg-navy-light/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 hover:bg-navy-light transition-all cursor-pointer group">

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-400 group-hover:bg-hoops-orange/20 group-hover:text-hoops-orange transition-colors">
                                    {player.jersey_number || '#'}
                                </div>
                                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 tracking-wider">
                                    {player.position}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-white group-hover:text-hoops-orange transition-colors">
                                    {player.first_name} {player.last_name}
                                </h3>

                                <div className="mt-5 grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Height</p>
                                        <p className="text-sm font-semibold text-white">{player.height_cm ? `${player.height_cm} cm` : '--'}</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Weight</p>
                                        <p className="text-sm font-semibold text-white">{player.weight_kg ? `${player.weight_kg} kg` : '--'}</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Age</p>
                                        <p className="text-sm font-semibold text-white">{player.age || '--'}</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className={`w-2 h-2 rounded-full ${player.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                                            <p className="text-sm font-semibold text-white">
                                                {player.active ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
