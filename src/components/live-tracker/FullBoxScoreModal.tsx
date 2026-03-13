import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function FullBoxScoreModal({
    show,
    onClose,
    players,
    stats
}: {
    show: boolean,
    onClose: () => void,
    players: any[],
    stats: Record<string, any>
}) {
    if (!show) return null;

    return (
        <div className="absolute inset-0 z-[60] bg-navy-dark/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-hoops-orange/10 flex items-center justify-center">
                        <BarChart2 className="w-5 h-5 text-hoops-orange" />
                    </div>
                    <h2 className="text-3xl font-black text-white">Estadísticas Completas</h2>
                </div>
                <button onClick={onClose} className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition">
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
