'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, ArrowLeft, X, CheckCircle2, AlertCircle, BarChart2, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LiveStatsTracker({ game, players, initialStats }: any) {
    const router = useRouter();
    const [stats, setStats] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showFullBoxScore, setShowFullBoxScore] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Marcador y Estado global del partido
    const [gameScore, setGameScore] = useState({ us: game.team_score || 0, them: game.opponent_score || 0 });
    const [gameOutcome, setGameOutcome] = useState(game.outcome || 'TBD');

    // Estadísticas del Equipo Rival
    const [opponentStats, setOpponentStats] = useState({
        rebotes_totales: game.opponent_rebotes_totales || 0,
        rebotes_ofensivos: game.opponent_rebotes_ofensivos || 0,
        rebotes_defensivos: game.opponent_rebotes_defensivos || 0,
        asistencias: game.opponent_asistencias || 0,
        robos: game.opponent_robos || 0,
        tapones: game.opponent_tapones || 0,
        perdidas: game.opponent_perdidas || 0,
        faltas_personales: game.opponent_faltas_personales || 0,
    });

    const [activeAction, setActiveAction] = useState<{ type: string } | null>(null);

    // Undo History Stack
    const [history, setHistory] = useState<any[]>([]);

    const saveStateToHistory = () => {
        setHistory(prev => [...prev, {
            stats: JSON.parse(JSON.stringify(stats)),
            gameScore: { ...gameScore },
            opponentStats: { ...opponentStats }
        }]);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const previousState = history[history.length - 1];
        setStats(previousState.stats);
        setGameScore(previousState.gameScore);
        setOpponentStats(previousState.opponentStats);
        setHistory(prev => prev.slice(0, -1));
        showToast("Acción deshecha", "success");
    };

    useEffect(() => {
        const statsMap: any = {};
        players.forEach((p: any) => {
            const existing = initialStats.find((s: any) => s.player_id === p.id);
            statsMap[p.id] = existing || {
                game_id: game.id,
                player_id: p.id,
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
            };
        });
        setStats(statsMap);
    }, [players, initialStats, game.id]);

    const handleActionClick = (actionType: string) => {
        setActiveAction({ type: actionType });
    };

    const confirmActionForPlayer = (playerId: string) => {
        if (!activeAction) return;
        const type = activeAction.type;

        // --- SISTEMA DEL EQUIPO RIVAL ---
        if (playerId === 'OPPONENT') {
            saveStateToHistory();

            // Actualizar Marcador Global fuera del State Updater
            if (type === '3PT_MAKE') { setGameScore(gs => ({ ...gs, them: gs.them + 3 })); }
            else if (type === '2PT_MAKE') { setGameScore(gs => ({ ...gs, them: gs.them + 2 })); }
            else if (type === 'FT_MAKE') { setGameScore(gs => ({ ...gs, them: gs.them + 1 })); }

            setOpponentStats((prev: any) => {
                const s = { ...prev };
                if (type === 'OREB') { s.rebotes_ofensivos += 1; s.rebotes_totales += 1; }
                else if (type === 'DREB') { s.rebotes_defensivos += 1; s.rebotes_totales += 1; }
                else if (type === 'AST') s.asistencias += 1;
                else if (type === 'STL') s.robos += 1;
                else if (type === 'BLK') s.tapones += 1;
                else if (type === 'TOV') s.perdidas += 1;
                else if (type === 'FOUL') s.faltas_personales += 1;
                return s;
            });
            setActiveAction(null);
            return;
        }

        // --- SISTEMA DE NUESTRO EQUIPO ---
        saveStateToHistory();

        if (type === '3PT_MAKE') setGameScore(s => ({ ...s, us: s.us + 3 }));
        else if (type === '2PT_MAKE') setGameScore(s => ({ ...s, us: s.us + 2 }));
        else if (type === 'FT_MAKE') setGameScore(s => ({ ...s, us: s.us + 1 }));

        setStats((prev: any) => {
            const p = { ...prev[playerId] };

            if (type === '3PT_MAKE') {
                p.points += 3;
                p.tiros_3p_metidos += 1; p.tiros_3p_intentados += 1;
                p.tiros_campo_metidos += 1; p.tiros_campo_intentados += 1;
            }
            else if (type === '3PT_MISS') { p.tiros_3p_intentados += 1; p.tiros_campo_intentados += 1; }
            else if (type === '2PT_MAKE') {
                p.points += 2;
                p.tiros_campo_metidos += 1; p.tiros_campo_intentados += 1;
            }
            else if (type === '2PT_MISS') { p.tiros_campo_intentados += 1; }
            else if (type === 'FT_MAKE') {
                p.points += 1;
                p.tiros_libres_metidos += 1; p.tiros_libres_intentados += 1;
            }
            else if (type === 'FT_MISS') { p.tiros_libres_intentados += 1; }
            else if (type === 'OREB') { p.rebotes_ofensivos += 1; p.rebotes_totales += 1; }
            else if (type === 'DREB') { p.rebotes_defensivos += 1; p.rebotes_totales += 1; }
            else if (type === 'AST') p.asistencias += 1;
            else if (type === 'STL') p.robos += 1;
            else if (type === 'BLK') p.tapones += 1;
            else if (type === 'TOV') p.perdidas += 1;
            else if (type === 'FOUL') p.faltas_personales += 1;

            return { ...prev, [playerId]: p };
        });

        setActiveAction(null);
    };

    const saveToSupabase = async () => {
        setIsSaving(true);
        const supabase = createClient();

        // 1. Guardar las stats del partido de la BD
        const { error: gameError } = await supabase.from('games').update({
            team_score: gameScore.us,
            opponent_score: gameScore.them,
            outcome: gameOutcome,
            opponent_rebotes_totales: opponentStats.rebotes_totales,
            opponent_rebotes_ofensivos: opponentStats.rebotes_ofensivos,
            opponent_rebotes_defensivos: opponentStats.rebotes_defensivos,
            opponent_asistencias: opponentStats.asistencias,
            opponent_robos: opponentStats.robos,
            opponent_tapones: opponentStats.tapones,
            opponent_perdidas: opponentStats.perdidas,
            opponent_faltas_personales: opponentStats.faltas_personales
        }).eq('id', game.id);

        // 2. Guardar a los jugadores
        const statsArray = Object.values(stats);
        const { error: statsError } = await supabase.from('game_stats').upsert(statsArray, { onConflict: 'game_id,player_id' });

        setIsSaving(false);
        if (gameError) showToast("Error guardando detalles del partido: " + gameError.message, 'error');
        else if (statsError) showToast("Error guardando estadísticas de jugador: " + statsError.message, 'error');
        else showToast("¡Estadísticas del partido sincronizadas con éxito!", 'success');
    };

    if (Object.keys(stats).length === 0) return <div className="text-white p-8 animate-pulse text-center">Configurando la cancha...</div>;

    const getActionColor = () => {
        if (!activeAction) return '';
        if (activeAction.type.includes('MAKE')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
        if (activeAction.type.includes('MISS')) return 'text-red-500 bg-red-500/10 border-red-500/30';
        if (['AST', 'OREB', 'DREB', 'STL', 'BLK'].includes(activeAction.type)) return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
        return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] bg-navy-dark overflow-hidden relative">

            {/* Modal de Selección (Nosotros o Rival) */}
            {activeAction && (
                <div className="absolute inset-0 z-50 bg-navy-dark/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black text-white">¿Quién hizo la jugada?</h2>
                        <button onClick={() => setActiveAction(null)} className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition">
                            Cancelar
                        </button>
                    </div>

                    <div className={`mb-6 p-4 rounded-3xl border-2 flex items-center justify-center ${getActionColor()}`}>
                        <span className="text-3xl font-black tracking-widest">{activeAction.type.replace('_', ' ')}</span>
                    </div>

                    <div className="overflow-y-auto pb-20 space-y-4">
                        {/* Botón Gigante del Rival */}
                        <button
                            onClick={() => confirmActionForPlayer('OPPONENT')}
                            className="w-full flex items-center justify-center p-6 bg-red-950/40 border-2 border-red-500/50 rounded-3xl hover:bg-red-900/60 active:scale-95 transition-all shadow-lg"
                        >
                            <span className="font-black text-red-500 text-2xl uppercase tracking-widest">Equipo Rival ({game.opponent})</span>
                        </button>

                        {/* Cuadrícula de Nuestros Jugadores */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                            {players.map((p: any) => (
                                <button
                                    key={p.id}
                                    onClick={() => confirmActionForPlayer(p.id)}
                                    className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-700 rounded-3xl hover:border-hoops-orange hover:bg-hoops-orange/10 active:scale-95 transition-all shadow-lg"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-300 mb-3 shadow-inner">
                                        {p.jersey_number || '#'}
                                    </div>
                                    <span className="font-bold text-white text-lg">{p.first_name}</span>
                                    <span className="text-slate-400 text-sm">{p.last_name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar Móvil/Desktop */}
            <div className="bg-navy-light/90 border-b border-slate-800 p-4 shrink-0 flex flex-wrap items-center justify-between shadow-xl gap-4 z-10 relative">
                <div className="flex items-center gap-4">
                    <Link href="/games" className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 active:scale-90 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="hidden sm:block">
                        <span className="text-xs font-black uppercase text-slate-500">Partido en Vivo</span>
                        <h1 className="text-lg font-bold text-white leading-tight truncate max-w-[150px]">vs {game.opponent}</h1>
                    </div>
                </div>

                {/* Scoreboard Central Ligero */}
                <div className="flex items-center gap-3 sm:gap-6 bg-slate-900 rounded-2xl px-6 py-2 border border-slate-700 shadow-inner">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase text-hoops-orange">NOS</span>
                        <span className="text-3xl font-black text-white">{gameScore.us}</span>
                    </div>
                    <span className="text-lg font-black text-slate-600">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase text-red-500">{game.opponent.substring(0, 3)}</span>
                        <span className="text-3xl font-black text-white">{gameScore.them}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleUndo}
                        disabled={history.length === 0}
                        className={`hidden md:flex items-center justify-center p-3 rounded-2xl border ${history.length > 0 ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700 cursor-pointer' : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'} transition-colors`}
                        title="Deshacer Última Acción"
                    >
                        <Undo2 className="w-5 h-5" />
                    </button>
                    <select value={gameOutcome} onChange={(e) => setGameOutcome(e.target.value)} className="hidden lg:flex bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2 outline-none">
                        <option value="TBD">En Curso</option><option value="W">Victoria</option><option value="L">Derrota</option>
                    </select>
                    <button onClick={saveToSupabase} disabled={isSaving} className="px-6 py-3 rounded-2xl font-bold bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 active:scale-95 transition-all flex items-center gap-2">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        <span className="hidden sm:inline">Guardar</span>
                    </button>
                </div>
            </div>

            {/* Panel Principal de Acciones */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-navy-dark via-navy-dark to-slate-900 p-4 sm:p-8 pb-32">
                <h3 className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-4 text-center">Acciones de Cancha</h3>

                {/* Cuadrícula de Botones Rediseñada */}
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="hidden md:flex font-bold uppercase tracking-widest text-[10px] text-slate-500 gap-4 mt-2 mb-2 sm:mb-4 px-2">
                        <span>Score: {gameScore.us}</span>
                        <span>Fallos y Otras Stats</span>
                    </div>

                    {/* Scoring Grid */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-6">
                        {/* 3PT */}
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleActionClick('3PT_MAKE')} className="h-20 sm:h-28 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-emerald-900/10">
                                <span className="text-2xl sm:text-4xl font-black text-emerald-500">+3</span>
                                <span className="text-emerald-500/80 font-bold text-[10px] sm:text-xs">3PT METIDO</span>
                            </button>
                            <button onClick={() => handleActionClick('3PT_MISS')} className="h-12 sm:h-14 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center shadow-inner">
                                <span className="text-red-500/80 font-bold text-[10px] sm:text-xs uppercase tracking-wider">3PT Fallado</span>
                            </button>
                        </div>

                        {/* 2PT */}
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleActionClick('2PT_MAKE')} className="h-20 sm:h-28 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-emerald-900/10">
                                <span className="text-2xl sm:text-4xl font-black text-emerald-500">+2</span>
                                <span className="text-emerald-500/80 font-bold text-[10px] sm:text-xs">2PT METIDO</span>
                            </button>
                            <button onClick={() => handleActionClick('2PT_MISS')} className="h-12 sm:h-14 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center shadow-inner">
                                <span className="text-red-500/80 font-bold text-[10px] sm:text-xs uppercase tracking-wider">2PT Fallado</span>
                            </button>
                        </div>

                        {/* FT */}
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleActionClick('FT_MAKE')} className="h-20 sm:h-28 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-emerald-900/10">
                                <span className="text-2xl sm:text-4xl font-black text-emerald-500">+1</span>
                                <span className="text-emerald-500/80 font-bold text-[10px] sm:text-xs">TL METIDO</span>
                            </button>
                            <button onClick={() => handleActionClick('FT_MISS')} className="h-12 sm:h-14 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center shadow-inner">
                                <span className="text-red-500/80 font-bold text-[10px] sm:text-xs uppercase tracking-wider">TL Fallado</span>
                            </button>
                        </div>
                    </div>

                    {/* Other Stats Grid */}
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
                        <button onClick={() => handleActionClick('OREB')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 active:scale-95 transition-all flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-blue-400">O-REB</span>
                        </button>
                        <button onClick={() => handleActionClick('DREB')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-white">D-REB</span>
                        </button>
                        <button onClick={() => handleActionClick('AST')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-white">AST</span>
                        </button>
                        <button onClick={() => handleActionClick('STL')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-white">STL</span>
                        </button>
                        <button onClick={() => handleActionClick('BLK')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-white">BLK</span>
                        </button>
                        <button onClick={() => handleActionClick('TOV')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-red-900/20 border border-red-500/30 hover:bg-red-900/40 active:scale-95 transition-all flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-red-500">TOV</span>
                        </button>
                        <button onClick={() => handleActionClick('FOUL')} className="col-span-2 md:col-span-1 md:col-start-7 h-16 sm:h-20 rounded-2xl bg-yellow-900/20 border border-yellow-500/30 hover:bg-yellow-900/40 active:scale-95 transition-all flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-yellow-500">FOUL</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12 max-w-7xl mx-auto items-start">
                    {/* Resumen Nuestro Equipo */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-hoops-orange font-bold uppercase tracking-widest text-sm">Nuestras Estadísticas</h3>
                            <button onClick={() => setShowFullBoxScore(true)} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                                <BarChart2 className="w-3.5 h-3.5" /> Stats Completas
                            </button>
                        </div>
                        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase">
                                        <th className="p-3 pl-4 font-bold">Jugador</th>
                                        <th className="p-3 font-bold text-center">PTS</th>
                                        <th className="p-3 font-bold text-center">FG</th>
                                        <th className="p-3 font-bold text-center text-blue-400">O-REB</th>
                                        <th className="p-3 font-bold text-center text-slate-400">D-REB</th>
                                        <th className="p-3 font-bold text-center">AST</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.map((p: any) => {
                                        const s = stats[p.id];
                                        if (!s || (s.points === 0 && s.tiros_campo_intentados === 0 && s.rebotes_totales === 0 && s.asistencias === 0)) return null;
                                        return (
                                            <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors text-white text-sm font-semibold">
                                                <td className="p-3 pl-4 flex items-center gap-2">
                                                    <span className="text-slate-500 text-[10px] w-4">{p.jersey_number}</span>
                                                    {p.first_name} {p.last_name[0]}.
                                                </td>
                                                <td className="p-3 text-center text-hoops-orange font-black">{s.points}</td>
                                                <td className="p-3 text-center text-slate-400 text-xs">{s.tiros_campo_metidos}/{s.tiros_campo_intentados}</td>
                                                <td className="p-3 text-center text-blue-400">{s.rebotes_ofensivos}</td>
                                                <td className="p-3 text-center text-slate-300">{s.rebotes_defensivos}</td>
                                                <td className="p-3 text-center">{s.asistencias}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Resumen Equipo Rival (Global) */}
                    <div>
                        <h3 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4">Estadísticas del Equipo Rival</h3>
                        <div className="bg-red-950/20 rounded-3xl border border-red-900/30 overflow-hidden">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-red-900/30">
                                <div className="bg-slate-900 p-4 flex flex-col items-center">
                                    <span className="text-xs font-bold text-red-500/70 mb-1">PTS</span>
                                    <span className="text-2xl font-black text-white">{gameScore.them}</span>
                                </div>
                                <div className="bg-slate-900 p-4 flex flex-col items-center">
                                    <span className="text-xs font-bold text-red-500/70 mb-1">O-REB</span>
                                    <span className="text-2xl font-black text-white">{opponentStats.rebotes_ofensivos}</span>
                                </div>
                                <div className="bg-slate-900 p-4 flex flex-col items-center">
                                    <span className="text-xs font-bold text-red-500/70 mb-1">D-REB</span>
                                    <span className="text-2xl font-black text-white">{opponentStats.rebotes_defensivos}</span>
                                </div>
                                <div className="bg-slate-900 p-4 flex flex-col items-center">
                                    <span className="text-xs font-bold text-red-500/70 mb-1">AST</span>
                                    <span className="text-2xl font-black text-white">{opponentStats.asistencias}</span>
                                </div>
                                <div className="bg-slate-900 p-4 flex flex-col items-center">
                                    <span className="text-xs font-bold text-red-500/70 mb-1">STL</span>
                                    <span className="text-2xl font-black text-white">{opponentStats.robos}</span>
                                </div>
                                <div className="bg-slate-900 p-4 flex flex-col items-center">
                                    <span className="text-xs font-bold text-red-500/70 mb-1">TOV</span>
                                    <span className="text-2xl font-black text-red-400">{opponentStats.perdidas}</span>
                                </div>
                                <div className="bg-slate-900 p-4 flex flex-col items-center">
                                    <span className="text-xs font-bold text-red-500/70 mb-1">BLK</span>
                                    <span className="text-2xl font-black text-white">{opponentStats.tapones}</span>
                                </div>
                                <div className="bg-slate-900 p-4 flex flex-col items-center">
                                    <span className="text-xs font-bold text-red-500/70 mb-1">FOULS</span>
                                    <span className="text-2xl font-black text-yellow-500">{opponentStats.faltas_personales}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* FULL BOX SCORE MODAL */}
            {showFullBoxScore && (
                <div className="absolute inset-0 z-[60] bg-navy-dark/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-hoops-orange/10 flex items-center justify-center">
                                <BarChart2 className="w-5 h-5 text-hoops-orange" />
                            </div>
                            <h2 className="text-3xl font-black text-white">Estadísticas Completas</h2>
                        </div>
                        <button onClick={() => setShowFullBoxScore(false)} className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition">
                            Cerrar
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto bg-slate-900/50 rounded-3xl border border-slate-800 p-4">
                        <div className="min-w-[1000px]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">
                                        <th className="p-3 font-bold sticky left-0 bg-slate-900 z-10 w-48">Jugador</th>
                                        <th className="p-3 font-black text-white text-center">PTS</th>
                                        <th className="p-3 font-bold text-center">FGM-A</th>
                                        <th className="p-3 font-bold text-center">3PM-A</th>
                                        <th className="p-3 font-bold text-center">FTM-A</th>
                                        <th className="p-3 font-bold text-center text-blue-400/80">OREB</th>
                                        <th className="p-3 font-bold text-center text-slate-400">DREB</th>
                                        <th className="p-3 font-bold text-center text-blue-400">REB</th>
                                        <th className="p-3 font-bold text-center text-emerald-500">AST</th>
                                        <th className="p-3 font-bold text-center">STL</th>
                                        <th className="p-3 font-bold text-center">BLK</th>
                                        <th className="p-3 font-bold text-center text-red-500">TOV</th>
                                        <th className="p-3 font-bold text-center text-yellow-500">PF</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.map((p: any) => {
                                        const s = stats[p.id];
                                        if (!s) return null;
                                        return (
                                            <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors text-white text-sm font-semibold">
                                                <td className="p-3 sticky left-0 bg-slate-900/90 z-10 flex items-center gap-2">
                                                    <span className="text-slate-500 text-[10px] w-4">{p.jersey_number}</span>
                                                    <span className="truncate">{p.first_name} {p.last_name}</span>
                                                </td>
                                                <td className="p-3 text-center text-hoops-orange font-black text-lg">{s.points}</td>
                                                <td className="p-3 text-center text-slate-300 text-xs">{s.tiros_campo_metidos}-{s.tiros_campo_intentados}</td>
                                                <td className="p-3 text-center text-slate-300 text-xs">{s.tiros_3p_metidos}-{s.tiros_3p_intentados}</td>
                                                <td className="p-3 text-center text-slate-300 text-xs">{s.tiros_libres_metidos}-{s.tiros_libres_intentados}</td>
                                                <td className="p-3 text-center text-blue-400/80">{s.rebotes_ofensivos}</td>
                                                <td className="p-3 text-center text-slate-400">{s.rebotes_defensivos}</td>
                                                <td className="p-3 text-center text-blue-400 font-bold">{s.rebotes_totales}</td>
                                                <td className="p-3 text-center text-emerald-500 font-bold">{s.asistencias}</td>
                                                <td className="p-3 text-center">{s.robos}</td>
                                                <td className="p-3 text-center">{s.tapones}</td>
                                                <td className="p-3 text-center text-red-500">{s.perdidas}</td>
                                                <td className="p-3 text-center text-yellow-500">{s.faltas_personales}</td>
                                            </tr>
                                        )
                                    })}
                                    {/* Footer Totals row could go here */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Toast Notification */}
            {toast && (
                <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    <span className="font-bold">{toast.message}</span>
                </div>
            )}
        </div>
    );
}
