import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function GameSummaries({
    players,
    stats,
    gameScore,
    opponentStats,
    onShowFullBoxScore
}: {
    players: any[],
    stats: Record<string, any>,
    gameScore: { us: number, them: number },
    opponentStats: any,
    onShowFullBoxScore: () => void
}) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12 max-w-7xl mx-auto items-start">
            {/* Resumen Nuestro Equipo */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-hoops-orange font-bold uppercase tracking-widest text-sm">Nuestras Estadísticas</h3>
                    <button onClick={onShowFullBoxScore} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
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
    );
}
