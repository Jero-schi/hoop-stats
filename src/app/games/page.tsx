import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AddGameForm from '@/components/AddGameForm';
import { Calendar, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function GamesPage() {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const activeTeamId = cookieStore.get('active_team_id')?.value;

    let games: any[] = [];
    let error: any = null;

    if (activeTeamId) {
        const { data: g, error: e } = await supabase
            .from('games')
            .select('*')
            .eq('team_id', activeTeamId)
            .order('date', { ascending: false });
        if (g) games = g;
        if (e) error = e;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Centro de Partidos</h1>
                    <p className="text-slate-400 mt-2">Registra partidos en vivo, gestiona marcadores y revisa el historial.</p>
                </div>
                {activeTeamId ? <AddGameForm teamId={activeTeamId} /> : <div className="text-hoops-orange text-sm font-bold">Por favor, selecciona un equipo en la barra superior para añadir partidos.</div>}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl">
                    Error al cargar partidos: {error.message}
                </div>
            )}

            {games && games.length === 0 ? (
                <div className="bg-navy-light/30 border border-slate-800/50 rounded-3xl p-16 text-center flex flex-col items-center mt-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-24 h-24 bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-700 relative z-10 group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-300">
                        <Calendar className="w-12 h-12 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 relative z-10">Sin Partidos Disputados</h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto relative z-10 text-lg">El historial está en blanco. Organiza un nuevo partido, registra estadísticas en vivo y analiza el desempeño de tu equipo aquí.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games?.map((game) => (
                        <div key={game.id} className="bg-navy-light/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col">
                            {/* Game Header */}
                            <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/40">
                                <div>
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${game.location === 'Home' ? 'bg-orange-500/10 text-orange-500' :
                                        game.location === 'Visitante' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-slate-500/10 text-slate-400'
                                        }`}>
                                        {game.location}
                                    </span>
                                    <p className="text-sm font-medium text-slate-400 mt-2">{new Date(game.date).toLocaleDateString('es-ES')}</p>
                                </div>
                                {game.outcome ? (
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-inner ${game.outcome === 'W' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                        game.outcome === 'L' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                            'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                        }`}>
                                        {game.outcome}
                                    </div>
                                ) : (
                                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold animate-pulse">
                                        EN VIVO
                                    </span>
                                )}
                            </div>

                            {/* Game Score / Teams */}
                            <div className="p-6 flex-1 flex flex-col justify-center">
                                <div className="flex items-center justify-between text-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Nosotros</p>
                                        <p className="text-4xl font-black text-white">{game.team_score ?? '--'}</p>
                                    </div>
                                    <div className="text-slate-600 font-black text-2xl">VS</div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 truncate max-w-full" title={game.opponent}>
                                            {game.opponent.substring(0, 10)}{game.opponent.length > 10 ? '...' : ''}
                                        </p>
                                        <p className="text-4xl font-black text-white">{game.opponent_score ?? '--'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="p-4 bg-slate-900/40 border-t border-slate-800/50">
                                <Link href={`/games/${game.id}`} className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 group">
                                    <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-hoops-orange transition-colors" />
                                    {game.outcome ? 'Ver Estadísticas' : 'Abrir Registro en Vivo'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
