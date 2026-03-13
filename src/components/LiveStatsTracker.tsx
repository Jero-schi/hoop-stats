'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, ArrowLeft, X, CheckCircle2, AlertCircle, BarChart2, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ActionGrid from './live-tracker/ActionGrid';
import WhoMadePlayModal from './live-tracker/WhoMadePlayModal';
import FullBoxScoreModal from './live-tracker/FullBoxScoreModal';
import GameSummaries from './live-tracker/GameSummaries';

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
                <WhoMadePlayModal
                    activeAction={activeAction}
                    game={game}
                    players={players}
                    onConfirmAction={confirmActionForPlayer}
                    onCancel={() => setActiveAction(null)}
                    getActionColor={getActionColor}
                />
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

                {/* Cuadrícula de Botones Desacoplada */}
                <ActionGrid onActionClick={handleActionClick} gameScore={gameScore} />

                {/* Resúmenes */}
                <GameSummaries
                    players={players}
                    stats={stats}
                    gameScore={gameScore}
                    opponentStats={opponentStats}
                    onShowFullBoxScore={() => setShowFullBoxScore(true)}
                />

            </div>

            {/* FULL BOX SCORE MODAL */}
            <FullBoxScoreModal
                show={showFullBoxScore}
                onClose={() => setShowFullBoxScore(false)}
                players={players}
                stats={stats}
            />

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
